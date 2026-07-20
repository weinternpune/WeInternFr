const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const { Enrollment } = require('../models/Enrollment');
const { sendEnrollmentConfirmation } = require('../utils/email');

// ── Helper: send pending payment reminder email ──
const sendPendingPaymentEmail = async (email, name, courseName, amount, enrollmentId) => {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `⚠️ Payment Pending — Complete your enrollment for ${courseName}`,
    html: `
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);padding:40px 32px;text-align:center">
        <h1 style="color:#E8A820;font-size:28px;margin:0;font-weight:900">WeIntern</h1>
        <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px">Learn. Build. Earn.</p>
      </div>
      <div style="padding:32px">
        <div style="background:#fff8e1;border:1px solid #f59e0b;border-left:4px solid #f59e0b;border-radius:10px;padding:16px;margin-bottom:24px">
          <p style="color:#92400e;font-size:14px;margin:0;font-weight:700">⚠️ Payment Pending</p>
          <p style="color:#92400e;font-size:13px;margin:6px 0 0">Your enrollment for <strong>${courseName}</strong> is pending payment.</p>
        </div>
        <p style="color:#1B2A4A;font-size:16px">Hi <strong>${name}</strong>,</p>
        <p style="color:#6b7280;font-size:14px;line-height:1.7">You started enrolling in <strong>${courseName}</strong> but the payment of <strong>₹${Number(amount).toLocaleString('en-IN')}</strong> is still pending.</p>
        <p style="color:#6b7280;font-size:14px;line-height:1.7">Complete your payment now to secure your seat and start learning.</p>
        <div style="text-align:center;margin:32px 0">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background:#E8A820;color:#1B2A4A;padding:14px 32px;border-radius:50px;font-weight:800;font-size:15px;text-decoration:none;display:inline-block">
            Complete Payment →
          </a>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:16px;margin-bottom:24px">
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px"><strong>Course:</strong> ${courseName}</p>
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px"><strong>Amount Due:</strong> ₹${Number(amount).toLocaleString('en-IN')}</p>
          <p style="color:#dc4545;font-size:13px;margin:0"><strong>Status:</strong> Payment Pending ⏳</p>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center">If you have any issues, contact us at <a href="mailto:internship.weintern@gmail.com" style="color:#E8A820">internship.weintern@gmail.com</a></p>
      </div>
    </div>`
  });
};

// ── Helper: send payment success email ──
const sendPaymentSuccessEmail = async (email, name, courseName, amount, paymentId, paymentType, installmentNum) => {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const isEmi = paymentType === 'emi';
  const subject = isEmi
    ? `✅ EMI ${installmentNum}/3 Received — ${courseName}`
    : `🎉 Payment Confirmed — Welcome to ${courseName}!`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html: `
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);padding:40px 32px;text-align:center">
        <h1 style="color:#E8A820;font-size:28px;margin:0;font-weight:900">WeIntern</h1>
        <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px">Learn. Build. Earn.</p>
      </div>
      <div style="padding:32px">
        <div style="background:#f0fdf4;border:1px solid #86efac;border-left:4px solid #22c55e;border-radius:10px;padding:16px;margin-bottom:24px;text-align:center">
          <p style="color:#15803d;font-size:24px;margin:0">✅</p>
          <p style="color:#15803d;font-size:16px;margin:8px 0 0;font-weight:700">
            ${isEmi ? `EMI Installment ${installmentNum}/3 Received!` : 'Payment Successful!'}
          </p>
        </div>
        <p style="color:#1B2A4A;font-size:16px">Hi <strong>${name}</strong>,</p>
        <p style="color:#6b7280;font-size:14px;line-height:1.7">
          ${isEmi
            ? `Your <strong>installment ${installmentNum} of 3</strong> for <strong>${courseName}</strong> has been received successfully.`
            : `Your payment for <strong>${courseName}</strong> has been confirmed. Welcome to WeIntern! 🎉`
          }
        </p>
        <div style="background:#f8fafc;border-radius:10px;padding:16px;margin:24px 0">
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px"><strong>Course:</strong> ${courseName}</p>
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px"><strong>Amount Paid:</strong> ₹${Number(amount).toLocaleString('en-IN')}</p>
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px"><strong>Payment ID:</strong> ${paymentId}</p>
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px"><strong>Type:</strong> ${isEmi ? `EMI (Installment ${installmentNum}/3)` : 'Full Payment'}</p>
          <p style="color:#22c55e;font-size:13px;margin:0"><strong>Status:</strong> Confirmed ✅</p>
        </div>
        ${isEmi && installmentNum < 3 ? `
        <div style="background:#fff8e1;border:1px solid #f59e0b;border-radius:10px;padding:16px;margin-bottom:24px">
          <p style="color:#92400e;font-size:13px;margin:0"><strong>📅 Next installment</strong> is due in 20 days. You will receive a reminder email.</p>
        </div>` : ''}
        <div style="text-align:center;margin:32px 0">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background:#18b45b;color:white;padding:14px 32px;border-radius:50px;font-weight:800;font-size:15px;text-decoration:none;display:inline-block">
            Go to Dashboard →
          </a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center">Questions? <a href="mailto:internship.weintern@gmail.com" style="color:#E8A820">internship.weintern@gmail.com</a></p>
      </div>
    </div>`
  });
};

// ── Create Order ──────────────────────────────────────────
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, enrollmentId, paymentType, emiInstallment,
            couponApplied, couponCode, originalPrice, discountAmount, finalPrice } = req.body;

    if (!amount) return res.status(400).json({ success: false, message: 'Amount is required' });

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return res.status(500).json({ success: false, message: 'Razorpay not configured' });

    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${enrollmentId || Date.now()}`,
      notes: {
        userId: req.user?._id?.toString(),
        enrollmentId: enrollmentId || null,
        paymentType: paymentType || 'full',
        emiInstallment: emiInstallment || null
      }
    });

    // Send pending payment email if this is a new enrollment (first time)
    if (enrollmentId && (!emiInstallment || emiInstallment === 1)) {
      try {
        const enrollment = await Enrollment.findById(enrollmentId);
        if (enrollment && enrollment.paymentStatus === 'pending') {
          await sendPendingPaymentEmail(
            enrollment.email,
            enrollment.name,
            enrollment.courseName,
            amount,
            enrollmentId
          );
        }
      } catch (emailErr) {
        console.error('Pending email error:', emailErr.message);
      }
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create order' });
  }
});

// ── Verify Payment ────────────────────────────────────────
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,
            enrollmentId, paymentType, emiInstallment, amount,
            couponApplied, couponCode, originalPrice, discountAmount, finalPrice } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    let enrollment = null;

    if (enrollmentId && enrollmentId !== 'null') {
      enrollment = await Enrollment.findById(enrollmentId);

      if (paymentType === 'emi' && emiInstallment) {
        const installmentNum = Number(emiInstallment);
        const installmentData = {
          installment: installmentNum,
          amount: Number(amount),
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          paidAt: new Date(),
          status: 'paid'
        };

        const existingCount = enrollment?.emiInstallments?.length || 0;
        const updateData = {
          $push: { emiInstallments: installmentData },
          paymentType: 'emi',
        };

        if (existingCount + 1 >= 3) {
          updateData.paymentStatus = 'paid';
          updateData.paymentId = razorpay_payment_id;
          updateData.status = 'enrolled';
        } else {
          updateData.paymentStatus = `emi_${installmentNum}`;
        }

        if (installmentNum === 1 && couponApplied) {
          updateData.couponApplied = true;
          updateData.couponCode = couponCode;
          updateData.originalPrice = originalPrice;
          updateData.discountAmount = discountAmount;
          updateData.finalPrice = finalPrice;
        }

        enrollment = await Enrollment.findByIdAndUpdate(enrollmentId, updateData, { new: true });
      } else {
        // Full payment
        enrollment = await Enrollment.findByIdAndUpdate(enrollmentId, {
          paymentId: razorpay_payment_id,
          paymentOrderId: razorpay_order_id,
          paymentStatus: 'paid',
          paymentType: 'full',
          status: 'enrolled',
          ...(couponApplied && { couponApplied: true, couponCode, originalPrice, discountAmount, finalPrice })
        }, { new: true });
      }
    }

    // ── Send confirmation email AFTER successful payment ──
    if (enrollment) {
      try {
        await sendPaymentSuccessEmail(
          enrollment.email,
          enrollment.name,
          enrollment.courseName,
          Number(amount),
          razorpay_payment_id,
          paymentType || 'full',
          emiInstallment ? Number(emiInstallment) : null
        );

        // Also send full enrollment confirmation on full payment or final EMI
        const isFinalEmi = paymentType === 'emi' && Number(emiInstallment) === 3;
        const isFullPayment = paymentType === 'full' || !paymentType;
        if (isFullPayment || isFinalEmi) {
          await sendEnrollmentConfirmation(enrollment.email, enrollment.name, enrollment.courseName);
        }
      } catch (emailErr) {
        console.error('Confirmation email error:', emailErr.message);
        // Don't fail the payment for email errors
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ success: false, message: err.message || 'Verification failed' });
  }
});

module.exports = router;
