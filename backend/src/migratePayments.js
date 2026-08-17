require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./src/config/database');
const { Enrollment } = require('./src/models/Enrollment');

const run = async () => {
  await connectDB();

  const enrollments =
    await Enrollment.find({});

  let updated = 0;

  for (const enrollment of enrollments) {
    const existingHistory =
      enrollment.paymentHistory || [];

    if (existingHistory.length > 0) {
      continue;
    }

    const history = [];

    // Existing EMI payments
    if (
      Array.isArray(
        enrollment.emiInstallments
      )
    ) {
      for (
        const installment
        of enrollment.emiInstallments
      ) {
        if (
          installment.status === 'paid' &&
          Number(installment.amount) > 0
        ) {
          history.push({
            amount:
              Number(
                installment.amount
              ),
            paymentId:
              installment.paymentId ||
              `legacy-${enrollment._id}-${installment.installment}`,
            orderId:
              installment.orderId,
            paymentType: 'emi',
            installment:
              installment.installment,
            paidAt:
              installment.paidAt ||
              enrollment.createdAt
          });
        }
      }
    }

    // Existing full-payment record
    if (
      history.length === 0 &&
      enrollment.paymentStatus === 'paid'
    ) {
      const amount =
        Number(
          enrollment.finalPrice ||
          enrollment.coursePrice ||
          0
        );

      if (amount > 0) {
        history.push({
          amount,
          paymentId:
            enrollment.paymentId ||
            `legacy-${enrollment._id}`,
          orderId:
            enrollment.paymentOrderId,
          paymentType: 'full',
          paidAt:
            enrollment.createdAt
        });
      }
    }

    if (history.length === 0) {
      continue;
    }

    enrollment.paymentHistory =
      history;

    enrollment.amountPaid =
      history.reduce(
        (sum, payment) =>
          sum +
          Number(
            payment.amount || 0
          ),
        0
      );

    await enrollment.save();
    updated++;
  }

  console.log(
    `Payment migration complete. Updated ${updated} enrollment(s).`
  );

  await mongoose.connection.close();
};

run().catch(async error => {
  console.error(
    'Payment migration failed:',
    error
  );

  await mongoose.connection.close();
  process.exit(1);
});
