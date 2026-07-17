const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = async (email, name, otp) => {
  const digits = otp.toString().split('');
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🔐 WeIntern – Your Verification OTP',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .header-padding { padding: 30px 20px !important; }
      .body-padding { padding: 30px 20px !important; }
      .header-title { font-size: 28px !important; }
      .otp-container { padding: 24px 16px !important; }
      .otp-digit { width: 42px !important; height: 54px !important; font-size: 24px !important; line-height: 54px !important; }
      .section-box { padding: 18px 16px !important; margin: 0 0 16px !important; }
      .section-title { font-size: 12px !important; }
      .section-text { font-size: 12px !important; }
      .footer-padding { padding: 20px 16px !important; }
      .footer-links { display: block !important; margin: 10px 0 !important; }
      .footer-link { display: block !important; margin: 8px 0 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#0f0c29;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0c29;padding:20px 0">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin:0 auto">

          <!-- Header -->
          <tr>
            <td class="header-padding" style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center;border-bottom:3px solid #E8A820">
              <div style="display:inline-block;background:rgba(232,168,32,0.15);border:1.5px solid rgba(232,168,32,0.4);border-radius:50px;padding:6px 16px;margin-bottom:12px">
                <span style="color:#E8A820;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase">✉️ EMAIL VERIFICATION</span>
              </div>
              <h1 class="header-title" style="color:#ffffff;margin:0;font-size:32px;font-weight:900;letter-spacing:-1px">
                <span style="color:#E8A820">We</span>Intern
              </h1>
              <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:12px;letter-spacing:0.5px">🌱 Where Students Build Opportunity</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="body-padding" style="background:#ffffff;padding:32px 24px;text-align:center">

              <!-- Avatar -->
              <div style="width:64px;height:64px;background:linear-gradient(135deg,#E8A820,#f5c842);border-radius:50%;margin:0 auto 18px;line-height:64px;font-size:28px;box-shadow:0 4px 16px rgba(232,168,32,0.3)">👋</div>

              <h2 style="color:#1B2A4A;margin:0 0 8px;font-size:22px;font-weight:800">Hey <span style="color:#2196C9">${name}</span>! 🎉</h2>
              <p style="color:#64748b;margin:0 0 24px;font-size:14px;line-height:1.6">
                Welcome to <strong style="color:#1B2A4A">WeIntern</strong>! 🚀 You're just <strong style="color:#E8A820">one step away</strong> from joining thousands of students.
              </p>

              <!-- OTP Section -->
              <div class="otp-container" style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:16px;padding:24px 20px;margin:0 0 20px;box-shadow:0 8px 24px rgba(27,42,74,0.2)">
                <p style="color:rgba(255,255,255,0.6);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px">🔢 YOUR ONE-TIME PASSWORD</p>
                <table cellpadding="0" cellspacing="0" border="0" align="center">
                  <tr>
                    ${digits.map((d, i) => `
                      <td style="padding:0 3px">
                        <div class="otp-digit" style="width:45px;height:58px;background:linear-gradient(135deg,#E8A820,#f5c842);color:#1B2A4A;font-size:26px;font-weight:900;border-radius:10px;text-align:center;line-height:58px;font-family:'Courier New',monospace;box-shadow:0 4px 12px rgba(232,168,32,0.25)">${d}</div>
                      </td>
                    `).join('')}
                  </tr>
                </table>
                <div style="margin-top:16px;display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:50px;padding:6px 14px">
                  <span style="color:#fbbf24;font-size:11px;font-weight:600">⏱️ Expires in <strong>10 minutes</strong></span>
                </div>
              </div>

              <!-- Steps -->
              <div class="section-box" style="background:#f0f9ff;border:1.5px solid #bae6fd;border-radius:12px;padding:20px 18px;margin:0 0 16px;text-align:left">
                <p class="section-title" style="color:#0369a1;font-size:12px;font-weight:800;margin:0 0 12px;letter-spacing:0.3px">📋 HOW TO VERIFY:</p>
                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tr>
                    <td style="padding:5px 0">
                      <span style="background:#2196C9;color:#fff;width:20px;height:20px;border-radius:50%;font-size:10px;font-weight:800;display:inline-block;text-align:center;line-height:20px;margin-right:8px">1</span>
                      <span class="section-text" style="color:#0c4a6e;font-size:12px">Go to <strong>WeIntern verification page</strong></span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0">
                      <span style="background:#2196C9;color:#fff;width:20px;height:20px;border-radius:50%;font-size:10px;font-weight:800;display:inline-block;text-align:center;line-height:20px;margin-right:8px">2</span>
                      <span class="section-text" style="color:#0c4a6e;font-size:12px">Enter the <strong>6-digit OTP</strong> above</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0">
                      <span style="background:#2196C9;color:#fff;width:20px;height:20px;border-radius:50%;font-size:10px;font-weight:800;display:inline-block;text-align:center;line-height:20px;margin-right:8px">3</span>
                      <span class="section-text" style="color:#0c4a6e;font-size:12px">Account activates <strong>instantly ✅</strong></span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- What you get -->
              <div class="section-box" style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:18px 16px;margin:0 0 16px;text-align:left">
                <p class="section-title" style="color:#166534;font-size:12px;font-weight:800;margin:0 0 10px">🎯 WHAT YOU GET:</p>
                <p class="section-text" style="color:#15803d;font-size:12px;margin:4px 0">✅ <strong>Real client projects</strong></p>
                <p class="section-text" style="color:#15803d;font-size:12px;margin:4px 0">💰 <strong>Earn stipend</strong> while learning</p>
                <p class="section-text" style="color:#15803d;font-size:12px;margin:4px 0">🏆 <strong>Verified experience</strong></p>
                <p class="section-text" style="color:#15803d;font-size:12px;margin:4px 0">🚀 <strong>Job-ready skills</strong></p>
              </div>

              <!-- Warning -->
              <div class="section-box" style="background:#fffbeb;border:1.5px solid #fcd34d;border-radius:12px;padding:14px 16px;text-align:left">
                <p class="section-text" style="color:#92400e;font-size:11px;margin:0;line-height:1.5">
                  🔒 <strong>Security:</strong> Never share this OTP. WeIntern will <strong>NEVER</strong> ask for OTP via phone or WhatsApp ⚠️
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);border-radius:0 0 16px 16px;padding:24px 20px;text-align:center;border-top:3px solid #E8A820">
              <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 12px;line-height:1.5">
                If you didn't create a WeIntern account, ignore this email. 🙏
              </p>
              <div class="footer-links" style="margin:12px 0">
                <a href="#" class="footer-link" style="color:#E8A820;font-size:10px;text-decoration:none;margin:0 8px;font-weight:600">🔒 Privacy</a>
                <span style="color:rgba(255,255,255,0.2)">|</span>
                <a href="#" class="footer-link" style="color:#E8A820;font-size:10px;text-decoration:none;margin:0 8px;font-weight:600">📄 Terms</a>
                <span style="color:rgba(255,255,255,0.2)">|</span>
                <a href="mailto:contact.weintern@gmail.com" class="footer-link" style="color:#E8A820;font-size:10px;text-decoration:none;margin:0 8px;font-weight:600">💬 Support</a>
              </div>
              <p style="color:rgba(255,255,255,0.25);font-size:10px;margin:0">© 2024 <strong style="color:rgba(255,255,255,0.4)">WeIntern</strong> · India 🇮🇳</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  });
};

const sendResetPasswordEmail = async (email, name, resetLink) => {
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🔑 WeIntern – Reset Your Password',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .header-padding { padding: 30px 20px !important; }
      .body-padding { padding: 30px 20px !important; }
      .header-title { font-size: 28px !important; }
      .body-title { font-size: 20px !important; }
      .body-text { font-size: 13px !important; }
      .reset-button { padding: 14px 32px !important; font-size: 14px !important; }
      .warning-box { padding: 12px 16px !important; margin-top: 20px !important; }
      .warning-text { font-size: 11px !important; }
      .footer-padding { padding: 20px 16px !important; }
      .avatar { width: 64px !important; height: 64px !important; line-height: 64px !important; font-size: 28px !important; margin-bottom: 18px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#0f0c29;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0c29;padding:20px 0">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin:0 auto">

          <!-- Header -->
          <tr>
            <td class="header-padding" style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center;border-bottom:3px solid #E8A820">
              <div style="display:inline-block;background:rgba(220,38,38,0.15);border:1.5px solid rgba(220,38,38,0.4);border-radius:50px;padding:6px 16px;margin-bottom:12px">
                <span style="color:#f87171;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase">🔑 PASSWORD RESET</span>
              </div>
              <h1 class="header-title" style="color:#ffffff;margin:0;font-size:32px;font-weight:900;letter-spacing:-1px">
                <span style="color:#E8A820">We</span>Intern
              </h1>
              <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:12px;letter-spacing:0.5px">🌱 Where Students Build Opportunity</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="body-padding" style="background:#ffffff;padding:32px 24px;text-align:center">

              <!-- Avatar -->
              <div class="avatar" style="width:72px;height:72px;background:linear-gradient(135deg,#dc2626,#ef4444);border-radius:50%;margin:0 auto 20px;line-height:72px;font-size:32px;box-shadow:0 4px 16px rgba(220,38,38,0.3)">🔑</div>

              <h2 class="body-title" style="color:#1B2A4A;margin:0 0 8px;font-size:22px;font-weight:800">Reset Your Password</h2>
              <p class="body-text" style="color:#64748b;margin:0 0 24px;font-size:14px;line-height:1.6">
                Hi <strong style="color:#2196C9">${name}</strong>! 👋 We received a request to reset your <strong style="color:#1B2A4A">WeIntern password</strong>. Click the button below to set a new one.
              </p>

              <!-- Reset Button -->
              <a href="${resetLink}" class="reset-button" style="display:inline-block;background:linear-gradient(135deg,#E8A820,#f5c842);color:#1B2A4A;padding:15px 38px;border-radius:50px;text-decoration:none;font-weight:800;font-size:15px;box-shadow:0 4px 16px rgba(232,168,32,0.35);letter-spacing:0.3px;margin:0 0 20px">
                🔐 Reset My Password →
              </a>

              <!-- Warning Box -->
              <div class="warning-box" style="margin-top:24px;background:#fef3c7;border:1.5px solid #fcd34d;border-radius:12px;padding:14px 18px;text-align:left">
                <p class="warning-text" style="color:#92400e;font-size:12px;margin:0;line-height:1.5">
                  ⏱️ This link <strong>expires in 1 hour</strong>. If you did not request this, <strong>ignore this email</strong> — your password will remain unchanged. 🔒
                </p>
              </div>

              <!-- Security Info -->
              <div style="margin-top:16px;background:#f0f9ff;border:1.5px solid #bae6fd;border-radius:12px;padding:14px 18px;text-align:left">
                <p style="color:#0369a1;font-size:11px;font-weight:700;margin:0 0 8px;letter-spacing:0.3px">🛡️ SECURITY TIPS:</p>
                <p style="color:#0c4a6e;font-size:11px;margin:4px 0;line-height:1.5">✅ Use a strong, unique password</p>
                <p style="color:#0c4a6e;font-size:11px;margin:4px 0;line-height:1.5">✅ Never share your password</p>
                <p style="color:#0c4a6e;font-size:11px;margin:4px 0;line-height:1.5">✅ Enable two-factor authentication</p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);border-radius:0 0 16px 16px;padding:24px 20px;text-align:center;border-top:3px solid #E8A820">
              <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 12px;line-height:1.5">
                If you didn't request a password reset, ignore this email. 🙏
              </p>
              <div style="margin:12px 0">
                <a href="#" style="color:#E8A820;font-size:10px;text-decoration:none;margin:0 8px;font-weight:600">🔒 Privacy</a>
                <span style="color:rgba(255,255,255,0.2)">|</span>
                <a href="#" style="color:#E8A820;font-size:10px;text-decoration:none;margin:0 8px;font-weight:600">📄 Terms</a>
                <span style="color:rgba(255,255,255,0.2)">|</span>
                <a href="mailto:contact.weintern@gmail.com" style="color:#E8A820;font-size:10px;text-decoration:none;margin:0 8px;font-weight:600">💬 Support</a>
              </div>
              <p style="color:rgba(255,255,255,0.25);font-size:10px;margin:0">© 2024 <strong style="color:rgba(255,255,255,0.4)">WeIntern</strong> · India 🇮🇳</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  });
};

const sendApplicationConfirmation = async (email, name, duration) => {
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🎉 WeIntern – Application Received!',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .header-padding { padding: 30px 20px !important; }
      .body-padding { padding: 30px 20px !important; }
      .header-title { font-size: 28px !important; }
      .body-title { font-size: 20px !important; }
      .body-text { font-size: 13px !important; }
      .section-box { padding: 18px 16px !important; margin: 0 0 16px !important; }
      .section-title { font-size: 12px !important; }
      .section-text { font-size: 11px !important; }
      .footer-padding { padding: 20px 16px !important; }
      .avatar { width: 64px !important; height: 64px !important; line-height: 64px !important; font-size: 28px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#0f0c29;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0c29;padding:20px 0">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin:0 auto">

          <!-- Header -->
          <tr>
            <td class="header-padding" style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center;border-bottom:3px solid #E8A820">
              <div style="display:inline-block;background:rgba(5,150,105,0.15);border:1.5px solid rgba(5,150,105,0.4);border-radius:50px;padding:6px 16px;margin-bottom:12px">
                <span style="color:#10b981;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase">🎉 APPLICATION</span>
              </div>
              <h1 class="header-title" style="color:#ffffff;margin:0;font-size:32px;font-weight:900;letter-spacing:-1px">
                <span style="color:#E8A820">We</span>Intern
              </h1>
              <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:12px;letter-spacing:0.5px">🌱 Where Students Build Opportunity</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="body-padding" style="background:#ffffff;padding:32px 24px;text-align:center">

              <!-- Avatar -->
              <div class="avatar" style="width:72px;height:72px;background:linear-gradient(135deg,#059669,#10b981);border-radius:50%;margin:0 auto 20px;line-height:72px;font-size:32px;box-shadow:0 4px 16px rgba(5,150,105,0.3)">🎉</div>

              <h2 class="body-title" style="color:#1B2A4A;margin:0 0 8px;font-size:22px;font-weight:800">Application Received! ✅</h2>
              <p class="body-text" style="color:#64748b;margin:0 0 24px;font-size:14px;line-height:1.6">
                Hi <strong style="color:#2196C9">${name}</strong>! 🙌 Your <strong style="color:#E8A820">${duration} Internship</strong> application has been <strong style="color:#059669">successfully submitted</strong>!
              </p>

              <!-- What's Next -->
              <div class="section-box" style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:20px 18px;margin:0 0 16px;text-align:left">
                <p class="section-title" style="color:#166534;font-size:12px;font-weight:800;margin:0 0 12px;letter-spacing:0.3px">📅 WHAT HAPPENS NEXT:</p>
                <p class="section-text" style="color:#15803d;font-size:12px;margin:5px 0;line-height:1.5">🔍 <strong>Review:</strong> Our team reviews applications within <strong>3–5 business days</strong></p>
                <p class="section-text" style="color:#15803d;font-size:12px;margin:5px 0;line-height:1.5">📧 <strong>Update:</strong> You'll receive an <strong>email update</strong> on your status</p>
                <p class="section-text" style="color:#15803d;font-size:12px;margin:5px 0;line-height:1.5">🤝 <strong>Onboarding:</strong> If accepted, we'll <strong>guide you</strong> through next steps</p>
              </div>

              <!-- Success Message -->
              <div style="background:#eff6ff;border:1.5px solid #93c5fd;border-radius:12px;padding:16px 18px">
                <p style="color:#1d4ed8;font-size:13px;font-weight:700;margin:0">🚀 You're one step closer to building your future!</p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);border-radius:0 0 16px 16px;padding:24px 20px;text-align:center;border-top:3px solid #E8A820">
              <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 12px">
                Questions? Contact us at <a href="mailto:contact.weintern@gmail.com" style="color:#E8A820;text-decoration:none">contact.weintern@gmail.com</a>
              </p>
              <p style="color:rgba(255,255,255,0.25);font-size:10px;margin:0">© 2024 <strong style="color:rgba(255,255,255,0.4)">WeIntern</strong> · India 🇮🇳</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  });
};

const sendEnrollmentConfirmation = async (email, name, courseName) => {
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `🚀 WeIntern – You're Enrolled in ${courseName}!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .header-padding { padding: 30px 20px !important; }
      .body-padding { padding: 30px 20px !important; }
      .header-title { font-size: 28px !important; }
      .body-title { font-size: 20px !important; }
      .body-text { font-size: 13px !important; }
      .section-box { padding: 18px 16px !important; margin: 0 0 16px !important; }
      .section-title { font-size: 12px !important; }
      .section-text { font-size: 11px !important; }
      .footer-padding { padding: 20px 16px !important; }
      .avatar { width: 64px !important; height: 64px !important; line-height: 64px !important; font-size: 28px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#0f0c29;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0c29;padding:20px 0">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin:0 auto">

          <!-- Header -->
          <tr>
            <td class="header-padding" style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center;border-bottom:3px solid #E8A820">
              <div style="display:inline-block;background:rgba(33,150,201,0.15);border:1.5px solid rgba(33,150,201,0.4);border-radius:50px;padding:6px 16px;margin-bottom:12px">
                <span style="color:#60a5fa;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase">🚀 ENROLLMENT</span>
              </div>
              <h1 class="header-title" style="color:#ffffff;margin:0;font-size:32px;font-weight:900;letter-spacing:-1px">
                <span style="color:#E8A820">We</span>Intern
              </h1>
              <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:12px;letter-spacing:0.5px">🌱 Where Students Build Opportunity</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="body-padding" style="background:#ffffff;padding:32px 24px;text-align:center">

              <!-- Avatar -->
              <div class="avatar" style="width:72px;height:72px;background:linear-gradient(135deg,#2196C9,#1976d2);border-radius:50%;margin:0 auto 20px;line-height:72px;font-size:32px;box-shadow:0 4px 16px rgba(33,150,201,0.3)">🚀</div>

              <h2 class="body-title" style="color:#1B2A4A;margin:0 0 8px;font-size:22px;font-weight:800">You're Enrolled! 🎓</h2>
              <p class="body-text" style="color:#64748b;margin:0 0 24px;font-size:14px;line-height:1.6">
                Hi <strong style="color:#2196C9">${name}</strong>! 🙌 Welcome to <strong style="color:#1B2A4A">${courseName}</strong>. Your learning journey starts <strong style="color:#E8A820">right now!</strong>
              </p>

              <!-- Course Active -->
              <div class="section-box" style="background:#eff6ff;border:1.5px solid #93c5fd;border-radius:12px;padding:20px 18px;margin:0 0 16px;text-align:left">
                <p class="section-title" style="color:#1d4ed8;font-size:12px;font-weight:800;margin:0 0 12px;letter-spacing:0.3px">📚 YOUR COURSE IS NOW ACTIVE:</p>
                <p class="section-text" style="color:#1e40af;font-size:12px;margin:5px 0;line-height:1.5">🖥️ <strong>Login</strong> to your dashboard to access materials</p>
                <p class="section-text" style="color:#1e40af;font-size:12px;margin:5px 0;line-height:1.5">👥 <strong>Join</strong> your assigned intern team</p>
                <p class="section-text" style="color:#1e40af;font-size:12px;margin:5px 0;line-height:1.5">💼 <strong>Work</strong> on real client projects from day one</p>
                <p class="section-text" style="color:#1e40af;font-size:12px;margin:5px 0;line-height:1.5">💰 <strong>Earn</strong> stipend upon successful completion</p>
              </div>

              <!-- Success Message -->
              <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:16px 18px">
                <p style="color:#166534;font-size:13px;font-weight:700;margin:0">✨ The best investment you'll ever make is in yourself!</p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);border-radius:0 0 16px 16px;padding:24px 20px;text-align:center;border-top:3px solid #E8A820">
              <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 12px">
                Need help? Contact us at <a href="mailto:contact.weintern@gmail.com" style="color:#E8A820;text-decoration:none">contact.weintern@gmail.com</a>
              </p>
              <p style="color:rgba(255,255,255,0.25);font-size:10px;margin:0">© 2024 <strong style="color:rgba(255,255,255,0.4)">WeIntern</strong> · India 🇮🇳</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  });
};

const sendHireInquiryNotification = async (data) => {
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🏢 New Hire Inquiry from ${data.company}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .header-padding { padding: 30px 20px !important; }
      .body-padding { padding: 28px 20px !important; }
      .header-title { font-size: 24px !important; }
      .info-row { padding: 10px 12px !important; }
      .info-label { font-size: 11px !important; min-width: 90px !important; }
      .info-value { font-size: 12px !important; }
      .description-box { padding: 16px !important; }
      .description-text { font-size: 12px !important; }
      .footer-padding { padding: 20px 16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#0f0c29;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0c29;padding:20px 0">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin:0 auto">

          <!-- Header -->
          <tr>
            <td class="header-padding" style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center;border-bottom:3px solid #E8A820">
              <div style="display:inline-block;background:rgba(220,38,38,0.2);border:1.5px solid rgba(220,38,38,0.4);border-radius:50px;padding:6px 16px;margin-bottom:12px">
                <span style="color:#f87171;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase">🔔 NEW INQUIRY</span>
              </div>
              <h1 class="header-title" style="color:#ffffff;margin:0;font-size:26px;font-weight:900;letter-spacing:-0.5px">🏢 Hire Request</h1>
              <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:12px">WeIntern Admin Notification</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="body-padding" style="background:#ffffff;padding:30px 24px">

              ${[
                ['🏢 Company', data.company, '#E8A820'],
                ['👤 Contact', data.name, '#2196C9'],
                ['📧 Email', data.email, '#059669'],
                ['📱 Phone', data.phone, '#7c3aed'],
                ['⚙️ Services', data.services?.join(', '), '#dc2626'],
                ['💰 Budget', data.budget, '#d97706'],
              ].map(([label, value, color]) => `
                <div class="info-row" style="display:flex;align-items:center;padding:11px 14px;border-radius:10px;background:#f8fafc;margin-bottom:8px;border-left:4px solid ${color}">
                  <span class="info-label" style="color:#64748b;font-size:11px;font-weight:700;min-width:100px;letter-spacing:0.3px">${label}</span>
                  <span class="info-value" style="color:#1B2A4A;font-size:13px;font-weight:600;word-break:break-word">${value || '—'}</span>
                </div>`).join('')}

              <!-- Description -->
              <div class="description-box" style="margin-top:16px;background:#f0f9ff;border:1.5px solid #bae6fd;border-radius:12px;padding:18px">
                <p style="color:#0369a1;font-size:11px;font-weight:800;margin:0 0 10px;letter-spacing:0.3px">📝 PROJECT DESCRIPTION:</p>
                <p class="description-text" style="color:#0c4a6e;font-size:13px;line-height:1.6;margin:0;word-wrap:break-word">${data.description}</p>
              </div>

              <!-- Action Required -->
              <div style="margin-top:16px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:12px;padding:14px;text-align:center">
                <p style="color:#92400e;font-size:12px;font-weight:700;margin:0">⚡ Respond within <strong>24 hours</strong> to secure this client! 🎯</p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);border-radius:0 0 16px 16px;padding:24px 20px;text-align:center;border-top:3px solid #E8A820">
              <p style="color:rgba(255,255,255,0.25);font-size:10px;margin:0">© 2024 <strong style="color:rgba(255,255,255,0.4)">WeIntern</strong> Admin Panel · India 🇮🇳</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  });
};

module.exports = {
  sendOTPEmail,
  sendResetPasswordEmail,
  sendApplicationConfirmation,
  sendEnrollmentConfirmation,
  sendHireInquiryNotification
};
