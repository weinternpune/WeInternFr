import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CoursesContext';
import { enrollCourse } from '../../utils/api';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CourseDetailModal from './CourseDetail';
import './Courses.css';

const loadRazorpaySDK = () => new Promise((resolve) => {
  if (window.Razorpay) { resolve(true); return; }
  const s = document.createElement('script');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload = () => resolve(true);
  s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

const EnrollModal = ({ course, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: user?.name||'', email: user?.email||'',
    phone: user?.phone||'', college: user?.college||'',
    degree: '', year: user?.year||''
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login'); navigate('/login'); return; }
    if (!form.name||!form.email||!form.phone||!form.college||!form.degree||!form.year) {
      toast.error('Please fill all fields'); return;
    }
    const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
    if (!RAZORPAY_KEY) { toast.error('Payment not configured. Contact support.'); return; }
    setLoading(true); setStep(2);
    try {
      const enrollRes = await enrollCourse({ ...form, courseName: course.title, coursePrice: course.price });
      const enrollmentId = enrollRes.data.data._id;
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) { toast.error('Payment gateway failed.'); setStep(1); setLoading(false); return; }
      const orderRes = await API.post('/payments/create-order', { amount: course.price, enrollmentId });
      const order = orderRes.data.order;
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY, amount: order.amount, currency: 'INR',
        name: 'WeIntern', description: course.title,
        image: `${window.location.origin}/welogo.png`, order_id: order.id,
        handler: async (response) => {
          try {
            await API.post('/payments/verify', { ...response, enrollmentId });
            toast.success('Payment successful! You are now enrolled.');
            onClose();
          } catch { toast.error('Verification failed. Contact support.'); }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#E8A820' },
        modal: { ondismiss: () => { toast('Cancelled', { icon: 'i' }); setStep(1); setLoading(false); } }
      });
      rzp.on('payment.failed', (r) => { toast.error(`Failed: ${r.error.description}`); setStep(1); setLoading(false); });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Error');
      setStep(1); setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="modal-box" style={{ position: 'relative', maxWidth: '480px' }}>
        <button onClick={() => !loading && onClose()} style={{ position:'absolute',top:'1rem',right:'1rem',background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',color:'var(--muted)',lineHeight:1 }}>×</button>
        <div className="enroll-header">
          <div className="enroll-emoji">{course.emoji}</div>
          <div>
            <h3 style={{ margin:0, fontSize:'1.05rem', color:'var(--navy)' }}>{course.title}</h3>
            <div className="enroll-price-tag">₹{Number(course.price).toLocaleString('en-IN')}</div>
          </div>
        </div>
        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <div className="enroll-form-grid">
              {[['name','Full Name','text'],['email','Email','email'],['phone','Phone','tel'],['college','College','text']].map(([n,p,t]) => (
                <div className="form-group" key={n}>
                  <label>{p} *</label>
                  <input type={t} name={n} placeholder={p} value={form[n]} onChange={handleChange} required />
                </div>
              ))}
              <div className="form-group">
                <label>Degree *</label>
                <select name="degree" value={form.degree} onChange={handleChange} required>
                  <option value="">Select Degree</option>
                  {['BCA','MCA','B.Tech','M.Tech','BSc','Other'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Year *</label>
                <select name="year" value={form.year} onChange={handleChange} required>
                  <option value="">Select Year</option>
                  {['1st Year','2nd Year','3rd Year','Final Year'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="payment-methods-preview">
              <div className="pm-label">Accepted Payment Methods</div>
              <div className="pm-icons">
                <span className="pm-icon">📱 UPI</span>
                <span className="pm-icon">💳 Card</span>
                <span className="pm-icon">🏦 Net Banking</span>
                <span className="pm-icon">👛 Wallet</span>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full enroll-pay-btn">
              🔒 Pay ₹{Number(course.price).toLocaleString('en-IN')} →
            </button>
            <button type="button" className="btn btn-outline btn-full" onClick={onClose} style={{ marginTop:'.6rem' }}>Cancel</button>
          </form>
        )}
        {step === 2 && (
          <div className="enroll-processing">
            <div className="processing-spinner" />
            <h3>Opening Payment Gateway...</h3>
            <p>Please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Courses = () => {
  const [filter, setFilter] = useState('all');
  const [detailCourse, setDetailCourse] = useState(null);
  const [enrollCourseData, setEnrollCourseData] = useState(null);
  const { activeCourses } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const filtered = activeCourses.filter(c =>
    filter === 'all' || c.level === filter
  );

  const handleEnroll = (course) => {
    if (!user) { toast.error('Please login to enroll'); navigate('/login'); return; }
    setDetailCourse(null);
    setEnrollCourseData(course);
  };

  const getTools = (tools) => {
    if (Array.isArray(tools)) return tools;
    if (typeof tools === 'string') return tools.split(',').map(t => t.trim()).filter(Boolean);
    return [];
  };

  return (
    <section className="courses" id="courses">
      <div className="container">
        <div className="section-label">Learn. Build. Earn.</div>
        <h2 className="section-title">Our Courses</h2>
        <p className="section-sub">Industry-designed programs. Build real projects, earn stipend opportunities, come out genuinely job-ready.</p>

        <div className="course-filters">
          {['all','beginner','intermediate'].map(f => (
            <button key={f} className={`cf-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>
              {f==='all' ? 'All Courses' : f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>

        <div className="courses-grid">
          {filtered.map((c) => (
            <div key={c.id || c.title} className="course-card" style={{ cursor:'pointer' }}
              onClick={() => setDetailCourse(c)}>
              <div className="cc-header" style={{ background:`linear-gradient(135deg,${c.colors?.h1||'#e76f51'},${c.colors?.h2||'#f4a261'})` }}>
                <span className="cc-emoji">{c.emoji}</span>
                <span className="cc-badge">{(c.level||'beginner').charAt(0).toUpperCase()+(c.level||'beginner').slice(1)}</span>
              </div>
              <div className="cc-body">
                <h3>{c.title}</h3>
                <p>{c.desc || c.tagline || c.about}</p>
                <div className="cc-meta">
                  <span>⏱ {c.duration}</span>
                  <span>📊 {(c.level||'beginner').charAt(0).toUpperCase()+(c.level||'beginner').slice(1)}</span>
                </div>
                <div className="cc-tools">
                  {getTools(c.tools).slice(0,5).map(t => <span key={t}>{t}</span>)}
                </div>
                <div className="cc-stipend">💰 Stipend opportunity after completion</div>
                <div className="cc-footer">
                  <div className="cc-price">
                    <small>Starting at</small>
                    <strong>₹{Number(c.price).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display:'flex', gap:'.4rem' }}>
                    <button
                      className="btn btn-outline"
                      style={{ padding:'.5rem .9rem', fontSize:'.8rem' }}
                      onClick={(e) => { e.stopPropagation(); setDetailCourse(c); }}>
                      Details
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ padding:'.5rem .9rem', fontSize:'.8rem' }}
                      onClick={(e) => { e.stopPropagation(); handleEnroll(c); }}>
                      Enroll →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="courses-cta">
          <div className="ccta-text">
            <h3>Not sure which course is right for you?</h3>
            <p>Talk to our team — we will guide you to the perfect path.</p>
          </div>
          <a href="#contact" className="btn btn-primary btn-lg">Get Free Counselling →</a>
        </div>
      </div>

      {detailCourse && (
        <CourseDetailModal
          course={detailCourse}
          onClose={() => setDetailCourse(null)}
          onEnroll={() => handleEnroll(detailCourse)}
        />
      )}

      {enrollCourseData && (
        <EnrollModal course={enrollCourseData} onClose={() => setEnrollCourseData(null)} />
      )}
    </section>
  );
};

export default Courses;
