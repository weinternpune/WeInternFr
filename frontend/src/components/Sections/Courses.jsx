import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCourses } from "../../context/CoursesContext";
import { enrollCourse } from "../../utils/api";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CourseDetailModal from "./CourseDetail";
import { Icon } from "@iconify/react";
import "./Courses.css";

/* ─── Razorpay loader (original, untouched) ─── */
const loadRazorpaySDK = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const COURSE_META = [
  {
    keys: ["web", "full stack", "fullstack", "mern"],
    icon: "lucide:code-2",
    bg: "#eaf7f0",
    iconColor: "#16a34a",
    border: "#b6e2cc",
    dot: "#16a34a",
  },
  {
    keys: ["app", "mobile", "flutter", "android"],
    icon: "lucide:smartphone",
    bg: "#e8f1fe",
    iconColor: "#2563eb",
    border: "#bdd3fb",
    dot: "#2563eb",
  },
  {
    keys: ["ai", "machine", "deep learning", "nlp"],
    icon: "lucide:brain-circuit",
    bg: "#f3eeff",
    iconColor: "#7c3aed",
    border: "#d0b8f8",
    dot: "#7c3aed",
  },
  {
    keys: ["data", "python", "sql", "analytics"],
    icon: "lucide:database",
    bg: "#fff5e6",
    iconColor: "#d97706",
    border: "#fbd49a",
    dot: "#d97706",
  },
  {
    keys: ["marketing", "seo", "digital"],
    icon: "lucide:megaphone",
    bg: "#e6faf8",
    iconColor: "#0d9488",
    border: "#99e6de",
    dot: "#0d9488",
  },
  {
    keys: ["ui", "ux", "design", "figma"],
    icon: "lucide:pencil-ruler",
    bg: "#fce7f3",
    iconColor: "#db2777",
    border: "#f8a5cc",
    dot: "#db2777",
  },
  {
    keys: ['video', 'editing', 'content', 'premiere'],
    icon: 'lucide:clapperboard',
    bg: '#fff1f2',
    iconColor: '#e11d48',
    border: '#fda4af',
    dot: '#e11d48',
  },
  {
    keys: ['cloud'],
    icon: 'lucide:cloud',
    bg: '#eff6ff',
    iconColor: '#0284c7',
    border: '#93c5fd',
    dot: '#0284c7',
  },
  {
    keys: ['devops', 'docker', 'kubernetes'],
    icon: 'lucide:settings-2',
    bg: '#f8fafc',
    iconColor: '#475569',
    border: '#cbd5e1',
    dot: '#475569',
  },
  {
    keys: ['game', 'unity'],
    icon: 'lucide:gamepad-2',
    bg: '#f5f3ff',
    iconColor: '#7c3aed',
    border: '#c4b5fd',
    dot: '#7c3aed',
  },
  {
    keys: ['business', 'analytics', 'excel', 'power bi'],
    icon: 'lucide:briefcase-business',
    bg: '#f0fdf4',
    iconColor: '#16a34a',
    border: '#86efac',
    dot: '#16a34a',
  },
];

const getCourseMeta = (title = "") => {
  const t = title.toLowerCase();
  return (
    COURSE_META.find(({ keys }) => keys.some((k) => t.includes(k))) || {
      icon: "lucide:laptop",
      bg: "#e8f4fb",
      iconColor: "#1a91c9",
      border: "#bfdfef",
      dot: "#1a91c9",
    }
  );
};

const getTools = (tools) => {
  if (Array.isArray(tools)) return tools;
  if (typeof tools === "string")
    return tools
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
};

/* ─── Benefits data — real icons ─── */
const BENEFITS = [
  {
    icon: 'lucide:graduation-cap',
    color: '#2563eb',
    bg: '#e8f1fe',
    label: ['Expert-Led', 'Training'],
  },
  {
    icon: 'lucide:clipboard-check',
    color: '#0d9488',
    bg: '#e6faf8',
    label: ['Last Exam', 'Practice'],
  },
  {
    icon: 'lucide:message-circle-question',
    color: '#d97706',
    bg: '#fff5e6',
    label: ['Scaled', 'Doubt-Solving'],
  },
  {
    icon: 'lucide:rocket',
    color: '#7c3aed',
    bg: '#f3eeff',
    label: ['Real-World', 'Projects'],
  },
  {
    icon: 'lucide:handshake',
    color: '#db2777',
    bg: '#fce7f3',
    label: ['1:1 Career', 'Support'],
  },
  {
    icon: 'lucide:badge-check',
    color: '#16a34a',
    bg: '#eaf7f0',
    label: ['Certificate of', 'Completion'],
  },
  {
    icon: 'lucide:infinity',
    color: '#0284c7',
    bg: '#eff6ff',
    label: ['Lifetime Access', 'to Resources'],
  },
  {
    icon: 'lucide:briefcase-business',
    color: '#e11d48',
    bg: '#fff1f2',
    label: ['Placement & Job', 'Assistance'],
  },
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
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    college: user?.college || "",
    degree: "",
    year: user?.year || "",
  });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.college ||
      !form.degree ||
      !form.year
    ) {
      toast.error("Please fill all fields");
      return;
    }
    const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
    if (!RAZORPAY_KEY) {
      toast.error("Payment not configured. Contact support.");
      return;
    }
    setLoading(true);
    setStep(2);
    try {
      const enrollRes = await enrollCourse({
        ...form,
        courseName: course.title,
        coursePrice: course.price,
      });
      const enrollmentId = enrollRes.data.data._id;
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) {
        toast.error("Payment gateway failed.");
        setStep(1);
        setLoading(false);
        return;
      }
      const orderRes = await API.post("/payments/create-order", {
        amount: course.price,
        enrollmentId,
      });
      const order = orderRes.data.order;
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "WeIntern",
        description: course.title,
        image: `${window.location.origin}/welogo.png`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await API.post("/payments/verify", { ...response, enrollmentId });
            toast.success("Payment successful! You are now enrolled.");
            onClose();
          } catch {
            toast.error("Verification failed. Contact support.");
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#E8A820" },
        modal: {
          ondismiss: () => {
            toast("Cancelled", { icon: "ℹ️" });
            setStep(1);
            setLoading(false);
          },
        },
      });
      rzp.on("payment.failed", (r) => {
        toast.error(`Failed: ${r.error.description}`);
        setStep(1);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error");
      setStep(1);
      setLoading(false);
    }
  };

  const meta = getCourseMeta(course.title);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <div
        className="modal-box"
        style={{ position: "relative", maxWidth: "480px" }}
      >
        <button
          onClick={() => !loading && onClose()}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "var(--muted)",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div className="enroll-header">
          <div
            className="enroll-emoji"
            style={{ color: meta.iconColor, background: meta.bg }}
          >
            <Icon icon={meta.icon} width={28} height={28} />
          </div>
          <div>
            <h3
              style={{ margin: 0, fontSize: "1.05rem", color: "var(--navy)" }}
            >
              {course.title}
            </h3>
            <div className="enroll-price-tag">
              ₹{Number(course.price).toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <div className="enroll-form-grid">
              {[
                ["name", "Full Name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
                ["college", "College", "text"],
              ].map(([n, p, t]) => (
                <div className="form-group" key={n}>
                  <label>{p} *</label>
                  <input
                    type={t}
                    name={n}
                    placeholder={p}
                    value={form[n]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Degree *</label>
                <select
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Degree</option>
                  {["BCA", "MCA", "B.Tech", "M.Tech", "BSc", "Other"].map(
                    (d) => (
                      <option key={d}>{d}</option>
                    ),
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Year *</label>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  {["1st Year", "2nd Year", "3rd Year", "Final Year"].map(
                    (y) => (
                      <option key={y}>{y}</option>
                    ),
                  )}
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

            <button
              type="submit"
              className="btn btn-primary btn-full enroll-pay-btn"
            >
              🔒 Pay ₹{Number(course.price).toLocaleString("en-IN")} →
            </button>
            <button
              type="button"
              className="btn btn-outline btn-full"
              onClick={onClose}
              style={{ marginTop: ".6rem" }}
            >
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
   Main Course Component
══════════════════════════════════════════════════════════════ */
const Courses = () => {
  const [detailCourse, setDetailCourse] = useState(null);
  const [enrollCourseData, setEnrollCourseData] = useState(null);
  const [showAllCourses, setShowAllCourses]     = useState(false);
  const { activeCourses } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnroll = (course) => {
    if (!user) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }
    setDetailCourse(null);
    setEnrollCourseData(course);
  };

  return (
    <section className="courses" id="courses">
      {/* ── Header ── */}
      <div className="cs-header">
        <div className="cs-header-center">
          <h2 className="cs-main-title">
            Explore <span className="cs-title-accent">In-Demand</span>{" "}
            <span className="cs-title-serif">Courses</span>
          </h2>
          <p className="cs-sub">
            Upskill with Job-Ready Programs &amp; Career-Driven Certifications.
          </p>
        </div>
        <button
          className="cs-view-all"
          onClick={() => setShowAllCourses((prev) => !prev)}
        >
          {showAllCourses ? 'View Less' : 'View All Courses'}
          <Icon
            icon="lucide:arrow-right"
            className="cs-view-arrow"
            width={14}
            height={14}
          />
        </button>
      </div>

      {/* ── 6-column card grid ── */}
      <div className="cs-grid">
        {activeCourses
          .filter((c, index) => showAllCourses || index < 6)
          .map((c) => {
            const meta  = getCourseMeta(c.title);
            const tools = getTools(c.tools).slice(0, 4);

            return (
              <div
                key={c.id || c.title}
                className="cs-card"
                style={{
                  '--card-soft-bg': '#eef7f1',
                  '--enroll-color': '#16a34a',
                  '--crd-border':   '#b7e4c7',
                }}
                onClick={() => setDetailCourse(c)}
              >
                {/* Pastel icon zone */}
                <div className="cs-card-icon-zone" style={{ background: meta.bg }}>
                  <div className="cs-card-icon-wrap" style={{ color: meta.iconColor }}>
                    <Icon icon={meta.icon} width={40} height={40} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Text content */}
                <div className="cs-card-content">
                  <h3 className="cs-card-title">{c.title}</h3>
                  <p className="cs-card-dur">{c.duration}</p>

                  <ul className="cs-card-list">
                    {tools.map((t) => (
                      <li key={t}>
                        <span className="cs-bullet-dot" style={{ background: meta.dot }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enroll button */}
                <button
                  className="cs-enroll"
                  style={{
                    '--enroll-color':  meta.iconColor,
                    '--enroll-border': meta.border,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnroll(c);
                  }}
                >
                  Enroll Now
                  <Icon icon="lucide:arrow-right" width={13} height={13} className="cs-enroll-arrow" />
                </button>
              </div>
            );
          })}
      </div>

      {/* ── Benefits strip ── */}
      <div className="cs-benefits-wrap">
        <div className="cs-benefits-inner">
          <div className="cs-benefits-heading">
            <span>BENEFITS OF</span>
            <span>OUR COURSES</span>
          </div>
          <div className="cs-benefits-row">
            {BENEFITS.map(({ icon, color, bg, label }) => (
              <div className="cs-benefit" key={label[0]}>
                <div
                  className="cs-benefit-ico"
                  style={{
                    background: bg,
                    borderRadius: '10px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon icon={icon} width={22} height={22} color={color} />
                </div>
                <p className="cs-benefit-lbl">
                  {label[0]}
                  <br />
                  {label[1]}
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
    </section>
  );
};

export default Courses;
