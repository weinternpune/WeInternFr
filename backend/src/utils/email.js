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
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);font-family:'Segoe UI',Arial,sans-serif;min-height:100vh">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1B2A4A 0%,#0d1b2e 100%);border-radius:24px 24px 0 0;padding:40px;text-align:center;border-bottom:3px solid #E8A820">
          <div style="display:inline-block;background:rgba(232,168,32,0.15);border:1.5px solid rgba(232,168,32,0.4);border-radius:50px;padding:7px 20px;margin-bottom:18px">
            <span style="color:#E8A820;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase">✉️ Email Verification</span>
          </div>
          <h1 style="color:#ffffff;margin:0;font-size:32px;font-weight:900;letter-spacing:-1px">
            <span style="color:#E8A820">We</span>Intern
          </h1>
          <p style="color:rgba(255,255,255,0.45);margin:8px 0 0;font-size:13px;letter-spacing:1px">🌱 Where Students Build Opportunity</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:linear-gradient(180deg,#ffffff 0%,#f8faff 100%);padding:44px 40px 36px;text-align:center">

          <!-- Avatar -->
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#E8A820,#f5c842);border-radius:50%;margin:0 auto 22px;line-height:72px;font-size:32px;box-shadow:0 8px 24px rgba(232,168,32,0.35)">👋</div>

          <h2 style="color:#1B2A4A;margin:0 0 6px;font-size:24px;font-weight:800">Hey <span style="color:#2196C9">${name}</span>! 🎉</h2>
          <p style="color:#64748b;margin:0 0 32px;font-size:15px;line-height:1.7">
            Welcome to <strong style="color:#1B2A4A">WeIntern</strong>! 🚀 You're just <strong style="color:#E8A820">one step away</strong> from joining thousands of students building real careers.
          </p>

          <!-- OTP Section -->
          <div style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:20px;padding:32px 24px;margin:0 0 28px;box-shadow:0 12px 40px rgba(27,42,74,0.25)">
            <p style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 20px">🔢 Your One-Time Password</p>
            <div style="display:inline-flex;gap:0;justify-content:center">
              ${digits.map((d, i) => `
                <span style="display:inline-block;width:50px;height:64px;background:linear-gradient(135deg,#E8A820,#f5c842);color:#1B2A4A;font-size:28px;font-weight:900;border-radius:${i===0?'12px 0 0 12px':i===5?'0 12px 12px 0':'0'};text-align:center;line-height:64px;font-family:'Courier New',monospace;box-shadow:0 6px 16px rgba(232,168,32,0.3);${i>0?'border-left:2px solid rgba(27,42,74,0.2)':''}">${d}</span>
              `).join('')}
            </div>
            <div style="margin-top:20px;display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:50px;padding:7px 18px">
              <span style="color:#fbbf24;font-size:12px;font-weight:600">⏱️ Expires in <strong>10 minutes</strong></span>
            </div>
          </div>

          <!-- Steps -->
          <div style="background:#f0f9ff;border:1.5px solid #bae6fd;border-radius:16px;padding:24px;margin:0 0 20px;text-align:left">
            <p style="color:#0369a1;font-size:13px;font-weight:800;margin:0 0 14px;letter-spacing:0.5px">📋 HOW TO VERIFY YOUR ACCOUNT:</p>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:6px 0">
                  <span style="background:linear-gradient(135deg,#2196C9,#1976d2);color:#fff;width:22px;height:22px;border-radius:50%;font-size:11px;font-weight:800;display:inline-block;text-align:center;line-height:22px;margin-right:10px">1</span>
                  <span style="color:#0c4a6e;font-size:13px">Go back to the <strong>WeIntern verification page</strong></span>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0">
                  <span style="background:linear-gradient(135deg,#2196C9,#1976d2);color:#fff;width:22px;height:22px;border-radius:50%;font-size:11px;font-weight:800;display:inline-block;text-align:center;line-height:22px;margin-right:10px">2</span>
                  <span style="color:#0c4a6e;font-size:13px">Enter the <strong>6-digit OTP</strong> shown above</span>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0">
                  <span style="background:linear-gradient(135deg,#2196C9,#1976d2);color:#fff;width:22px;height:22px;border-radius:50%;font-size:11px;font-weight:800;display:inline-block;text-align:center;line-height:22px;margin-right:10px">3</span>
                  <span style="color:#0c4a6e;font-size:13px">Your account activates <strong>instantly ✅</strong></span>
                </td>
              </tr>
            </table>
          </div>

          <!-- What you get -->
          <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #86efac;border-radius:16px;padding:20px;margin:0 0 20px;text-align:left">
            <p style="color:#166534;font-size:13px;font-weight:800;margin:0 0 10px">🎯 WHAT YOU GET WITH WEINTERN:</p>
            <p style="color:#15803d;font-size:13px;margin:4px 0">✅ <strong>Real client projects</strong> — not fake tutorials</p>
            <p style="color:#15803d;font-size:13px;margin:4px 0">💰 <strong>Earn a stipend</strong> while you learn</p>
            <p style="color:#15803d;font-size:13px;margin:4px 0">🏆 <strong>Verified experience</strong> for your resume</p>
            <p style="color:#15803d;font-size:13px;margin:4px 0">🚀 <strong>Job-ready skills</strong> from day one</p>
          </div>

          <!-- Warning -->
          <div style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1.5px solid #fcd34d;border-radius:12px;padding:16px 20px;text-align:left">
            <p style="color:#92400e;font-size:12px;margin:0;line-height:1.6">
              🔒 <strong>Security Notice:</strong> Never share this OTP with anyone. <strong>WeIntern will NEVER</strong> ask for your OTP via phone, WhatsApp, or chat. If someone asks — it's a scam ⚠️
            </p>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);border-radius:0 0 24px 24px;padding:28px 40px;text-align:center;border-top:3px solid #E8A820">
          <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:0 0 10px;line-height:1.6">
            If you did not create a WeIntern account, please ignore this email safely. 🙏
          </p>
          <div style="margin:14px 0">
            <a href="#" style="color:#E8A820;font-size:11px;text-decoration:none;margin:0 10px;font-weight:600">🔒 Privacy Policy</a>
            <span style="color:rgba(255,255,255,0.15)">|</span>
            <a href="#" style="color:#E8A820;font-size:11px;text-decoration:none;margin:0 10px;font-weight:600">📄 Terms of Service</a>
            <span style="color:rgba(255,255,255,0.15)">|</span>
            <a href="mailto:contact.weintern@gmail.com" style="color:#E8A820;font-size:11px;text-decoration:none;margin:0 10px;font-weight:600">💬 Support</a>
          </div>
          <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">© 2024 <strong style="color:rgba(255,255,255,0.4)">WeIntern</strong> · India 🇮🇳 · Remote-First · Built with ❤️</p>
        </td></tr>

      </table>
    </td></tr>
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
<body style="margin:0;padding:0;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%">
        <tr><td style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:24px 24px 0 0;padding:40px;text-align:center;border-bottom:3px solid #E8A820">
          <h1 style="color:#fff;margin:0;font-size:32px;font-weight:900"><span style="color:#E8A820">We</span>Intern</h1>
          <p style="color:rgba(255,255,255,0.45);margin:8px 0 0;font-size:13px">🔑 Password Reset Request</p>
        </td></tr>
        <tr><td style="background:linear-gradient(180deg,#ffffff,#f8faff);padding:44px 40px;text-align:center">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#dc2626,#ef4444);border-radius:50%;margin:0 auto 22px;line-height:72px;font-size:32px;box-shadow:0 8px 24px rgba(220,38,38,0.3)">🔑</div>
          <h2 style="color:#1B2A4A;margin:0 0 8px;font-size:24px;font-weight:800">Reset Your Password</h2>
          <p style="color:#64748b;font-size:15px;line-height:1.7;margin:0 0 28px">
            Hi <strong style="color:#2196C9">${name}</strong>! 👋 We received a request to reset your <strong style="color:#1B2A4A">WeIntern password</strong>. Click the button below to set a new one.
          </p>
          <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#E8A820,#f5c842);color:#1B2A4A;padding:16px 42px;border-radius:50px;text-decoration:none;font-weight:800;font-size:16px;box-shadow:0 6px 20px rgba(232,168,32,0.4);letter-spacing:0.3px">
            🔐 Reset My Password →
          </a>
          <div style="margin-top:24px;background:#fef3c7;border:1.5px solid #fcd34d;border-radius:12px;padding:14px 20px">
            <p style="color:#92400e;font-size:12px;margin:0">⏱️ This link <strong>expires in 1 hour</strong>. If you did not request this, <strong>ignore this email</strong> — your password will remain unchanged. 🔒</p>
          </div>
        </td></tr>
        <tr><td style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);border-radius:0 0 24px 24px;padding:24px 40px;text-align:center;border-top:3px solid #E8A820">
          <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">© 2024 <strong style="color:rgba(255,255,255,0.4)">WeIntern</strong> · India 🇮🇳 · Built with ❤️</p>
        </td></tr>
      </table>
    </td></tr>
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
<body style="margin:0;padding:0;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%">
        <tr><td style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:24px 24px 0 0;padding:40px;text-align:center;border-bottom:3px solid #E8A820">
          <h1 style="color:#fff;margin:0;font-size:32px;font-weight:900"><span style="color:#E8A820">We</span>Intern</h1>
        </td></tr>
        <tr><td style="background:linear-gradient(180deg,#ffffff,#f8faff);padding:44px 40px;text-align:center">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#059669,#10b981);border-radius:50%;margin:0 auto 22px;line-height:72px;font-size:32px;box-shadow:0 8px 24px rgba(5,150,105,0.3)">🎉</div>
          <h2 style="color:#1B2A4A;margin:0 0 8px;font-size:24px;font-weight:800">Application Received! ✅</h2>
          <p style="color:#64748b;font-size:15px;line-height:1.7;margin:0 0 24px">
            Hi <strong style="color:#2196C9">${name}</strong>! 🙌 Your <strong style="color:#E8A820">${duration} Internship</strong> application has been <strong style="color:#059669">successfully submitted</strong>!
          </p>
          <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #86efac;border-radius:16px;padding:24px;margin:0 0 20px;text-align:left">
            <p style="color:#166534;font-size:13px;font-weight:800;margin:0 0 12px">📅 WHAT HAPPENS NEXT:</p>
            <p style="color:#15803d;font-size:13px;margin:6px 0">🔍 <strong>Review:</strong> Our team reviews your application within <strong>3–5 business days</strong></p>
            <p style="color:#15803d;font-size:13px;margin:6px 0">📧 <strong>Update:</strong> You'll receive an <strong>email update</strong> on your application status</p>
            <p style="color:#15803d;font-size:13px;margin:6px 0">🤝 <strong>Onboarding:</strong> If accepted, we'll <strong>guide you through</strong> the next steps</p>
          </div>
          <p style="color:#2196C9;font-weight:800;font-size:16px;margin:0">🚀 You're one step closer to building your future!</p>
        </td></tr>
        <tr><td style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);border-radius:0 0 24px 24px;padding:24px 40px;text-align:center;border-top:3px solid #E8A820">
          <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">© 2024 <strong style="color:rgba(255,255,255,0.4)">WeIntern</strong> · India 🇮🇳 · Built with ❤️</p>
        </td></tr>
      </table>
    </td></tr>
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
<body style="margin:0;padding:0;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%">
        <tr><td style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:24px 24px 0 0;padding:40px;text-align:center;border-bottom:3px solid #E8A820">
          <h1 style="color:#fff;margin:0;font-size:32px;font-weight:900"><span style="color:#E8A820">We</span>Intern</h1>
        </td></tr>
        <tr><td style="background:linear-gradient(180deg,#ffffff,#f8faff);padding:44px 40px;text-align:center">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#2196C9,#1976d2);border-radius:50%;margin:0 auto 22px;line-height:72px;font-size:32px;box-shadow:0 8px 24px rgba(33,150,201,0.3)">🚀</div>
          <h2 style="color:#1B2A4A;margin:0 0 8px;font-size:24px;font-weight:800">You're Enrolled! 🎓</h2>
          <p style="color:#64748b;font-size:15px;line-height:1.7;margin:0 0 24px">
            Hi <strong style="color:#2196C9">${name}</strong>! 🙌 Welcome to <strong style="color:#1B2A4A">${courseName}</strong>. Your learning journey starts <strong style="color:#E8A820">right now!</strong>
          </p>
          <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1.5px solid #93c5fd;border-radius:16px;padding:24px;margin:0 0 20px;text-align:left">
            <p style="color:#1d4ed8;font-size:13px;font-weight:800;margin:0 0 12px">📚 YOUR COURSE IS NOW ACTIVE:</p>
            <p style="color:#1e40af;font-size:13px;margin:6px 0">🖥️ <strong>Login</strong> to your dashboard to access materials</p>
            <p style="color:#1e40af;font-size:13px;margin:6px 0">👥 <strong>Join</strong> your assigned intern team</p>
            <p style="color:#1e40af;font-size:13px;margin:6px 0">💼 <strong>Work</strong> on real client projects from day one</p>
            <p style="color:#1e40af;font-size:13px;margin:6px 0">💰 <strong>Earn</strong> stipend upon successful completion</p>
          </div>
          <p style="color:#059669;font-weight:800;font-size:15px;margin:0">✨ The best investment you'll ever make is in yourself!</p>
        </td></tr>
        <tr><td style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);border-radius:0 0 24px 24px;padding:24px 40px;text-align:center;border-top:3px solid #E8A820">
          <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">© 2024 <strong style="color:rgba(255,255,255,0.4)">WeIntern</strong> · India 🇮🇳 · Built with ❤️</p>
        </td></tr>
      </table>
    </td></tr>
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
<body style="margin:0;padding:0;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%">
        <tr><td style="background:linear-gradient(135deg,#1B2A4A,#0d1b2e);border-radius:24px 24px 0 0;padding:40px;text-align:center;border-bottom:3px solid #E8A820">
          <div style="display:inline-block;background:rgba(220,38,38,0.2);border:1.5px solid rgba(220,38,38,0.4);border-radius:50px;padding:7px 20px;margin-bottom:14px">
            <span style="color:#f87171;font-size:11px;font-weight:800;letter-spacing:3px">🔔 NEW INQUIRY</span>
          </div>
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900">🏢 Hire Request</h1>
          <p style="color:rgba(255,255,255,0.45);margin:8px 0 0;font-size:13px">WeIntern Admin Notification</p>
        </td></tr>
        <tr><td style="background:linear-gradient(180deg,#ffffff,#f8faff);padding:36px 40px">
          ${[
            ['🏢 Company', data.company, '#E8A820'],
            ['👤 Contact', data.name, '#2196C9'],
            ['📧 Email', data.email, '#059669'],
            ['📱 Phone', data.phone, '#7c3aed'],
            ['⚙️ Services', data.services?.join(', '), '#dc2626'],
            ['💰 Budget', data.budget, '#d97706'],
          ].map(([label, value, color]) => `
            <div style="display:flex;align-items:center;padding:12px 16px;border-radius:10px;background:#f8fafc;margin-bottom:8px;border-left:4px solid ${color}">
              <span style="color:#64748b;font-size:12px;font-weight:700;min-width:110px;letter-spacing:0.3px">${label}</span>
              <span style="color:#1B2A4A;font-size:13px;font-weight:600">${value || '—'}</span>
            </div>`).join('')}
          <div style="margin-top:16px;background:#f0f9ff;border:1.5px solid #bae6fd;border-radius:12px;padding:20px">
            <p style="color:#0369a1;font-size:12px;font-weight:800;margin:0 0 10px;letter-spacing:0.5px">📝 PROJECT DESCRIPTION:</p>
            <p style="color:#0c4a6e;font-size:13px;line-height:1.8;margin:0">${data.description}</p>
          </div>
          <div style="margin-top:16px;background:linear-gradient(135deg,#fef3c7,#fffbeb);border:1.5px solid #fcd34d;border-radius:12px;padding:16px;text-align:center">
            <p style="color:#92400e;font-size:13px;font-weight:700;margin:0">⚡ Respond within <strong>24 hours</strong> to secure this client! 🎯</p>
          </div>
        </td></tr>
        <tr><td style="background:linear-gradient(135deg,#0d1b2e,#1B2A4A);border-radius:0 0 24px 24px;padding:24px 40px;text-align:center;border-top:3px solid #E8A820">
          <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">© 2024 <strong style="color:rgba(255,255,255,0.4)">WeIntern</strong> Admin Panel · India 🇮🇳</p>
        </td></tr>
      </table>
    </td></tr>
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
