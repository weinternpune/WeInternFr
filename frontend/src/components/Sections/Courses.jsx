import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CoursesContext';
import { enrollCourse } from '../../utils/api';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CourseDetailModal from './CourseDetail';
import './Courses.css';

import {
  FaCode, FaMobileAlt, FaRobot, FaDatabase, FaBullhorn, FaPalette,
  FaChalkboardTeacher, FaBriefcase, FaUserTie, FaCertificate,
  FaInfinity, FaHandshake, FaArrowRight, FaLaptopCode, FaGraduationCap,
} from 'react-icons/fa';
import { MdLaptopMac } from 'react-icons/md';

/* ─── Razorpay loader (original, untouched) ─── */
const loadRazorpaySDK = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

/* ─── Course icon / color map ─── */
const COURSE_META = [
  { keys: ['web', 'full stack', 'fullstack', 'mern'], icon: <FaCode />,      bg: '#e6f4fb', iconColor: '#1a91c9', border: '#bfdfef' },
  { keys: ['app', 'mobile', 'flutter', 'android'],    icon: <FaMobileAlt />, bg: '#eceffe', iconColor: '#4f5bd5', border: '#cfd3f8' },
  { keys: ['ai', 'machine', 'deep learning', 'nlp'],  icon: <FaRobot />,     bg: '#fff8e8', iconColor: '#d97706', border: '#fce6a4' },
  { keys: ['data', 'python', 'sql', 'analytics'],     icon: <FaDatabase />,  bg: '#eaf7f0', iconColor: '#16a34a', border: '#a8dfc0' },
  { keys: ['marketing', 'seo', 'digital'],            icon: <FaBullhorn />,  bg: '#fff0f5', iconColor: '#db2777', border: '#f9c0d6' },
  { keys: ['ui', 'ux', 'design', 'figma'],            icon: <FaPalette />,   bg: '#f3eeff', iconColor: '#7c3aed', border: '#d4c0f8' },
];

const getCourseMeta = (title = '') => {
  const t = title.toLowerCase();
  return (
    COURSE_META.find(({ keys }) => keys.some((k) => t.includes(k))) ||
    { icon: <FaLaptopCode />, bg: '#e6f4fb', iconColor: '#1a91c9', border: '#bfdfef' }
  );
};

const getTools = (tools) => {
  if (Array.isArray(tools)) return tools;
  if (typeof tools === 'string') return tools.split(',').map((t) => t.trim()).filter(Boolean);
  return [];
};

/* ─── Benefits data ─── */
const BENEFITS = [
  { icon: <FaChalkboardTeacher />, label: ['Mentor-Led', 'Training'] },
  { icon: <MdLaptopMac />,         label: ['Live Client', 'Projects'] },
  { icon: <FaBriefcase />,         label: ['Stipend', 'Opportunities'] },
  { icon: <FaGraduationCap />,     label: ['Real Portfolio', 'Building'] },
  { icon: <FaUserTie />,           label: ['1:1 Career', 'Support'] },
  { icon: <FaCertificate />,       label: ['Certificate of', 'Completion'] },
  { icon: <FaInfinity />,          label: ['Lifetime Access', 'to Resources'] },
  { icon: <FaHandshake />,         label: ['Placement & Job', 'Assistance'] },
];


const EnrollModal = ({ course, onClose }) => {
  const { user }              = useAuth();
  const navigate              = useNavigate();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    phone:   user?.phone   || '',
    college: user?.college || '',
    degree:  '',
    year:    user?.year    || '',
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login'); navigate('/login'); return; }
    if (!form.name || !form.email || !form.phone || !form.college || !form.degree || !form.year) {
      toast.error('Please fill all fields'); return;
    }
    const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
    if (!RAZORPAY_KEY) { toast.error('Payment not configured. Contact support.'); return; }
    setLoading(true); setStep(2);
    try {
      const enrollRes    = await enrollCourse({ ...form, courseName: course.title, coursePrice: course.price });
      const enrollmentId = enrollRes.data.data._id;
      const sdkLoaded    = await loadRazorpaySDK();
      if (!sdkLoaded) { toast.error('Payment gateway failed.'); setStep(1); setLoading(false); return; }
      const orderRes = await API.post('/payments/create-order', { amount: course.price, enrollmentId });
      const order    = orderRes.data.order;
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
        theme:   { color: '#E8A820' },
        modal:   { ondismiss: () => { toast('Cancelled', { icon: 'ℹ️' }); setStep(1); setLoading(false); } },
      });
      rzp.on('payment.failed', (r) => { toast.error(`Failed: ${r.error.description}`); setStep(1); setLoading(false); });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Error');
      setStep(1); setLoading(false);
    }
  };

  const meta = getCourseMeta(course.title);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="modal-box" style={{ position: 'relative', maxWidth: '480px' }}>
        <button
          onClick={() => !loading && onClose()}
          style={{ position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', color:'var(--muted)', lineHeight:1 }}
        >×</button>

        <div className="enroll-header">
          <div className="enroll-emoji" style={{ color: meta.iconColor, background: meta.bg }}>
            {meta.icon}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--navy)' }}>{course.title}</h3>
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
                  {['BCA','MCA','B.Tech','M.Tech','BSc','Other'].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Year *</label>
                <select name="year" value={form.year} onChange={handleChange} required>
                  <option value="">Select Year</option>
                  {['1st Year','2nd Year','3rd Year','Final Year'].map((y) => <option key={y}>{y}</option>)}
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
            <button type="button" className="btn btn-outline btn-full" onClick={onClose} style={{ marginTop:'.6rem' }}>
              Cancel
            </button>
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

/* ══════════════════════════════════════════════════════════════
   Main Courses Component
══════════════════════════════════════════════════════════════ */
const Courses = () => {
  const [detailCourse, setDetailCourse]           = useState(null);
  const [enrollCourseData, setEnrollCourseData]   = useState(null);
  const { activeCourses } = useCourses();
  const { user }          = useAuth();
  const navigate          = useNavigate();

  const handleEnroll = (course) => {
    if (!user) { toast.error('Please login to enroll'); navigate('/login'); return; }
    setDetailCourse(null);
    setEnrollCourseData(course);
  };

  return (
    <section className="courses" id="courses">

      {/* ── Centered header ── */}
      <div className="cs-header">
        <div className="cs-header-center">
          <h2 className="cs-main-title">
            Explore{' '}
            <span className="cs-title-accent">In-Demand</span>{' '}
            <span className="cs-title-serif">Courses</span>
          </h2>
          <p className="cs-sub">Practical. Industry-Relevant. Outcome-Driven.</p>
        </div>
        <a href="#all-courses" className="cs-view-all">
          View All Courses <FaArrowRight className="cs-view-arrow" />
        </a>
      </div>

      {/* ── 6-Column card grid ── */}
      <div className="cs-grid">
        {activeCourses.map((c) => {
          const meta  = getCourseMeta(c.title);
          const tools = getTools(c.tools).slice(0, 4);

          return (
            <div
              key={c.id || c.title}
              className="cs-card"
              style={{ '--crd-border': meta.border }}
              onClick={() => setDetailCourse(c)}
            >
              {/* Pastel icon zone */}
              <div className="cs-card-icon-row" style={{ background: meta.bg }}>
                <div className="cs-card-icon" style={{ color: meta.iconColor }}>
                  {meta.icon}
                </div>
              </div>

              {/* Text content */}
              <div className="cs-card-content">
                <h3 className="cs-card-title">{c.title}</h3>
                <p className="cs-card-dur">{c.duration}</p>

                <ul className="cs-card-list">
                  {tools.map((t) => (
                    <li key={t}>
                      <span className="cs-bullet-dot" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enroll button — stopPropagation keeps modal from triggering detail */}
              <button
                className="cs-enroll"
                onClick={(e) => { e.stopPropagation(); handleEnroll(c); }}
              >
                Enroll Now <FaArrowRight className="cs-enroll-arrow" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Benefits strip ── */}
      <div className="cs-benefits-wrap">
        <div className="cs-benefits-inner">
          <div className="cs-benefits-heading">
            <span>Benefits of</span>
            <span>Our Courses</span>
          </div>
          <div className="cs-benefits-sep" />
          <div className="cs-benefits-row">
            {BENEFITS.map(({ icon, label }) => (
              <div className="cs-benefit" key={label[0]}>
                <div className="cs-benefit-ico">{icon}</div>
                <p className="cs-benefit-lbl">
                  {label[0]}<br />{label[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modals — all original logic intact ── */}
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