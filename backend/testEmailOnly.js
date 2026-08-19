require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n🔍 Testing Email Configuration...\n');
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? '****' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
console.log('📝 EMAIL_PASS Length:', process.env.EMAIL_PASS?.length || 0);
console.log('\n');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function testEmail() {
  try {
    console.log('🔄 Verifying SMTP connection...\n');
    
    await transporter.verify();
    
    console.log('✅ SMTP Connection Verified Successfully!\n');
    console.log('📤 Sending test email...\n');
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: '✅ WeIntern Email Test - SUCCESS',
      text: 'If you receive this email, your Gmail App Password is working correctly!',
      html: '<h2>✅ Success!</h2><p>Your Gmail App Password is configured correctly.</p>'
    });
    
    console.log('✅ Test Email Sent Successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('\n🎉 Email configuration is working perfectly!\n');
    
  } catch (error) {
    console.error('\n❌ EMAIL TEST FAILED!\n');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('\n');
    
    if (error.code === 'EAUTH') {
      console.log('🔴 AUTHENTICATION FAILED - Possible reasons:\n');
      console.log('1. ❌ Gmail App Password is incorrect or expired');
      console.log('2. ❌ 2-Step Verification is not enabled on Gmail account');
      console.log('3. ❌ App Password was not generated correctly\n');
      console.log('📝 Steps to fix:\n');
      console.log('   1. Go to: https://myaccount.google.com/apppasswords');
      console.log('   2. Make sure 2-Step Verification is ON');
      console.log('   3. Generate NEW App Password for "Mail"');
      console.log('   4. Copy the 16-character password (remove spaces)');
      console.log('   5. Update EMAIL_PASS in .env file');
      console.log('   6. Restart the server\n');
    }
    
    process.exit(1);
  }
}

testEmail();
