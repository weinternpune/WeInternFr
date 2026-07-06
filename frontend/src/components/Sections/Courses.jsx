import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCourses } from "../../context/CoursesContext";
import { enrollCourse } from "../../utils/api";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CourseDetailModal from "./CourseDetail";
import PhoneGate from "../PhoneGate/PhoneGate";
import { Icon } from "@iconify/react";
import "./Courses.css";

/* ─── Razorpay loader (original, untouched) ─── */
const loadRazorpaySDK = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

/* ─── Header gradients ─── */
const HEADER_GRADIENTS = {
  green:  "linear-gradient(135deg, #4ade80 0%, #bbf7d0 50%, #ffffff 100%)",
  blue:   "linear-gradient(135deg, #60a5fa 0%, #bfdbfe 50%, #ffffff 100%)",
  purple: "linear-gradient(135deg, #a78bfa 0%, #ddd6fe 50%, #ffffff 100%)",
  amber:  "linear-gradient(135deg, #fbbf24 0%, #fde68a 50%, #ffffff 100%)",
  teal:   "linear-gradient(135deg, #2dd4bf 0%, #99f6e4 50%, #ffffff 100%)",
  pink:   "linear-gradient(135deg, #f472b6 0%, #fbcfe8 50%, #ffffff 100%)",
  rose:   "linear-gradient(135deg, #fb7185 0%, #fecdd3 50%, #ffffff 100%)",
  sky:    "linear-gradient(135deg, #38bdf8 0%, #bae6fd 50%, #ffffff 100%)",
  slate:  "linear-gradient(135deg, #94a3b8 0%, #e2e8f0 50%, #ffffff 100%)",
};

const COURSE_META = [
  { keys: ["web","full stack","fullstack","mern"],   icon: "lucide:code-2",             bg: HEADER_GRADIENTS.green,  iconColor: "#16a34a", border: "#bbf7d0", dot: "#16a34a",  badge: "Popular",    badgeIcon: "lucide:flame",    badgeColor: "#fff7ed", badgeText: "#ea580c" },
  { keys: ["app","mobile","flutter","android"],       icon: "lucide:smartphone",         bg: HEADER_GRADIENTS.blue,   iconColor: "#2563eb", border: "#bfdbfe", dot: "#2563eb",  badge: "Trending",   badgeIcon: "lucide:trending-up", badgeColor: "#eff6ff", badgeText: "#2563eb" },
  { keys: ["ai","machine","deep learning","nlp","automation"], icon: "lucide:brain-circuit", bg: HEADER_GRADIENTS.purple, iconColor: "#7c3aed", border: "#ddd6fe", dot: "#7c3aed", badge: "New",       badgeIcon: "lucide:sparkles", badgeColor: "#faf5ff", badgeText: "#7c3aed" },
  { keys: ["data","python","sql","analytics"],        icon: "lucide:database",           bg: HEADER_GRADIENTS.amber,  iconColor: "#d97706", border: "#fde68a", dot: "#d97706",  badge: "In Demand",  badgeIcon: "lucide:zap",      badgeColor: "#fffbeb", badgeText: "#d97706" },
  { keys: ["marketing","seo","digital"],              icon: "lucide:megaphone",          bg: HEADER_GRADIENTS.teal,   iconColor: "#0d9488", border: "#99f6e4", dot: "#0d9488",  badge: "Trending",   badgeIcon: "lucide:trending-up", badgeColor: "#f0fdfa", badgeText: "#0d9488" },
  { keys: ["ui","ux","design","figma"],               icon: "lucide:pencil-ruler",       bg: HEADER_GRADIENTS.pink,   iconColor: "#ec4899", border: "#fbcfe8", dot: "#ec4899",  badge: "Popular",    badgeIcon: "lucide:flame",    badgeColor: "#fdf2f8", badgeText: "#ec4899" },
  { keys: ["video","editing","content","premiere"],   icon: "lucide:clapperboard",       bg: HEADER_GRADIENTS.rose,   iconColor: "#e11d48", border: "#fecdd3", dot: "#e11d48",  badge: "Popular",    badgeIcon: "lucide:flame",    badgeColor: "#fff1f2", badgeText: "#e11d48" },
  { keys: ["cloud"],                                  icon: "lucide:cloud",              bg: HEADER_GRADIENTS.sky,    iconColor: "#0ea5e9", border: "#bae6fd", dot: "#0ea5e9",  badge: "In Demand",  badgeIcon: "lucide:zap",      badgeColor: "#f0f9ff", badgeText: "#0ea5e9" },
  { keys: ["devops","docker","kubernetes"],           icon: "lucide:settings-2",         bg: HEADER_GRADIENTS.slate,  iconColor: "#475569", border: "#e2e8f0", dot: "#475569",  badge: "In Demand",  badgeIcon: "lucide:zap",      badgeColor: "#f8fafc", badgeText: "#475569" },
  { keys: ["game","unity"],                           icon: "lucide:gamepad-2",          bg: HEADER_GRADIENTS.purple, iconColor: "#7c3aed", border: "#ddd6fe", dot: "#7c3aed",  badge: "New",        badgeIcon: "lucide:sparkles", badgeColor: "#faf5ff", badgeText: "#7c3aed" },
  { keys: ["business","analytics","excel","power bi"],icon: "lucide:briefcase-business", bg: HEADER_GRADIENTS.green,  iconColor: "#16a34a", border: "#bbf7d0", dot: "#16a34a",  badge: "Popular",    badgeIcon: "lucide:flame",    badgeColor: "#fff7ed", badgeText: "#ea580c" },
];

const getCourseMeta = (title = "") => {
  const t = title.toLowerCase();
  return (
    COURSE_META.find(({ keys }) => keys.some((k) => t.includes(k))) || {
      icon: "lucide:laptop", bg: HEADER_GRADIENTS.sky, iconColor: "#1a91c9",
      border: "#bfdfef", dot: "#1a91c9", badge: "In Demand",
      badgeIcon: "lucide:zap", badgeColor: "#f0f9ff", badgeText: "#0ea5e9",
    }
  );
};

const getTools = (tools) => {
  if (Array.isArray(tools)) return tools;
  if (typeof tools === "string") return tools.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
};

/* ─── Tabs ─── */
const TABS = [
  { label: "Technology", icon: "lucide:monitor" },
  { label: "Design",     icon: "lucide:palette" },
  { label: "Marketing",  icon: "lucide:bar-chart-2" },
];

const TAB_KEYS = {
  Technology: ["web","full stack","fullstack","mern","app","mobile","flutter","android","ai","machine","deep learning","nlp","automation","data","python","sql","cloud","devops","docker","kubernetes","game","unity","business","analytics","excel","power bi"],
  Design:     ["ui","ux","design","figma","video","editing","content","premiere"],
  Marketing:  ["marketing","seo","digital"],
};

/* ─── Benefits (UNTOUCHED) ─── */
const BENEFITS = [
  { icon: "tabler:user-star",               label: ["Expert-Led", "Training"] },
  { icon: "tabler:clipboard-list",          label: ["Last Exam", "Practice"] },
  { icon: "tabler:briefcase",               label: ["Scaled", "Doubt-Solving"] },
  { icon: "tabler:presentation-analytics", label: ["Real-World", "Projects"] },
  { icon: "tabler:rosette-discount-check", label: ["1:1 Career", "Support"] },
  { icon: "tabler:users",                   label: ["Certificate of", "Completion"] },
  { icon: "tabler:file-description",        label: ["Lifetime Access", "to Resources"] },
  { icon: "tabler:users-group",             label: ["Placement & Job", "Assistance"] },
];

/* ══════════════════════════════════════════════════════════════
   EnrollModal  —  all original logic preserved
══════════════════════════════════════════════════════════════ */
const EnrollModal = ({ course, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "",
    college: user?.college || "", degree: "", year: user?.year || "",
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login"); navigate("/login"); return; }
    if (!form.name || !form.email || !form.phone || !form.college || !form.degree || !form.year) {
      toast.error("Please fill all fields"); return;
    }
    const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
    if (!RAZORPAY_KEY) { toast.error("Payment not configured. Contact support."); return; }
    setLoading(true); setStep(2);
    try {
      const enrollRes = await enrollCourse({ ...form, courseName: course.title, coursePrice: course.price });
      const enrollmentId = enrollRes.data.data._id;
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) { toast.error("Payment gateway failed."); setStep(1); setLoading(false); return; }
      const orderRes = await API.post("/payments/create-order", { amount: course.price, enrollmentId });
      const order = orderRes.data.order;
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY, amount: order.amount, currency: "INR",
        name: "WeIntern", description: course.title,
        image: `${window.location.origin}/welogo.png`, order_id: order.id,
        handler: async (response) => {
          try {
            await API.post("/payments/verify", { ...response, enrollmentId });
            toast.success("Payment successful! You are now enrolled."); onClose();
          } catch { toast.error("Verification failed. Contact support."); }
        },
        config: { display: { blocks: { upi: { name: "Pay via UPI (Scan QR)", instruments: [{ method: "upi" }] }, other: { name: "Other Payment Methods", instruments: [{ method: "card" }, { method: "netbanking" }, { method: "wallet" }] } }, sequence: ["block.upi","block.other"], preferences: { show_default_blocks: false } } },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#E8A820" },
        modal: { ondismiss: () => { toast("Cancelled", { icon: "ℹ️" }); setStep(1); setLoading(false); } },
      });
      rzp.on("payment.failed", (r) => { toast.error(`Failed: ${r.error.description}`); setStep(1); setLoading(false); });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error"); setStep(1); setLoading(false);
    }
  };

  const meta = getCourseMeta(course.title);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="modal-box" style={{ position: "relative", maxWidth: "480px" }}>
        <button onClick={() => !loading && onClose()} style={{ position:"absolute",top:"1rem",right:"1rem",background:"none",border:"none",fontSize:"1.5rem",cursor:"pointer",color:"var(--muted)",lineHeight:1 }}>×</button>

        <div className="enroll-header">
          <div className="enroll-emoji" style={{ color: meta.iconColor, background: meta.bg }}>
            <Icon icon={meta.icon} width={28} height={28} />
          </div>
          <div>
            <h3 style={{ margin:0, fontSize:"1.05rem", color:"var(--navy)" }}>{course.title}</h3>
            <div className="enroll-price-tag">₹{Number(course.price).toLocaleString("en-IN")}</div>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <div className="enroll-form-grid">
              {[["name","Full Name","text"],["email","Email","email"],["phone","Phone","tel"],["college","College","text"]].map(([n,p,t]) => (
                <div className="form-group" key={n}>
                  <label>{p} *</label>
                  <input type={t} name={n} placeholder={p} value={form[n]} onChange={handleChange} required />
                </div>
              ))}
              <div className="form-group">
                <label>Degree *</label>
                <select name="degree" value={form.degree} onChange={handleChange} required>
                  <option value="">Select Degree</option>
                  {["BCA","MCA","B.Tech","M.Tech","BSc","Other"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Year *</label>
                <select name="year" value={form.year} onChange={handleChange} required>
                  <option value="">Select Year</option>
                  {["1st Year","2nd Year","3rd Year","Final Year"].map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="payment-methods-preview">
              <div className="pm-label">Accepted Payment Methods</div>
              <div className="pm-icons">
                <span className="pm-icon"><Icon icon="lucide:smartphone" width={13} height={13} /> UPI</span>
                <span className="pm-icon"><Icon icon="lucide:credit-card" width={13} height={13} /> Card</span>
                <span className="pm-icon"><Icon icon="lucide:landmark" width={13} height={13} /> Net Banking</span>
                <span className="pm-icon"><Icon icon="lucide:wallet" width={13} height={13} /> Wallet</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full enroll-pay-btn">
              <Icon icon="lucide:lock" width={15} height={15} style={{ marginRight: "0.3rem" }} />
              Pay ₹{Number(course.price).toLocaleString("en-IN")}
              <Icon icon="lucide:arrow-right" width={15} height={15} style={{ marginLeft: "0.3rem" }} />
            </button>
            <button type="button" className="btn btn-outline btn-full" onClick={onClose} style={{ marginTop:".6rem" }}>
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
  const [detailCourse, setDetailCourse] = useState(null);
  const [enrollCourseData, setEnrollCourseData] = useState(null);
  const [activeTab, setActiveTab] = useState("Technology");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPhoneGate, setShowPhoneGate] = useState(false);
  const [pendingEnrollCourse, setPendingEnrollCourse] = useState(null);
  const trackRef = useRef(null);
  const { activeCourses } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnroll = (course) => {
    // Check if phone is verified (for all users including logged-in)
    const phoneVerified = localStorage.getItem('phoneVerified') === 'true';
    if (!phoneVerified) {
      // Store the course for enrollment after verification
      setPendingEnrollCourse(course);
      setDetailCourse(null);
      setShowPhoneGate(true);
      return;
    }

    // If not logged in after phone verification, redirect to login
    if (!user) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }

    // If phone verified and logged in, proceed with enrollment
    setDetailCourse(null);
    setEnrollCourseData(course);
  };

  const handlePhoneVerificationComplete = () => {
    setShowPhoneGate(false);
    // After phone verification, check if user is logged in
    if (user && pendingEnrollCourse) {
      // User is logged in, proceed with enrollment
      setEnrollCourseData(pendingEnrollCourse);
      setPendingEnrollCourse(null);
    } else if (pendingEnrollCourse) {
      // User not logged in, redirect to login
      toast.success("Phone verified! Please login to continue enrollment.");
      navigate("/login");
      setPendingEnrollCourse(null);
    }
  };

  /* Filter by tab */
  const filteredCourses = activeCourses.filter((c) => {
    const t = c.title.toLowerCase();
    const keys = TAB_KEYS[activeTab] || [];
    return keys.some((k) => t.includes(k));
  });

  /* If no matches for tab, fall back to all */
  const displayCourses = filteredCourses.length > 0 ? filteredCourses : activeCourses;

  /* ── Responsive visible count matches CSS breakpoints ── */
  const getVisible = () => {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 640) return 2;
    if (w <= 820) return 3;
    if (w <= 1100) return 4;
    return 5;
  };
  const [visible, setVisible] = useState(getVisible);
  React.useEffect(() => {
    const onResize = () => { setVisible(getVisible()); setCurrentSlide(0); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const totalSlides = Math.max(0, displayCourses.length - visible);

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(idx, totalSlides));
    setCurrentSlide(clamped);
  };

  /* Reset slide on tab change */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentSlide(0);
  };

  return (
    <section className="courses" id="courses">

      {/* ── Header ── */}
      <div className="cs-header">
        <div className="cs-badge-pill">
          <Icon icon="lucide:rocket" width={13} height={13} className="cs-badge-rocket-icon" /> Industry-Ready Programs
        </div>
        <h2 className="cs-main-title">
          Explore <span className="cs-title-accent">Our Programs</span>
        </h2>
        <p className="cs-sub">Upskill with Job-Ready Programs &amp; Career-Driven Certifications.</p>
      </div>

      {/* ── Tabs ── */}
      <div className="cs-tabs">
        {TABS.map(({ label, icon }) => (
          <button
            key={label}
            className={`cs-tab${activeTab === label ? " cs-tab--active" : ""}`}
            onClick={() => handleTabChange(label)}
          >
            <Icon icon={icon} width={15} height={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Carousel wrapper ── */}
      <div className="cs-carousel-root">
        {/* Left arrow */}
        <button
          className="cs-arrow cs-arrow--left"
          onClick={() => goTo(currentSlide - 1)}
          disabled={currentSlide === 0}
          aria-label="Previous"
        >
          <Icon icon="lucide:chevron-left" width={20} height={20} />
        </button>

        {/* Track */}
        <div className="cs-carousel-viewport">
          <div
            className="cs-carousel-track"
            ref={trackRef}
            style={{ transform: `translateX(calc(-${currentSlide} * ((100% - ${visible - 1} * 0.85rem) / ${visible} + 0.85rem)))` }}
          >
            {displayCourses.map((c) => {
              const meta = getCourseMeta(c.title);
              const tools = getTools(c.tools).slice(0, 4);

              return (
                <div
                  key={c.id || c.title}
                  className="cs-card"
                  style={{ "--crd-border": meta.border, "--enroll-color": meta.iconColor }}
                  onClick={() => setDetailCourse(c)}
                >
                  {/* Gradient icon zone */}
                  <div className="cs-card-icon-zone" style={{ background: meta.bg }}>
                    {/* Badge */}
                    <span
                      className="cs-card-badge"
                      style={{ background: meta.badgeColor, color: meta.badgeText }}
                    >
                      <Icon icon={meta.badgeIcon} width={9} height={9} />
                      {meta.badge}
                    </span>
                    {/* Icon box */}
                    <div className="cs-card-icon-wrap" style={{ color: meta.iconColor }}>
                      <Icon icon={meta.icon} width={26} height={26} strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="cs-card-content">
                    <h3 className="cs-card-title">{c.title}</h3>
                    <p className="cs-card-dur">
                      <Icon icon="lucide:clock" width={11} height={11} className="cs-dur-icon" />
                      {c.duration}
                    </p>

                    <ul className="cs-card-list">
                      {tools.map((t) => (
                        <li key={t}>
                          <span className="cs-bullet-check" style={{ background: meta.dot }}>
                            <Icon icon="lucide:check" width={7} height={7} color="#fff" strokeWidth={3} />
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>

                    {/* Feature pills */}
                    <div className="cs-feature-pills">
                      <span className="cs-pill"><Icon icon="lucide:layers" width={10} height={10} /> Live Projects</span>
                      <span className="cs-pill"><Icon icon="lucide:briefcase" width={10} height={10} /> Internship</span>
                      <span className="cs-pill"><Icon icon="lucide:award" width={10} height={10} /> Certificate</span>
                    </div>
                  </div>

                  {/* Enroll button */}
                  <button
                    className="cs-enroll"
                    onClick={(e) => { e.stopPropagation(); handleEnroll(c); }}
                  >
                    Enroll Now
                    <Icon icon="lucide:arrow-right" width={12} height={12} className="cs-enroll-arrow" />
                  </button>

                  {/* Rating row */}
                  <div className="cs-card-footer">
                    <span className="cs-rating">
                      <Icon icon="lucide:star" width={11} height={11} className="cs-star-icon" />
                      {c.rating || "4.8"} ({c.reviews || "1.2k"})
                    </span>
                    <span className="cs-enrolled">
                      <Icon icon="lucide:users" width={11} height={11} />
                      {c.enrolled || "5,000"}+ Enrolled
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right arrow */}
        <button
          className="cs-arrow cs-arrow--right"
          onClick={() => goTo(currentSlide + 1)}
          disabled={currentSlide >= totalSlides}
          aria-label="Next"
        >
          <Icon icon="lucide:chevron-right" width={20} height={20} />
        </button>
      </div>

      {/* ── Dot indicators ── */}
      {totalSlides > 0 && (
        <div className="cs-dots">
          {Array.from({ length: totalSlides + 1 }).map((_, i) => (
            <button
              key={i}
              className={`cs-dot${currentSlide === i ? " cs-dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Benefits strip — UNTOUCHED ── */}
      <div className="cs-benefits-wrap">
        <div className="cs-benefits-inner">
          <div className="cs-benefits-heading">
            <span>BENEFITS OF</span>
            <span>OUR COURSES</span>
          </div>
          <div className="cs-benefits-row">
            {BENEFITS.map(({ icon, label }) => (
              <div className="cs-benefit" key={label[0]}>
                <div className="cs-benefit-ico">
                  <Icon icon={icon} width={32} height={32} color="#16a34a" />
                </div>
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
        <EnrollModal
          course={enrollCourseData}
          onClose={() => setEnrollCourseData(null)}
        />
      )}
      {/* Phone verification modal for non-logged-in users */}
      {showPhoneGate && (
        <PhoneGate onComplete={handlePhoneVerificationComplete} />
      )}
    </section>
  );
};

export default Courses;