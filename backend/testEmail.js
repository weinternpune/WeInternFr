require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  console.log('\n🔍 Testing email configuration...\n');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '****' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('\n');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not found in .env file!');
    process.exit(1);
  }

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

  try {
    console.log('⏳ Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection successful!\n');
    
    console.log('⏳ Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '🎉 WeIntern - Email Test Successful',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #1B2A4A;">✅ Success!</h1>
            <p style="color: #333; font-size: 16px;">Your WeIntern email configuration is working properly.</p>
            <p style="color: #666; font-size: 14px;">OTP emails will now be sent successfully during registration.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">Test performed at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('\n🎯 Check your inbox:', process.env.EMAIL_USER);
    console.log('   (Also check Spam/Junk folder)\n');
    
  } catch (error) {
    console.error('\n❌ Email test failed!\n');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    
    console.error('\n💡 Common Solutions:');
    console.error('   1. Verify 2-Step Verification is enabled on Gmail');
    console.error('   2. Generate new App Password at: https://myaccount.google.com/apppasswords');
    console.error('   3. Copy App Password without spaces');
    console.error('   4. Update EMAIL_PASS in .env file');
    console.error('   5. Restart the backend server\n');
  }
  
  process.exit();
};

testEmail();
