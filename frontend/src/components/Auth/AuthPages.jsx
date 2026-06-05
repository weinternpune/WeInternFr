import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login, register, verifyOTP, resendOTP, forgotPassword, resetPassword, getProfile } from '../../utils/api';
import toast from 'react-hot-toast';
import './Auth.css';

const BACKEND = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'https://we-intern.in';

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="auth-page">
    <div className="auth-bg">
      <div className="auth-orb orb-1" /><div className="auth-orb orb-2" /><div className="auth-grid" />
    </div>
    <div className="auth-card">
      <Link to="/" className="auth-logo-link"><img src="/welogo.png" alt="WeIntern" className="auth-logo" /></Link>
      <h2 className="auth-title">{title}</h2>
      {subtitle && <p className="auth-sub">{subtitle}</p>}
      {children}
    </div>
  </div>
);

const SocialButtons = () => (
  <>
    <div className="auth-divider"><span>or continue with</span></div>
    <div className="social-auth">
      <a href={`${BACKEND}/api/auth/google`} className="social-auth-btn google">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
          <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
          <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
        </svg>
        Continue with Google
      </a>
      <a href={`${BACKEND}/api/auth/github`} className="social-auth-btn github">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        Continue with GitHub
      </a>
    </div>
  </>
);

export const LoginPage = () => {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.needsVerification) { toast.error('Please verify your email first'); navigate(`/verify-otp?userId=${data.userId}`); }
      else toast.error(data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Sign in to your WeIntern account">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required autoFocus />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="pass-wrap">
            <input type={showPass ? 'text' : 'password'} name="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
            <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>{showPass ? '🙈' : '👁️'}</button>
          </div>
        </div>
        <div className="auth-forgot"><Link to="/forgot-password">Forgot password?</Link></div>
        <button type="submit" className="btn btn-primary btn-full auth-submit" disabled={loading}>
          {loading && <span className="btn-spinner" />}{loading ? 'Signing in...' : 'Sign In →'}
        </button>
      </form>
      <SocialButtons />
      <p className="auth-switch">Don't have an account? <Link to="/register">Sign up free</Link></p>
    </AuthLayout>
  );
};

export const RegisterPage = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const getStrength = (p) => {
    if (!p) return 0; let s = 0;
    if (p.length >= 6) s++; if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++; return s;
  };
  const strength = getStrength(form.password);
  const strengthLabel = ['','Weak','Fair','Good','Strong','Very Strong'][strength];
  const strengthColor = ['','#dc4545','#e67e22','#f1c40f','#2ecc71','#27ae60'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password });
      toast.success('OTP sent to your email! 📧');
      navigate(`/verify-otp?userId=${res.data.userId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Create Account 🌱" subtitle="Join thousands of students building their future">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required autoFocus />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="pass-wrap">
            <input type={showPass ? 'text' : 'password'} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
            <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>{showPass ? '🙈' : '👁️'}</button>
          </div>
          {form.password && (
            <div className="strength-bar">
              <div className="strength-track"><div className="strength-fill" style={{ width:`${(strength/5)*100}%`, background: strengthColor }} /></div>
              <span style={{ color: strengthColor, fontSize:'.72rem', fontWeight:600 }}>{strengthLabel}</span>
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handleChange} required />
          {form.confirm && form.password !== form.confirm && <span className="field-error">Passwords don't match</span>}
        </div>
        <button type="submit" className="btn btn-primary btn-full auth-submit" disabled={loading}>
          {loading && <span className="btn-spinner" />}{loading ? 'Creating account...' : 'Create Account →'}
        </button>
      </form>
      <SocialButtons />
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  );
};

export const OTPPage = () => {
  const [otp, setOtp] = useState(['','','','','','']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');

  useEffect(() => { document.getElementById('otp-0')?.focus(); }, []);
  useEffect(() => {
    if (countdown > 0) { const t = setTimeout(() => setCountdown(c => c-1), 1000); return () => clearTimeout(t); }
  }, [countdown]);

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[idx] = val.slice(-1); setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx+1}`)?.focus();
    if (val && idx === 5 && [...next.slice(0,5), val.slice(-1)].every(d => d !== ''))
      setTimeout(() => document.getElementById('otp-submit')?.click(), 100);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) document.getElementById(`otp-${idx-1}`)?.focus();
    if (e.key === 'ArrowLeft' && idx > 0) document.getElementById(`otp-${idx-1}`)?.focus();
    if (e.key === 'ArrowRight' && idx < 5) document.getElementById(`otp-${idx+1}`)?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    if (!text) return;
    const next = [...otp]; text.split('').forEach((d,i) => { if (i<6) next[i]=d; }); setOtp(next);
    document.getElementById(`otp-${Math.min(text.length,5)}`)?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { toast.error('Enter all 6 digits'); return; }
    setLoading(true);
    try {
      const res = await verifyOTP({ userId, otp: otpStr });
      loginUser(res.data.token, res.data.user);
      toast.success('Email verified! Welcome to WeIntern 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['','','','','','']); document.getElementById('otp-0')?.focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (countdown > 0) return; setResending(true);
    try {
      await resendOTP({ userId }); toast.success('New OTP sent! Check your email.');
      setCountdown(60); setOtp(['','','','','','']); document.getElementById('otp-0')?.focus();
    } catch { toast.error('Failed to resend OTP'); } finally { setResending(false); }
  };

  return (
    <AuthLayout title="Verify Email 📧" subtitle="Enter the 6-digit OTP sent to your email address">
      <div className="otp-info"><span>🔒</span> OTP expires in 10 minutes</div>
      <form onSubmit={handleVerify} className="auth-form">
        <div className="otp-boxes" onPaste={handlePaste}>
          {otp.map((d,i) => (
            <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1}
              value={d} onChange={e => handleOtpChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className={`otp-input${d ? ' filled' : ''}`} />
          ))}
        </div>
        <button id="otp-submit" type="submit" className="btn btn-primary btn-full auth-submit"
          disabled={loading || otp.join('').length !== 6}>
          {loading && <span className="btn-spinner" />}{loading ? 'Verifying...' : 'Verify OTP →'}
        </button>
      </form>
      <p className="auth-switch" style={{ marginTop:'1.25rem' }}>
        Didn't receive it?{' '}
        {countdown > 0 ? <span style={{ color:'var(--muted)' }}>Resend in {countdown}s</span>
          : <button onClick={handleResend} disabled={resending} className="link-btn">{resending ? 'Sending...' : 'Resend OTP'}</button>}
      </p>
      <p className="auth-switch"><Link to="/login">← Back to Sign In</Link></p>
    </AuthLayout>
  );
};

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await forgotPassword({ email }); setSent(true); toast.success('Reset link sent!'); }
    catch { toast.error('Something went wrong'); } finally { setLoading(false); }
  };
  return (
    <AuthLayout title="Forgot Password 🔑" subtitle={sent ? 'Check your inbox for the reset link.' : "Enter your email and we'll send a reset link"}>
      {!sent ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <button type="submit" className="btn btn-primary btn-full auth-submit" disabled={loading}>
            {loading && <span className="btn-spinner" />}{loading ? 'Sending...' : 'Send Reset Link →'}
          </button>
        </form>
      ) : (
        <div className="auth-success">
          <div className="auth-success-icon">✅</div>
          <p>Reset link sent to <strong>{email}</strong>. Expires in 1 hour. Check spam if not seen.</p>
        </div>
      )}
      <p className="auth-switch"><Link to="/login">← Back to Sign In</Link></p>
    </AuthLayout>
  );
};

export const ResetPasswordPage = () => {
  const [form, setForm] = useState({ password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token'); const email = params.get('email');
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await resetPassword({ email, token, password: form.password });
      setDone(true); toast.success('Password reset!');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) { toast.error(err.response?.data?.message || 'Reset failed. Link may be expired.'); }
    finally { setLoading(false); }
  };
  return (
    <AuthLayout title="Reset Password 🔐" subtitle="Set your new password below">
      {!done ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} autoFocus />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" name="confirm" placeholder="Repeat new password" value={form.confirm} onChange={handleChange} required />
            {form.confirm && form.password !== form.confirm && <span className="field-error">Passwords don't match</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-full auth-submit" disabled={loading}>
            {loading && <span className="btn-spinner" />}{loading ? 'Resetting...' : 'Reset Password →'}
          </button>
        </form>
      ) : (
        <div className="auth-success"><div className="auth-success-icon">✅</div><p>Password reset! Redirecting to login...</p></div>
      )}
    </AuthLayout>
  );
};

export const AuthCallback = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) { setError(true); return; }
    localStorage.setItem('wi_token', token);
    getProfile().then(res => {
      loginUser(token, res.data.data);
      toast.success(`Welcome, ${res.data.data.name}! 🎉`);
      navigate(res.data.data.role === 'admin' ? '/admin' : '/dashboard');
    }).catch(() => setError(true));
  }, []);

  if (error) return (
    <AuthLayout title="Authentication Failed">
      <div className="auth-success"><div className="auth-success-icon">❌</div><p>Something went wrong. <Link to="/login">Try again</Link></p></div>
    </AuthLayout>
  );
  return (
    <AuthLayout title="Signing you in...">
      <div style={{ textAlign:'center', padding:'2rem 0' }}>
        <div className="auth-loader" />
        <p style={{ color:'var(--muted)', marginTop:'1rem' }}>Please wait ✨</p>
      </div>
    </AuthLayout>
  );
};
