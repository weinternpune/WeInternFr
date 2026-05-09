require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('FULL ERROR:', error);
  } else {
    console.log('SMTP Connected! Sending...');
    transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: 'WeIntern Test',
      text: 'Email is working!'
    }).then(() => console.log('Email sent!'))
      .catch(e => console.log('Send Error:', e.message));
  }
});
