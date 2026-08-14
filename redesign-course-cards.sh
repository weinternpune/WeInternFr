#!/bin/bash
set -e

# ============================================================
# WeIntern - Popular-programs style course cards
# (colorful tech icon row, cycling navy/blue-gray/gold card
# colors, "Join Now" link) + syncs in the earlier dead-code
# cleanup and blue-to-gold color fixes so everything is
# consistent in one place.
# Run from your project ROOT:
#   cd ~/path/to/WeInternFr
#   bash redesign-course-cards.sh
# ============================================================

SRC="frontend/src"

if [ ! -f "$SRC/components/Sections/Courses.jsx" ]; then
  echo "Cannot find $SRC/components/Sections/Courses.jsx -- run this from your project root."
  exit 1
fi

echo "[1/7] Writing frontend/src/components/Sections/Courses.jsx ..."
mkdir -p "frontend/src/components/Sections"
cat > "frontend/src/components/Sections/Courses.jsx" << 'FILEEOF1'
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCourses } from "../../context/CoursesContext";
import { enrollCourse } from "../../utils/api";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PhoneGate from "../PhoneGate/PhoneGate";
import { Icon } from "@iconify/react";
import { slugify, getTechIcon } from "../../data/courseExtras";
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
  blue:   "linear-gradient(135deg, #ffd23f 0%, #bfdbfe 50%, #ffffff 100%)",
  purple: "linear-gradient(135deg, #ffd23f 0%, #ddd6fe 50%, #ffffff 100%)",
  amber:  "linear-gradient(135deg, #fbbf24 0%, #fde68a 50%, #ffffff 100%)",
  teal:   "linear-gradient(135deg, #2dd4bf 0%, #99f6e4 50%, #ffffff 100%)",
  pink:   "linear-gradient(135deg, #f472b6 0%, #fbcfe8 50%, #ffffff 100%)",
  rose:   "linear-gradient(135deg, #fb7185 0%, #fecdd3 50%, #ffffff 100%)",
  sky:    "linear-gradient(135deg, #ffd23f 0%, #ffd23f 50%, #ffffff 100%)",
  slate:  "linear-gradient(135deg, #94a3b8 0%, #e2e8f0 50%, #ffffff 100%)",
};

const COURSE_META = [
  { keys: ["web","full stack","fullstack","mern"],   icon: "lucide:code-2",             bg: HEADER_GRADIENTS.green,  iconColor: "#16a34a", border: "#bbf7d0", dot: "#16a34a",  badge: "Popular",    badgeIcon: "lucide:flame",    badgeColor: "#fff7ed", badgeText: "#ea580c" },
  { keys: ["app","mobile","flutter","android"],       icon: "lucide:smartphone",         bg: HEADER_GRADIENTS.blue,   iconColor: "#ffd23f", border: "#bfdbfe", dot: "#ffd23f",  badge: "Trending",   badgeIcon: "lucide:trending-up", badgeColor: "#eff6ff", badgeText: "#ffd23f" },
  { keys: ["ai","machine","deep learning","nlp","automation"], icon: "lucide:brain-circuit", bg: HEADER_GRADIENTS.purple, iconColor: "#7c3aed", border: "#ddd6fe", dot: "#7c3aed", badge: "New",       badgeIcon: "lucide:sparkles", badgeColor: "#faf5ff", badgeText: "#7c3aed" },
  { keys: ["data","sql","analytics"],                 icon: "lucide:database",           bg: HEADER_GRADIENTS.amber,  iconColor: "#d97706", border: "#fde68a", dot: "#d97706",  badge: "In Demand",  badgeIcon: "lucide:zap",      badgeColor: "#fffbeb", badgeText: "#d97706" },
  { keys: ["python"],                                 icon: "lucide:code",               bg: HEADER_GRADIENTS.purple, iconColor: "#7c3aed", border: "#ddd6fe", dot: "#7c3aed",  badge: "Popular",    badgeIcon: "lucide:flame",    badgeColor: "#faf5ff", badgeText: "#7c3aed" },
  { keys: ["java"],                                   icon: "lucide:coffee",             bg: HEADER_GRADIENTS.green,  iconColor: "#16a34a", border: "#bbf7d0", dot: "#16a34a",  badge: "Popular",    badgeIcon: "lucide:flame",    badgeColor: "#fff7ed", badgeText: "#ea580c" },
  { keys: ["c++","cpp","c/c++"],                      icon: "lucide:terminal",           bg: HEADER_GRADIENTS.sky,    iconColor: "#ffd23f", border: "#ffd23f", dot: "#ffd23f",  badge: "In Demand",  badgeIcon: "lucide:zap",      badgeColor: "#f0f9ff", badgeText: "#ffd23f" },
  { keys: ["marketing","seo","digital"],              icon: "lucide:megaphone",          bg: HEADER_GRADIENTS.teal,   iconColor: "#0d9488", border: "#99f6e4", dot: "#0d9488",  badge: "Trending",   badgeIcon: "lucide:trending-up", badgeColor: "#f0fdfa", badgeText: "#0d9488" },
  { keys: ["ui","ux","design","figma"],               icon: "lucide:pencil-ruler",       bg: HEADER_GRADIENTS.pink,   iconColor: "#ec4899", border: "#fbcfe8", dot: "#ec4899",  badge: "Popular",    badgeIcon: "lucide:flame",    badgeColor: "#fdf2f8", badgeText: "#ec4899" },
  { keys: ["video","editing","content","premiere"],   icon: "lucide:clapperboard",       bg: HEADER_GRADIENTS.rose,   iconColor: "#e11d48", border: "#fecdd3", dot: "#e11d48",  badge: "Popular",    badgeIcon: "lucide:flame",    badgeColor: "#fff1f2", badgeText: "#e11d48" },
  { keys: ["cloud"],                                  icon: "lucide:cloud",              bg: HEADER_GRADIENTS.sky,    iconColor: "#ffd23f", border: "#ffd23f", dot: "#ffd23f",  badge: "In Demand",  badgeIcon: "lucide:zap",      badgeColor: "#f0f9ff", badgeText: "#ffd23f" },
  { keys: ["devops","docker","kubernetes"],           icon: "lucide:settings-2",         bg: HEADER_GRADIENTS.slate,  iconColor: "#475569", border: "#e2e8f0", dot: "#475569",  badge: "In Demand",  badgeIcon: "lucide:zap",      badgeColor: "#f8fafc", badgeText: "#475569" },
  { keys: ["game","unity"],                           icon: "lucide:gamepad-2",          bg: HEADER_GRADIENTS.purple, iconColor: "#7c3aed", border: "#ddd6fe", dot: "#7c3aed",  badge: "New",        badgeIcon: "lucide:sparkles", badgeColor: "#faf5ff", badgeText: "#7c3aed" },
  { keys: ["business","analytics","excel","power bi"],icon: "lucide:briefcase-business", bg: HEADER_GRADIENTS.green,  iconColor: "#16a34a", border: "#bbf7d0", dot: "#16a34a",  badge: "Popular",    badgeIcon: "lucide:flame",    badgeColor: "#fff7ed", badgeText: "#ea580c" },
];

const getCourseMeta = (title = "") => {
  const t = title.toLowerCase();
  return (
    COURSE_META.find(({ keys }) => keys.some((k) => t.includes(k))) || {
      icon: "lucide:laptop", bg: HEADER_GRADIENTS.sky, iconColor: "#E8A820",
      border: "#bfdfef", dot: "#E8A820", badge: "In Demand",
      badgeIcon: "lucide:zap", badgeColor: "#f0f9ff", badgeText: "#ffd23f",
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
  Technology: ["web","full stack","fullstack","mern","app","mobile","flutter","android","ai","machine","deep learning","nlp","automation","data","python","java","c++","cpp","c/c++","programming","sql","cloud","devops","docker","kubernetes","game","unity","business","analytics","excel","power bi"],
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
   EnrollModal  —  with offer system
══════════════════════════════════════════════════════════════ */
export const EnrollModal = ({ course, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [paymentType, setPaymentType] = useState('full'); // 'full' or 'emi'
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "",
    college: user?.college || "", degree: "", year: user?.year || "",
  });

  // Calculate offer details
  const originalPrice = course.originalPrice || Math.round(course.price * 1.2); // 20% markup for original
  const offerPrice = course.price;
  const discount = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
  const emi1 = Math.ceil(offerPrice * 0.3); // 30% first installment
  const emi2 = Math.ceil((offerPrice - emi1) / 2); // remaining split in 2
  const emi3 = offerPrice - emi1 - emi2;
  const couponDiscount = couponApplied ? Math.round(offerPrice * 0.1) : 0;
  const finalPrice = offerPrice - couponDiscount;
  const finalEmi1 = Math.ceil(finalPrice * 0.3);
  const finalEmi2 = Math.ceil((finalPrice - finalEmi1) / 2);
  const finalEmi3 = finalPrice - finalEmi1 - finalEmi2;
  const payAmount = paymentType === 'emi' ? finalEmi1 : finalPrice;

  const VALID_COUPONS = ['WEINTERN10', 'INTERN10', 'WELCOME10', 'LAUNCH10', 'STUDENT10'];

  const applyCoupon = () => {
    if (!couponCode.trim()) { setCouponError('Please enter a coupon code'); return; }
    setCouponLoading(true);
    setCouponError('');
    setTimeout(() => {
      if (VALID_COUPONS.includes(couponCode.trim().toUpperCase())) {
        setCouponApplied(true);
        setCouponError('');
        toast.success('Coupon applied! 10% discount added 🎉');
      } else {
        setCouponApplied(false);
        setCouponError('Invalid coupon code. Please check and try again.');
      }
      setCouponLoading(false);
    }, 800);
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setCouponError('');
    toast('Coupon removed', { icon: 'ℹ️' });
  };

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
      const orderRes = await API.post("/payments/create-order", { 
        amount: payAmount, 
        enrollmentId,
        paymentType,
        emiInstallment: paymentType === 'emi' ? 1 : null,
        couponApplied,
        couponCode: couponApplied ? couponCode : null,
        originalPrice: offerPrice,
        discountAmount: couponDiscount,
        finalPrice
      });
      const order = orderRes.data.order;
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY, amount: order.amount, currency: "INR",
        name: "WeIntern", description: course.title,
        image: `${window.location.origin}/welogo.png`, order_id: order.id,
        handler: async (response) => {
          try {
            await API.post("/payments/verify", { 
              ...response, 
              enrollmentId,
              paymentType,
              emiInstallment: paymentType === 'emi' ? 1 : null,
              amount: payAmount,
              couponApplied,
              couponCode: couponApplied ? couponCode : null,
              originalPrice: offerPrice,
              discountAmount: couponDiscount,
              finalPrice
            });
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
          <div style={{ flex: 1 }}>
            <h3 style={{ margin:0, fontSize:"1.05rem", color:"var(--navy)" }}>{course.title}</h3>
            <div className="enroll-price-row">
              <span className="enroll-original-price">₹{Number(originalPrice).toLocaleString("en-IN")}</span>
              <span className="enroll-discount-badge">{discount}% OFF</span>
              <span className="enroll-offer-price">₹{Number(offerPrice).toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div className="enroll-offer-badge">
            <Icon icon="lucide:tag" width={12} height={12} />
            <div>
              <div className="enroll-offer-badge-title">OFFER PRICE</div>
              <div className="enroll-offer-badge-subtitle">Limited Time Offer!</div>
            </div>
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

            {/* Special Offer Section */}
            <div className="enroll-special-offer">
              <div className="enroll-offer-icon">
                <Icon icon="lucide:tag" width={20} height={20} />
              </div>
              <div className="enroll-offer-text">
                <strong>Special Offer for You!</strong>
                <div className="enroll-offer-prices">
                  Original Price <span className="enroll-offer-strike">₹{Number(originalPrice).toLocaleString("en-IN")}</span> — Now at Offer Price <span className="enroll-offer-highlight">₹{Number(offerPrice).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button 
                type="button"
                className="enroll-show-price-btn"
                onClick={() => setShowPrice(!showPrice)}
              >
                <Icon icon={showPrice ? "lucide:eye-off" : "lucide:eye"} width={14} height={14} />
                {showPrice ? "Hide Price" : "Ohh! Price Dekhna"}
              </button>
            </div>

            {/* Price breakdown - shown on button click */}
            {showPrice && (
              <div className="enroll-price-breakdown">
                <div className="enroll-price-row-item">
                  <span>Course Fee</span>
                  <span>₹{Number(originalPrice).toLocaleString("en-IN")}</span>
                </div>
                <div className="enroll-price-row-item enroll-discount-row">
                  <span>Limited Time Discount ({discount}%)</span>
                  <span>- ₹{Number(originalPrice - offerPrice).toLocaleString("en-IN")}</span>
                </div>
                <div className="enroll-price-row-item enroll-total-row">
                  <span><strong>Total Amount</strong></span>
                  <span><strong>₹{Number(offerPrice).toLocaleString("en-IN")}</strong></span>
                </div>
              </div>
            )}

            {/* Coupon Code */}
            <div className="coupon-section">
              <div className="coupon-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                Have a Coupon Code?
              </div>
              {!couponApplied ? (
                <div className="coupon-input-row">
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                  />
                  <button
                    type="button"
                    className="coupon-apply-btn"
                    onClick={applyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              ) : (
                <div className="coupon-applied-row">
                  <div className="coupon-applied-info">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span><strong>{couponCode}</strong> applied — 10% off!</span>
                    <span className="coupon-saved">You save ₹{Number(couponDiscount).toLocaleString('en-IN')}</span>
                  </div>
                  <button type="button" className="coupon-remove-btn" onClick={removeCoupon}>✕</button>
                </div>
              )}
              {couponError && <div className="coupon-error">{couponError}</div>}
              {couponApplied && (
                <div className="coupon-price-summary">
                  <div className="cps-row">
                    <span>Course Fee</span>
                    <span>₹{Number(offerPrice).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="cps-row cps-discount">
                    <span>Coupon Discount (10%)</span>
                    <span>− ₹{Number(couponDiscount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="cps-row cps-total">
                    <span>Final Amount</span>
                    <strong>₹{Number(finalPrice).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Type Selector */}
            <div className="emi-selector">
              <div className="emi-selector-label">Choose Payment Option</div>
              <div className="emi-options">
                <button
                  type="button"
                  className={`emi-option${paymentType === 'full' ? ' active' : ''}`}
                  onClick={() => setPaymentType('full')}
                >
                  <div className="emi-option-title">Full Payment</div>
                  <div className="emi-option-price">₹{Number(finalPrice).toLocaleString('en-IN')}</div>
                  <div className="emi-option-sub">Pay once, save more</div>
                </button>
                <button
                  type="button"
                  className={`emi-option${paymentType === 'emi' ? ' active' : ''}`}
                  onClick={() => setPaymentType('emi')}
                >
                  <div className="emi-option-title">3-Part EMI</div>
                  <div className="emi-option-price">₹{Number(finalEmi1).toLocaleString('en-IN')} now</div>
                  <div className="emi-option-sub">+ 2 more in 20 days</div>
                </button>
              </div>
              {paymentType === 'emi' && (
                <div className="emi-breakdown">
                  <div className="emi-breakdown-title">EMI Schedule</div>
                  <div className="emi-breakdown-row">
                    <span>📅 Today (1st Installment — 30%)</span>
                    <strong>₹{Number(finalEmi1).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="emi-breakdown-row">
                    <span>📅 After 20 days (2nd Installment)</span>
                    <strong>₹{Number(finalEmi2).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="emi-breakdown-row">
                    <span>📅 After 40 days (3rd Installment)</span>
                    <strong>₹{Number(finalEmi3).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="emi-breakdown-total">
                    <span>Total</span>
                    <strong>₹{Number(finalPrice).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              )}
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
              {paymentType === 'full' 
                ? `Pay ₹${Number(finalPrice).toLocaleString('en-IN')} Now`
                : `Pay EMI 1: ₹${Number(finalEmi1).toLocaleString('en-IN')} Now`}
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
  const [enrollCourseData, setEnrollCourseData] = useState(null);
  const [activeTab, setActiveTab] = useState("Technology");
  const [currentSlide, setCurrentSlide] = useState(0);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const autoScrollInterval = useRef(null);
  const { activeCourses } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Phone verification state (disabled for home page)
  const [showPhoneGate, setShowPhoneGate] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [pendingCourse, setPendingCourse] = useState(null);

  // Note: Phone verification timer is disabled on home page
  // Phone verification only happens during registration/login flow

  const handlePhoneVerificationComplete = () => {
    console.log('✅ Phone verification completed in Courses!');
    setShowPhoneGate(false);
    setPhoneVerified(true);
    
    // If there was a pending course
    if (pendingCourse) {
      if (!user) {
        // User is not logged in, redirect to login
        toast.success("Phone verified! Please login to continue enrollment");
        navigate("/login");
      } else {
        // User is logged in, proceed with enrollment
        console.log('✅ User logged in - proceeding with enrollment');
        setEnrollCourseData(pendingCourse);
      }
      setPendingCourse(null);
    }
  };

  const handleEnroll = (course) => {
    console.log('🎯 Enroll Now clicked for:', course.title);
    
    // Check if user is logged in
    if (!user) {
      // User not logged in - redirect to login directly
      console.log('❌ User not logged in - redirecting to login/register');
      toast("Please login or register to enroll", { icon: 'ℹ️' });
      navigate("/login");
      return;
    }
    
    // User is logged in - proceed directly with enrollment
    console.log('✅ User logged in - proceeding with enrollment');
    setEnrollCourseData(course);
  };

  /* Filter by tab */
  const filteredCourses = activeCourses.filter((c) => {
    const t = c.title.toLowerCase();
    const keys = TAB_KEYS[activeTab] || [];
    return keys.some((k) => t.includes(k));
  });

  /* If no matches for tab, fall back to all */
  const displayCourses = filteredCourses.length > 0 ? filteredCourses : activeCourses;

  // Auto-scroll for mobile using IntersectionObserver
  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    // Check if mobile using matchMedia (works globally)
    const isMobile = window.matchMedia('(max-width: 575.98px)').matches;
    
    if (!isMobile) {
      console.log('❌ Not mobile - skipping auto-scroll');
      return;
    }

    console.log('✅ Mobile detected - starting auto-scroll...');
    let scrollPosition = 0;
    const scrollSpeed = 4; // pixels per frame
    const scrollDelay = 30; // ms between frames
    let isUserScrolling = false;
    let userScrollTimeout = null;

    const autoScroll = () => {
      if (!viewport || isUserScrolling) return;
      
      scrollPosition += scrollSpeed;
      viewport.scrollTop = scrollPosition;

      // Reset when reached bottom
      if (scrollPosition >= viewport.scrollHeight - viewport.clientHeight) {
        scrollPosition = 0;
        viewport.scrollTop = 0;
      }
    };

    // Start auto-scroll
    const intervalId = setInterval(autoScroll, scrollDelay);
    console.log('🔄 Auto-scroll interval started:', intervalId);

    // Pause on user interaction
    const handleUserInteraction = (e) => {
      if (e.type === 'wheel' || e.type === 'touchstart') {
        console.log('👆 User interaction detected - pausing auto-scroll');
        isUserScrolling = true;
        
        if (userScrollTimeout) {
          clearTimeout(userScrollTimeout);
        }
        
        // Resume after 5 seconds of no interaction
        userScrollTimeout = setTimeout(() => {
          if (viewport) {
            console.log('▶️ Resuming auto-scroll');
            isUserScrolling = false;
            scrollPosition = viewport.scrollTop;
          }
        }, 5000);
      }
    };

    viewport.addEventListener('touchstart', handleUserInteraction, { passive: true });
    viewport.addEventListener('wheel', handleUserInteraction, { passive: true });

    return () => {
      console.log('🛑 Cleaning up auto-scroll');
      clearInterval(intervalId);
      if (userScrollTimeout) {
        clearTimeout(userScrollTimeout);
      }
      if (viewport) {
        viewport.removeEventListener('touchstart', handleUserInteraction);
        viewport.removeEventListener('wheel', handleUserInteraction);
      }
    };
  }, [activeTab, displayCourses.length]);

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
          Explore Our <span className="cs-title-accent">Training + Internships</span>
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
        <div className="cs-carousel-viewport" ref={viewportRef}>
          <div
            className="cs-carousel-track"
            ref={trackRef}
            style={{ transform: `translateX(calc(-${currentSlide} * ((100% - ${visible - 1} * 0.85rem) / ${visible} + 0.85rem)))` }}
          >
            {displayCourses.map((c) => {
              const meta = getCourseMeta(c.title);
              const tools = getTools(c.tools).slice(0, 4);
              
              // Calculate offer details
              const originalPrice = c.originalPrice || Math.round(c.price * 1.2);
              const offerPrice = c.price;
              const discount = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);

              return (
                <div
                  key={c.id || c.title}
                  className="cs-card"
                  style={{ "--crd-border": meta.border, "--enroll-color": meta.iconColor }}
                  onClick={() => navigate(`/courses/${slugify(c.title)}`)}
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
                    
                    {/* Offer Price Box */}
                    <div className="cs-card-offer-box">
                      <div className="cs-offer-label">OFFER PRICE</div>
                      <div className="cs-offer-old-price">
                        ₹{Number(originalPrice).toLocaleString("en-IN")}
                        <span className="cs-offer-discount">{discount}% OFF</span>
                      </div>
                      <div className="cs-offer-new-price">₹{Number(offerPrice).toLocaleString("en-IN")}</div>
                      <div className="cs-emi-label">or ₹{Math.ceil(offerPrice * 0.3).toLocaleString("en-IN")} EMI</div>
                    </div>
                    
                    {/* Icon box */}
                    <div className="cs-card-icon-wrap" style={{ color: meta.iconColor }}>
                      <Icon icon={meta.icon} width={26} height={26} strokeWidth={1.8} />
                    </div>

                    {/* Colorful tech icon row, like the reference design */}
                    <div className="cs-tech-row">
                      {tools.slice(0, 4).map((t) => (
                        <span className="cs-tech-badge" key={t} title={t}>
                          <Icon icon={getTechIcon(t)} width={16} height={16} />
                        </span>
                      ))}
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

                  {/* Join Now link, matching the reference design */}
                  <button
                    className="cs-join-now"
                    onClick={(e) => { e.stopPropagation(); navigate(`/courses/${slugify(c.title)}`); }}
                  >
                    Join Now <Icon icon="lucide:arrow-right" width={13} height={13} />
                  </button>

                  {/* Rating row */}
                  <div className="cs-card-footer">
                    <span className="cs-rating">
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
FILEEOF1

echo "[2/7] Writing frontend/src/components/Sections/Courses.css ..."
mkdir -p "frontend/src/components/Sections"
cat > "frontend/src/components/Sections/Courses.css" << 'FILEEOF2'
/* ── Section ── */
.courses {
  background: #f0f2f8;
  padding: 2.8rem 0 0;
  font-family: 'DM Sans', sans-serif;
}

/* ══════════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════════ */
.cs-header {
  text-align: center;
  margin-bottom: 1.4rem;
  padding: 0 4%;
}

.cs-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #fff;
  border: 1px solid #e2d9f8;
  color: #6d28d9;
  font-size: 0.74rem;
  font-weight: 600;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  margin-bottom: 0.7rem;
  letter-spacing: 0.01em;
}

.cs-badge-rocket-icon {
  flex-shrink: 0;
  color: #6d28d9;
}

.cs-main-title {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(1.6rem, 3.2vw, 2.4rem);
  font-weight: 900;
  color: #0d1b3e;
  margin: 0 0 0.4rem;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.cs-title-accent {
  color: #6d28d9;
}

.cs-sub {
  font-size: 0.85rem;
  color: #6b7a99;
  margin: 0;
}

/* ══════════════════════════════════════════════════
   TABS
══════════════════════════════════════════════════ */
.cs-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.6rem;
  padding: 0 4%;
}

.cs-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.48rem 1.2rem;
  border-radius: 999px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.18s ease;
}

.cs-tab:hover {
  border-color: #ffd23f;
  color: #6d28d9;
}

.cs-tab--active {
  background: #5b21b6;
  border-color: #5b21b6;
  color: #fff;
  box-shadow: 0 4px 12px rgba(91, 33, 182, 0.3);
}

.cs-tab--active:hover {
  color: #fff;
}

/* ══════════════════════════════════════════════════
   CAROUSEL ROOT
══════════════════════════════════════════════════ */
.cs-carousel-root {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 2%;
  /* Side padding gives space for arrows */
}

/* ── Arrow buttons ── */
.cs-arrow {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(13, 27, 62, 0.1);
  transition: all 0.18s ease;
  z-index: 2;
  position: relative;
}

.cs-arrow:hover:not(:disabled) {
  background: #5b21b6;
  border-color: #5b21b6;
  color: #fff;
  box-shadow: 0 4px 14px rgba(91, 33, 182, 0.3);
}

.cs-arrow:disabled {
  opacity: 0.35;
  cursor: default;
}

/* ── Viewport (masks overflow) ── */
.cs-carousel-viewport {
  flex: 1;
  overflow: hidden;
  padding: 0.5rem 0.4rem 0.8rem;
  /* Let the browser treat horizontal drag as a slide gesture,
     while vertical page scroll still works normally on touch. */
  touch-action: pan-y;
}

/* ── Track (sliding strip of all cards) ── */
.cs-carousel-track {
  display: flex;
  gap: 0.85rem;
  transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1);
  /* Each card takes exactly 1/visible-count of the viewport.
     NOTE: the per-breakpoint flex-basis below must always equal
     (100% - (visibleCount - 1) * gap) / visibleCount — this is the
     same formula the JS translateX step uses in Courses.jsx. Keeping
     these two in lockstep is what prevents the carousel drifting /
     clipping cards as you slide. */
  width: 100%;
}

/* ══════════════════════════════════════════════════
   CARDS
   Target height ≈ 370-380px matching reference.
   Icon zone: 130px | Content: flex-1 | Footer ~40px
══════════════════════════════════════════════════ */
.cs-card {
  /* Desktop default (>=1200px): 5 visible cards.
     Each card = (viewport - 4 gaps) / 5 */
  flex: 0 0 calc((100% - 4 * 0.85rem) / 5);
  min-width: 0;

  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--crd-border, #e2e8f0);
  box-shadow: 0 2px 10px rgba(13, 27, 62, 0.06);

  display: flex;
  flex-direction: column;

  cursor: pointer;
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.cs-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(13, 27, 62, 0.12);
}

/* ── Gradient icon zone ── */
.cs-card-icon-zone {
  position: relative;
  /* Fixed height keeps cards uniform and compact */
  height: 130px;
  padding: 0.9rem 0.9rem 1.6rem;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  flex-shrink: 0;
}

/* Curved wave bottom edge */
.cs-card-icon-zone::after {
  content: "";
  position: absolute;
  left: -15%;
  right: -15%;
  bottom: -20px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  pointer-events: none;
}

/* Badge chip top-right */
.cs-card-badge {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  display: inline-flex;
  align-items: center;
  gap: 0.22rem;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  z-index: 1;
  letter-spacing: 0.01em;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

/* Offer Price Box - Extra Compact, Numbers Only */
.cs-card-offer-box {
  position: absolute;
  top: 2.2rem;
  right: 0.6rem;
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid #e5e7eb;
  border-radius: 5px;
  padding: 0.25rem 0.35rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 3;
  min-width: 55px;
  backdrop-filter: blur(8px);
}

.cs-offer-label {
  display: none;
}

.cs-offer-label::before {
  display: none;
}

.cs-offer-old-price {
  font-family: 'Poppins', sans-serif;
  font-size: 0.55rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
  margin-bottom: 0.12rem;
  display: block;
  line-height: 1;
}

.cs-offer-discount {
  background: #fef3c7;
  color: #d97706;
  font-size: 0.42rem;
  font-weight: 700;
  padding: 0.1rem 0.25rem;
  border-radius: 3px;
  text-decoration: none;
  margin: 0.15rem auto;
  display: inline-block;
  letter-spacing: 0.01em;
}

.cs-offer-new-price {
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #16a34a;
  line-height: 1;
  letter-spacing: -0.02em;
  display: block;
  margin-top: 0.12rem;
}

/* Icon white box */
.cs-card-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(13, 27, 62, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

/* ── Card text content ── */
.cs-card-content {
  padding: 0.55rem 0.85rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.cs-card-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 800;
  color: #0d1b3e;
  line-height: 1.3;
  margin: 0 0 0.2rem;
  word-break: break-word;
}

.cs-card-dur {
  display: flex;
  align-items: center;
  gap: 0.28rem;
  font-size: 0.68rem;
  font-weight: 500;
  color: #6b7a99;
  margin: 0 0 0.45rem;
}

.cs-dur-icon {
  flex-shrink: 0;
  color: #9aa6bf;
}

/* Feature list */
.cs-card-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
}

.cs-card-list li {
  display: flex;
  align-items: center;
  gap: 0.38rem;
  font-size: 0.72rem;
  color: #374151;
  font-weight: 500;
  line-height: 1.4;
}

.cs-bullet-check {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Feature pills row */
.cs-feature-pills {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 0.4rem;
}

.cs-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6rem;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  padding: 0.2rem 0.45rem;
  white-space: nowrap;
}

/* ── Enroll button ── */
.cs-enroll {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: calc(100% - 1.7rem);
  margin: 0.55rem 0.85rem 0;
  padding: 0.52rem 0.7rem;
  background: var(--enroll-color, #16a34a);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(13, 27, 62, 0.12);
  transition: filter 0.18s, box-shadow 0.18s, transform 0.18s;
  letter-spacing: 0.01em;
  flex-shrink: 0;
}

.cs-enroll:hover {
  filter: brightness(0.9);
  box-shadow: 0 6px 18px rgba(13, 27, 62, 0.18);
  transform: translateY(-1px);
}

.cs-enroll-arrow {
  flex-shrink: 0;
}

/* ── Card footer (rating only) ── */
.cs-card-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.85rem 0.65rem;
  flex-shrink: 0;
}

.cs-star-icon {
  color: #f59e0b;
  flex-shrink: 0;
}

/* ══════════════════════════════════════════════════
   DOT INDICATORS
══════════════════════════════════════════════════ */
.cs-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  margin: 0.5rem 0 0;
  padding: 0;
}

.cs-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: #cbd5e1;
  cursor: pointer;
  padding: 0;
  transition: all 0.22s ease;
}

.cs-dot--active {
  background: #5b21b6;
  width: 22px;
  border-radius: 4px;
}

/* ══════════════════════════════════════════════════
   BENEFITS STRIP  —  UNTOUCHED (copied verbatim)
══════════════════════════════════════════════════ */
.cs-benefits-wrap {
  background: #ffffff;
  border: 1px solid #e7e9f0;
  border-radius: 14px;
  margin: 1.5rem 0 0;
  padding: 1.4rem 2%;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}

.cs-benefits-inner {
  display: flex;
  align-items: center;
  gap: 2rem;
  max-width: 100%;
}

.cs-benefits-heading {
  display: flex;
  flex-direction: column;
  font-size: .7rem;
  font-weight: 800;
  color: #0d1b3e;
  text-transform: uppercase;
  letter-spacing: .04em;
  line-height: 1.4;
  white-space: nowrap;
  flex-shrink: 0;
  padding-right: 2rem;
  border-right: 1px solid #e5e7eb;
  min-width: 120px;
}

.cs-benefits-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 0.4rem;
  flex-wrap: nowrap;
}

.cs-benefit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  text-align: left;
  min-width: auto;
  flex: 1;
}

.cs-benefit-ico {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cs-benefit-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  display: block;
}

.cs-benefit:hover .cs-benefit-ico {
  color: #ffd23f;
  transform: scale(1.12);
}

.cs-benefit-lbl {
  font-size: 0.68rem;
  font-weight: 600;
  color: #374151;
  line-height: 1.4;
  margin: 0;
  white-space: nowrap;
}

/* ══════════════════════════════════════════════════
   PRESERVED — EnrollModal & form styles (untouched)
══════════════════════════════════════════════════ */
.enroll-course-name {
  text-align: center;
  font-size: .95rem;
  font-weight: 600;
  color: var(--navy);
  background: var(--cream);
  border-radius: var(--rsm);
  padding: .6rem 1rem;
  margin-bottom: .75rem;
}

.enroll-price {
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 900;
  color: var(--gold);
  margin-bottom: 1.5rem;
}

.enroll-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--cream, #f9f7f2);
  border-radius: var(--rsm, 8px);
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border, #e5e7eb);
}

.enroll-emoji {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.enroll-price-tag {
  font-family: 'Poppins', sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--gold, #e8a820);
  margin-top: 2px;
}

/* ── New Offer System Styles ── */
.enroll-price-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
  flex-wrap: wrap;
}

.enroll-original-price {
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
}

.enroll-discount-badge {
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.enroll-offer-price {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f97316;
}

.enroll-offer-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #fbbf24;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-size: 0.7rem;
  line-height: 1.2;
}

.enroll-offer-badge-title {
  font-weight: 700;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.enroll-offer-badge-subtitle {
  font-weight: 600;
  color: #b45309;
}

.enroll-special-offer {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 2px solid #86efac;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.enroll-offer-icon {
  width: 40px;
  height: 40px;
  background: #16a34a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.enroll-offer-text {
  flex: 1;
  font-size: 0.85rem;
  color: #1B2A4A;
}

.enroll-offer-text strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #166534;
}

.enroll-offer-prices {
  font-size: 0.8rem;
  color: #4b5563;
}

.enroll-offer-strike {
  text-decoration: line-through;
  color: #9ca3af;
}

.enroll-offer-highlight {
  font-weight: 700;
  color: #16a34a;
  font-size: 0.9rem;
}

.enroll-show-price-btn {
  background: #16a34a;
  color: white;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}

.enroll-show-price-btn:hover {
  background: #15803d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.enroll-price-breakdown {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.enroll-price-row-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  font-size: 0.85rem;
  color: #4b5563;
}

.enroll-discount-row {
  color: #16a34a;
  font-weight: 600;
}

.enroll-total-row {
  border-top: 2px solid #e5e7eb;
  margin-top: 0.4rem;
  padding-top: 0.6rem;
  font-size: 0.95rem;
  color: #1B2A4A;
}

.enroll-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .75rem 1rem;
}

.enroll-form-grid .form-group {
  margin-bottom: 0;
}

.payment-methods-preview {
  background: #f8fafc;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: var(--rsm, 8px);
  padding: .85rem 1rem;
  margin: 1.25rem 0;
}

.pm-label {
  font-size: .75rem;
  font-weight: 700;
  color: var(--muted, #6b7a99);
  margin-bottom: .6rem;
}

.pm-icons {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
}

.pm-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: white;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 6px;
  padding: .3rem .7rem;
  font-size: .72rem;
  font-weight: 600;
  color: var(--navy, #0d1b3e);
}

.enroll-pay-btn {
  margin-top: .5rem;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  background: linear-gradient(135deg, #E8A820, #f5c842);
  box-shadow: 0 4px 16px rgba(232, 168, 32, .35);
}

.enroll-pay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(232, 168, 32, .45);
}

.enroll-processing {
  text-align: center;
  padding: 2rem 1rem;
}

.processing-spinner {
  width: 52px;
  height: 52px;
  border: 4px solid var(--border, #e5e7eb);
  border-top-color: var(--gold, #e8a820);
  border-radius: 50%;
  animation: spin .8s linear infinite;
  margin: 0 auto 1.25rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.enroll-processing h3 {
  color: var(--navy, #0d1b3e);
  font-family: 'Playfair Display', serif;
  margin-bottom: .5rem;
}

.enroll-processing p {
  color: var(--muted, #6b7a99);
  font-size: .9rem;
  margin-bottom: 1.5rem;
}

.processing-steps {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  text-align: left;
  background: var(--cream, #f9f7f2);
  border-radius: var(--rsm, 8px);
  padding: 1rem 1.25rem;
}

.ps-item {
  font-size: .85rem;
  font-weight: 500;
  color: var(--muted, #6b7a99);
}

.ps-item.done {
  color: #059669;
}

.ps-item.active {
  color: var(--gold, #e8a820);
  font-weight: 700;
}

/* ══════════════════════════════════════════════════
   RESPONSIVE BREAKPOINTS

   Visible-card tiers (kept in sync with getVisible() in Courses.jsx):
     >=1200px      → 5 cards  (desktop — default rule above, unchanged)
     992px–1199px  → 4 cards  (laptop)
     768px–991px   → 3 cards  (tablet landscape)
     576px–767px   → 2 cards  (tablet portrait)
     <576px        → 1 card   (mobile)

   Each tier's .cs-card flex-basis MUST equal
   (100% - (visibleCount - 1) * 0.85rem) / visibleCount,
   because that is exactly what the JS translateX step computes.
   This was the source of the original drift/clipping bug — the old
   480px tier used `100% - 0.85rem` instead of `100%`, so the slide
   step (matched to 1 card) overshot the actual card width by one
   gap on every advance.
══════════════════════════════════════════════════ */

@media (min-width: 1280px) {
  .courses {
    padding: 3rem 0 0;
  }
}

/* ── Laptop: 4 cards ── */
@media (max-width: 1199.98px) {
  .cs-card {
    flex: 0 0 calc((100% - 3 * 0.85rem) / 4);
  }
}

/* ── Tablet landscape: 3 cards ── */
@media (max-width: 991.98px) {
  .cs-card {
    flex: 0 0 calc((100% - 2 * 0.85rem) / 3);
  }

  /* Smaller arrows on tablet, as required */
  .cs-arrow {
    width: 34px;
    height: 34px;
  }
}

/* ── Tablet portrait: 2 cards ── */
@media (max-width: 767.98px) {
  .cs-card {
    flex: 0 0 calc((100% - 1 * 0.85rem) / 2);
  }

  .cs-arrow {
    width: 30px;
    height: 30px;
  }

  .cs-tabs {
    gap: 0.35rem;
  }

  .cs-tab {
    padding: 0.4rem 0.85rem;
    font-size: 0.78rem;
  }

  /* Benefits responsive (logic preserved verbatim from original) */
  .cs-benefits-inner {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .cs-benefits-heading {
    border-right: none;
    border-bottom: 1px solid #d1d5db;
    padding-right: 0;
    padding-bottom: 0.75rem;
    min-width: auto;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cs-benefits-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem 0.5rem;
    width: 100%;
    flex: unset;
    justify-items: center;
  }

  .cs-benefit {
    flex: unset;
    width: 100%;
    min-width: unset;
    align-items: center;
    text-align: center;
  }

  .cs-benefit-lbl {
    white-space: normal;
    text-align: center;
    font-size: 0.64rem;
  }
}

/* ── Mobile: exactly 1 card, 100% width, auto + manual scroll ── */
@media (max-width: 575.98px) {
  .courses {
    padding: 2rem 0 1rem;
  }

  .cs-main-title {
    font-size: 1.5rem;
  }

  /* Carousel */
  .cs-carousel-root {
    position: relative;
    padding: 0 12px;
    display: flex;
    align-items: center;
  }

  .cs-carousel-viewport {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem 0.4rem 0.9rem;
    height: 600px; /* Increased from 550px */
    width: 100%;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: var(--gold) var(--cream);
  }

  /* Webkit scrollbar styling */
  .cs-carousel-viewport::-webkit-scrollbar {
    width: 6px;
  }

  .cs-carousel-viewport::-webkit-scrollbar-track {
    background: var(--cream);
    border-radius: 10px;
  }

  .cs-carousel-viewport::-webkit-scrollbar-thumb {
    background: var(--gold);
    border-radius: 10px;
  }

  .cs-carousel-viewport::-webkit-scrollbar-thumb:hover {
    background: var(--navy);
  }

  /* Auto-scroll animation for the viewport */
  .cs-carousel-viewport.auto-scrolling {
    animation: mobileAutoScroll 50s linear infinite;
  }

  /* Pause on hover/touch */
  .cs-carousel-viewport.auto-scrolling:hover {
    animation-play-state: paused;
  }

  @keyframes mobileAutoScroll {
    0% {
      scroll-behavior: auto;
    }
    100% {
      scroll-behavior: auto;
    }
  }

  .cs-carousel-track {
    display: flex;
    flex-direction: column;
  }

  /* Ensure cards are clickable */
  .cs-card {
    flex: 0 0 auto;
    width: 100%;
    margin-bottom: 0.85rem;
    pointer-events: auto;
    cursor: pointer;
  }
  
  /* Offer box responsive on mobile - Extra compact */
  .cs-card-offer-box {
    min-width: 50px;
    padding: 0.22rem 0.32rem;
    top: 2rem;
    right: 0.5rem;
    border-radius: 4px;
  }
  
  .cs-offer-label {
    display: none;
  }
  
  .cs-offer-old-price {
    font-size: 0.52rem;
    margin-bottom: 0.1rem;
  }
  
  .cs-offer-discount {
    font-size: 0.38rem;
    padding: 0.08rem 0.22rem;
    margin: 0.12rem auto;
  }
  
  .cs-offer-new-price {
    font-size: 0.75rem;
    margin-top: 0.1rem;
  }

  /* Increase card size for mobile */
  .cs-card-icon-zone {
    height: 170px; /* Increased from 150px */
    padding: 1.2rem 1.2rem 2rem;
  }

  .cs-card-icon-wrap {
    width: 70px; /* Increased from 60px */
    height: 70px;
  }

  .cs-card-content {
    padding: 0.8rem 1.2rem 0; /* Increased padding */
  }

  .cs-card-title {
    font-size: 1.1rem; /* Increased from 1rem */
    margin: 0 0 0.35rem;
  }

  .cs-card-dur {
    font-size: 0.82rem; /* Increased from 0.75rem */
    margin: 0 0 0.6rem;
  }

  .cs-card-list {
    gap: 0.4rem; /* Increased from 0.35rem */
    margin: 0 0 0.7rem;
  }

  .cs-card-list li {
    font-size: 0.85rem; /* Increased from 0.78rem */
  }

  .cs-card-footer {
    padding: 0.85rem 1.2rem; /* Increased padding */
  }

  .cs-card-price {
    font-size: 1.2rem; /* Increased from 1.1rem */
  }

  .cs-cta-btn {
    padding: 0.6rem 1.3rem; /* Increased button size */
    font-size: 0.85rem;
  }

  /* Hide arrows for mobile */
  .cs-arrow {
    display: none;
  }

  /* Hide dots for mobile */
  .cs-dots {
    display: none;
  }

  /* Tabs */
  .cs-tabs {
    gap: 0.3rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 3%;
  }

  .cs-tab {
    font-size: 0.75rem;
    padding: 0.38rem 0.75rem;
  }

  /* Modal Form */
  .enroll-form-grid {
    grid-template-columns: 1fr;
  }
  
  /* Offer system responsive */
  .enroll-special-offer {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
    padding: 0.85rem;
  }
  
  .enroll-show-price-btn {
    width: 100%;
    justify-content: center;
  }
  
  .enroll-offer-badge {
    padding: 0.3rem 0.6rem;
    font-size: 0.65rem;
  }
  
  .enroll-price-row {
    justify-content: flex-start;
  }
  
  .enroll-header {
    flex-wrap: wrap;
  }

  /* Benefits Section (reduced gap) */
  .cs-benefits-wrap {
    padding: 1rem;
    margin-top: 1rem;
  }

  .cs-benefits-inner {
    flex-direction: column;
    align-items: center;
    gap: 0.85rem;
  }

  .cs-benefits-heading {
    border-right: none;
    border-bottom: 1px solid #d1d5db;
    padding-right: 0;
    padding-bottom: 0.6rem;
    min-width: auto;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.7rem;
  }

  .cs-benefits-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 0.5rem;
    width: 100%;
    justify-items: center;
  }

  .cs-benefit {
    width: 100%;
    min-width: unset;
    align-items: center;
    text-align: center;
    gap: 0.35rem;
  }

  .cs-benefit-ico {
    width: 32px;
    height: 32px;
  }

  .cs-benefit-img {
    width: 24px;
    height: 24px;
  }

  .cs-benefit-lbl {
    font-size: 0.62rem;
    white-space: normal;
    text-align: center;
  }
}
/* Tiny phones */
@media (max-width: 400px) {
  .cs-main-title {
    font-size: 1.3rem;
  }

  .cs-benefits-wrap {
    padding: 0.85rem;
  }

  .cs-benefits-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem 0.4rem;
  }

  .cs-benefit {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  .cs-benefit-lbl {
    font-size: 0.6rem;
    text-align: center;
  }
}

/* ── EMI on course card ── */
.cs-emi-label {
  font-size: .68rem;
  color: rgba(255,255,255,0.75);
  margin-top: 3px;
  font-weight: 500;
}

/* ── EMI selector in EnrollModal ── */
.emi-selector { margin: 1rem 0; }
.emi-selector-label {
  font-size: .78rem; font-weight: 700; color: var(--navy);
  text-transform: uppercase; letter-spacing: .05em; margin-bottom: .65rem;
}
.emi-options { display: grid; grid-template-columns: 1fr 1fr; gap: .65rem; }
.emi-option {
  border: 2px solid var(--border); border-radius: 10px;
  padding: .85rem .75rem; cursor: pointer; background: white;
  text-align: left; transition: all .2s; font-family: 'DM Sans', sans-serif;
}
.emi-option:hover { border-color: var(--gold); }
.emi-option.active { border-color: var(--gold); background: rgba(232,168,32,.06); }
.emi-option-title { font-size: .78rem; font-weight: 700; color: var(--navy); margin-bottom: .2rem; }
.emi-option-price { font-size: 1rem; font-weight: 800; color: var(--gold); margin-bottom: .15rem; }
.emi-option-sub { font-size: .68rem; color: var(--muted); }
.emi-breakdown {
  background: #f8fafc; border: 1px solid var(--border);
  border-radius: 10px; padding: .85rem 1rem; margin-top: .65rem;
}
.emi-breakdown-title {
  font-size: .75rem; font-weight: 700; color: var(--navy);
  margin-bottom: .6rem; text-transform: uppercase; letter-spacing: .05em;
}
.emi-breakdown-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: .35rem 0; border-bottom: 1px solid var(--border);
  font-size: .8rem; color: var(--muted);
}
.emi-breakdown-row strong { color: var(--navy); }
.emi-breakdown-total {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: .5rem; margin-top: .25rem;
  font-size: .85rem; font-weight: 700; color: var(--navy);
}

/* ── Coupon Section ── */
.coupon-section {
  background: #f8fafc; border: 1.5px dashed #d1d5db;
  border-radius: 12px; padding: 1rem; margin: 1rem 0;
}
.coupon-label {
  display: flex; align-items: center; gap: .4rem;
  font-size: .8rem; font-weight: 700; color: var(--navy);
  margin-bottom: .65rem;
}
.coupon-input-row { display: flex; gap: .5rem; }
.coupon-input {
  flex: 1; padding: .6rem .85rem; border: 1.5px solid var(--border);
  border-radius: 8px; font-size: .88rem; font-family: 'Space Mono', monospace;
  text-transform: uppercase; letter-spacing: .05em; outline: none;
  transition: border-color .2s;
}
.coupon-input:focus { border-color: var(--gold); }
.coupon-apply-btn {
  padding: .6rem 1.1rem; background: var(--navy); color: white;
  border: none; border-radius: 8px; font-weight: 700; font-size: .85rem;
  cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s;
  white-space: nowrap;
}
.coupon-apply-btn:hover:not(:disabled) { background: var(--gold); color: var(--navy); }
.coupon-apply-btn:disabled { opacity: .6; cursor: not-allowed; }
.coupon-applied-row {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(24,180,91,.08); border: 1.5px solid rgba(24,180,91,.3);
  border-radius: 8px; padding: .65rem .85rem;
}
.coupon-applied-info {
  display: flex; align-items: center; gap: .5rem;
  font-size: .82rem; color: var(--navy); flex-wrap: wrap;
}
.coupon-saved {
  background: rgba(24,180,91,.15); color: #18b45b;
  font-size: .72rem; font-weight: 700; padding: .15rem .5rem;
  border-radius: 50px;
}
.coupon-remove-btn {
  background: none; border: none; cursor: pointer;
  color: var(--muted); font-size: .85rem; padding: .2rem .4rem;
  border-radius: 4px; transition: all .2s; flex-shrink: 0;
}
.coupon-remove-btn:hover { background: rgba(220,69,69,.1); color: #dc4545; }
.coupon-error {
  font-size: .78rem; color: #dc4545; margin-top: .5rem;
  display: flex; align-items: center; gap: .35rem;
}
.coupon-error::before { content: '⚠'; }
.coupon-price-summary {
  margin-top: .75rem; padding-top: .75rem;
  border-top: 1px solid rgba(24,180,91,.2);
}
.cps-row {
  display: flex; justify-content: space-between;
  font-size: .82rem; color: var(--muted); padding: .25rem 0;
}
.cps-discount { color: #18b45b; }
.cps-total {
  display: flex; justify-content: space-between;
  font-size: .9rem; color: var(--navy); padding-top: .4rem;
  border-top: 1px solid var(--border); margin-top: .25rem;
}
.cps-total strong { color: var(--gold); font-size: 1rem; }

/* ── Popular-programs style redesign: colorful icon zones,
   cycling card accent colors, tech-icon row, Join Now link ── */
.cs-tech-row {
  position: absolute;
  bottom: 10px;
  left: 14px;
  display: flex;
  gap: 6px;
  z-index: 2;
}
.cs-tech-badge {
  width: 30px; height: 30px; border-radius: 9px;
  background: rgba(255,255,255,0.92);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.18);
  color: #14192e;
}

.cs-join-now {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; cursor: pointer;
  padding: 0 1.1rem .9rem;
  font-size: .82rem; font-weight: 700;
  color: #E8A820;
  transition: gap .15s ease, opacity .15s ease;
}
.cs-join-now:hover { gap: 9px; opacity: .85; }

/* Cycle icon-zone background: navy / soft blue-gray / gold / navy ... */
.cs-card:nth-child(4n+2) .cs-card-icon-zone {
  background: linear-gradient(150deg, #7d97ad, #4b6478) !important;
}
.cs-card:nth-child(4n+3) .cs-card-icon-zone {
  background: linear-gradient(150deg, #ffd23f, #E8A820) !important;
}
.cs-card:nth-child(4n+3) .cs-card-badge { background: rgba(20,25,46,0.16) !important; color: #14192e !important; }
.cs-card:nth-child(4n+3) .cs-card-icon-wrap { color: #14192e !important; }
.cs-card:nth-child(4n+3) .cs-join-now { color: #14192e; }
.cs-card:nth-child(4n+1) .cs-card-icon-zone,
.cs-card:nth-child(4n) .cs-card-icon-zone {
  background: linear-gradient(150deg, #1c2444, #0e1428) !important;
}
FILEEOF2

echo "[3/7] Writing frontend/src/components/Layout/Navbar.jsx ..."
mkdir -p "frontend/src/components/Layout"
cat > "frontend/src/components/Layout/Navbar.jsx" << 'FILEEOF3'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronDown,
  ChevronRight,
  Monitor,
  Database,
  Coffee,
  Cpu,
  Globe2,
  Bot,
  TrendingUp,
  Terminal,
  ShieldCheck,
  PenTool,
  Palette,
  Megaphone,
  Rocket,
  Code2,
  BarChart3,
  Sparkles,
  Briefcase,
  Award,
  Users,
} from 'lucide-react';
import './Navbar.css';

// ---- Courses mega-menu data ------------------------------------------------
const COURSE_COLUMNS = [
  {
    key: 'development',
    title: 'Development',
    icon: Code2,
    items: [
      { num: 1, label: 'Full Stack Development', desc: 'MERN, REST APIs & deployment', icon: Monitor, color: 'text-amber-300', badge: 'Popular' },
      { num: 2, label: 'MERN Stack Development', desc: 'MongoDB, Express, React, Node', icon: Database, color: 'text-emerald-400' },
      { num: 3, label: 'Java Development', desc: 'Core Java to Spring Boot', icon: Coffee, color: 'text-amber-400' },
      { num: 4, label: 'C / C++ Programming', desc: 'DSA & systems fundamentals', icon: Cpu, color: 'text-orange-400' },
      { num: 5, label: 'Web Development', desc: 'HTML, CSS & modern JS', icon: Globe2, color: 'text-orange-300' },
    ],
  },
  {
    key: 'data-ai',
    title: 'Data & AI',
    icon: BarChart3,
    items: [
      { num: 6, label: 'AI / ML', desc: 'Models, training & deployment', icon: Bot, color: 'text-purple-400', badge: 'Popular' },
      { num: 7, label: 'Data Science', desc: 'Statistics, EDA & storytelling', icon: TrendingUp, color: 'text-orange-400' },
      { num: 8, label: 'Python Development', desc: 'Scripting, backend & automation', icon: Terminal, color: 'text-yellow-400' },
      { num: 9, label: 'Cyber Security', desc: 'Network & app security basics', icon: ShieldCheck, color: 'text-yellow-500' },
      { num: 10, label: 'Data Analytics', desc: 'SQL, dashboards & reporting', icon: Database, color: 'text-fuchsia-400' },
    ],
  },
  {
    key: 'design-other',
    title: 'Design & Other',
    icon: Palette,
    items: [
      { num: 11, label: 'UI / UX Design', desc: 'Figma, wireframes & prototyping', icon: PenTool, color: 'text-pink-400', badge: 'Popular' },
      { num: 12, label: 'Graphic Design', desc: 'Visual identity & branding', icon: Sparkles, color: 'text-orange-400' },
      { num: 13, label: 'Digital Marketing', desc: 'SEO, ads & social growth', icon: Megaphone, color: 'text-amber-500' },
    ],
  },
];

// Hover-intent timing
const OPEN_DELAY = 60;
const CLOSE_DELAY = 220;

const panelVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.035, delayChildren: 0.03 },
  },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12, ease: 'easeIn' } },
};

const columnVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

// Per-item entrance, staggered inside each column
const itemListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } },
};

// Subtle icon-chip "pop" on row hover — restrained, no bounce
const iconChipVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } },
};

const CoursesDropdown = ({ onNavigate, id, onMouseEnter, onMouseLeave }) => (
  <motion.div
    id={id}
    role="menu"
    variants={panelVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className="
      absolute left-1/2 top-full z-50 mt-3 flex w-[94vw] max-w-[1000px] -translate-x-1/2
      flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a1626]
      shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65)]
      sm:w-[90vw] md:w-[88vw] lg:w-[min(80vw,1000px)]
    "
    style={{ maxHeight: 'min(80vh, 640px)' }}
  >
    <motion.div
      className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[#00d68f]/0 via-[#00d68f] to-[#00d68f]/0"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'center' }}
    />

    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 lg:gap-x-8 lg:p-7">
        {COURSE_COLUMNS.map((col, colIdx) => (
          <motion.div
            key={col.key}
            variants={columnVariants}
            className={`
              ${colIdx > 0 ? 'sm:border-l sm:border-white/[0.06] sm:pl-6 lg:pl-8' : ''}
              ${colIdx === 2 ? 'sm:col-span-2 sm:border-l-0 sm:border-t sm:border-white/[0.06] sm:pl-0 sm:pt-6 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0' : ''}
            `}
          >
            <div className="mb-4 flex items-center gap-2 text-[#00d68f]">
              <col.icon size={15} strokeWidth={2.25} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                {col.title}
              </span>
            </div>

            <motion.div variants={itemListVariants} className="flex flex-col gap-1">
              {col.items.map((item) => (
                <motion.button
                  key={item.num}
                  variants={itemVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.985 }}
                  role="menuitem"
                  onClick={() => onNavigate(item)}
                  className="
                    group/item relative flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5
                    text-left transition-colors duration-150
                    hover:bg-white/[0.05] focus-visible:bg-white/[0.05]
                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00d68f]/50
                  "
                >
                  <motion.span
                    variants={iconChipVariants}
                    className={`
                      mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                      bg-white/[0.04] ${item.color}
                      group-hover/item:bg-white/[0.08]
                    `}
                    style={{ transition: 'background-color 150ms' }}
                  >
                    <item.icon size={15} strokeWidth={2} />
                  </motion.span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[13.5px] font-medium text-white/90 group-hover/item:text-white">
                        {item.num}. {item.label}
                      </span>
                      {item.badge && (
                        <span className="shrink-0 rounded-full bg-[#00d68f]/15 px-1.5 py-[1px] text-[9.5px] font-semibold tracking-wide text-[#00d68f]">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[11.5px] text-white/40">
                      {item.desc}
                    </span>
                  </span>

                  <ChevronRight
                    size={14}
                    className="mt-1.5 shrink-0 text-white/20 opacity-0 transition-all duration-150 group-hover/item:translate-x-0.5 group-hover/item:text-white/50 group-hover/item:opacity-100"
                  />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>

    <motion.div
      variants={columnVariants}
      className="
        flex shrink-0 flex-col items-start justify-between gap-4 border-t border-white/[0.06]
        bg-white/[0.015] px-5 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5 lg:px-7
      "
    >
      <div className="flex items-center gap-3">
        <motion.span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00d68f]/10 text-[#00d68f]"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Rocket size={16} />
        </motion.span>
        <div>
          <p className="text-[13.5px] font-semibold text-white">
            Can&rsquo;t decide which course is right for you?
          </p>
          <p className="text-[11.5px] text-white/45">
            Answer a few questions and we&rsquo;ll suggest the perfect course for your goals.
          </p>
        </div>
      </div>

      <motion.button
        onClick={() => onNavigate({ findMyCourse: true })}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="
          group/cta flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#00d68f] px-4 py-2.5
          text-[13px] font-semibold text-[#04160f] shadow-sm shadow-[#00d68f]/20
          transition-shadow duration-150 hover:brightness-110 hover:shadow-md hover:shadow-[#00d68f]/25
          sm:w-auto
        "
      >
        Find My Course
        <ChevronRight size={15} className="transition-transform duration-150 group-hover/cta:translate-x-0.5" />
      </motion.button>
    </motion.div>
  </motion.div>
);

// -----------------------------------------------------------------------------

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [internshipsOpen, setInternshipsOpen] = useState(false);
  const [mobileInternshipsOpen, setMobileInternshipsOpen] = useState(false);
  const internshipsRef = useRef(null);
  const internshipsCloseTimer = useRef(null);
  const [canHover, setCanHover] = useState(false);
  const coursesRef = useRef(null);
  const coursesTriggerRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detect true hover-capable pointers (desktop/laptop) vs touch devices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mq.matches);
    const listener = (e) => setCanHover(e.matches);
    mq.addEventListener ? mq.addEventListener('change', listener) : mq.addListener(listener);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', listener) : mq.removeListener(listener);
    };
  }, []);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const openCourses = useCallback(() => {
    clearTimers();
    openTimer.current = setTimeout(() => setCoursesOpen(true), OPEN_DELAY);
  }, []);

  const scheduleCloseCourses = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setCoursesOpen(false), CLOSE_DELAY);
  }, []);

  useEffect(() => clearTimers, []);

  // Close the Courses dropdown on outside click / Escape, restore focus on Escape
  useEffect(() => {
    const onClick = (e) => {
      if (coursesRef.current && !coursesRef.current.contains(e.target)) {
        setCoursesOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && coursesOpen) {
        clearTimers();
        setCoursesOpen(false);
        coursesTriggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [coursesOpen]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setCoursesOpen(false);
    const NAV_H = 74;
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - NAV_H;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(doScroll, 400);
    } else {
      doScroll();
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const handleCourseNavigate = useCallback((item) => {
    clearTimers();
    setCoursesOpen(false);
    setMenuOpen(false);
    if (item.findMyCourse) {
      navigate('/find-my-course');
      return;
    }
    navigate(`/courses/${item.key || item.label.toLowerCase().replace(/[\s/]+/g, '-')}`);
  }, [navigate]);

  const handleTriggerClick = () => {
    clearTimers();
    setCoursesOpen((o) => !o);
  };

  const openInternships = useCallback(() => {
    if (internshipsCloseTimer.current) clearTimeout(internshipsCloseTimer.current);
    setInternshipsOpen(true);
  }, []);
  const scheduleCloseInternships = useCallback(() => {
    if (internshipsCloseTimer.current) clearTimeout(internshipsCloseTimer.current);
    internshipsCloseTimer.current = setTimeout(() => setInternshipsOpen(false), 200);
  }, []);

  const INTERNSHIP_COLUMNS = [
    {
      key: 'projects', title: 'Projects', icon: Code2,
      items: [
        { label: 'Live Client Projects', desc: 'Work on real projects from WeNexa', icon: Briefcase },
        { label: 'Portfolio Building', desc: 'Ship work you can show employers', icon: Award },
      ],
      target: 'projects',
    },
    {
      key: 'placement', title: 'Placement', icon: Users,
      items: [
        { label: 'Stipend & Earnings', desc: '75% of project value goes to students', icon: TrendingUp },
        { label: 'Career Support', desc: 'Mentor-guided growth into full-time roles', icon: Rocket },
      ],
      target: 'home',
    },
  ];

  const NAV_LINKS = [
    { label: 'Courses',      id: 'courses', dropdown: true },
    { label: 'Internships',  id: 'internships', simpleDropdown: true },
    { label: 'Events',       id: 'journey', scrollTo: true },
    { label: 'Blog',         id: 'blog', isRoute: true },
    { label: 'About Us',     id: 'about', isRoute: true },
    { label: 'Contact',      id: 'contact', scrollTo: true },
  ];

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="nav-inner">
        <Link to="/" className="logo-link">
          <img src="/welogo.png" alt="WeIntern" className="nav-logo" />
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map(l => {
            if (l.dropdown) {
              return (
                <li
                  key={l.id}
                  ref={coursesRef}
                  className="relative"
                  onMouseEnter={canHover ? openCourses : undefined}
                  onMouseLeave={canHover ? scheduleCloseCourses : undefined}
                >
                  <button
                    ref={coursesTriggerRef}
                    className="nav-link relative inline-flex items-center gap-1"
                    onClick={handleTriggerClick}
                    onFocus={openCourses}
                    aria-expanded={coursesOpen}
                    aria-haspopup="menu"
                    aria-controls="courses-mega-menu"
                  >
                    <span className={coursesOpen ? 'text-[#00d68f]' : ''}>{l.label}</span>
                    <motion.span
                      animate={{ rotate: coursesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="flex"
                    >
                      <ChevronDown size={14} className={coursesOpen ? 'text-[#00d68f]' : ''} />
                    </motion.span>
                    <motion.span
                      className="absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#00d68f]"
                      initial={false}
                      animate={{ width: coursesOpen ? '100%' : '0%', opacity: coursesOpen ? 1 : 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </button>
                  <AnimatePresence>
                    {coursesOpen && (
                      <CoursesDropdown
                        id="courses-mega-menu"
                        onNavigate={handleCourseNavigate}
                        onMouseEnter={canHover ? openCourses : undefined}
                        onMouseLeave={canHover ? scheduleCloseCourses : undefined}
                      />
                    )}
                  </AnimatePresence>
                </li>
              );
            }
            if (l.simpleDropdown) {
              return (
                <li
                  key={l.id}
                  ref={internshipsRef}
                  className="relative"
                  onMouseEnter={canHover ? openInternships : undefined}
                  onMouseLeave={canHover ? scheduleCloseInternships : undefined}
                >
                  <button
                    className="nav-link relative inline-flex items-center gap-1"
                    onClick={() => setInternshipsOpen((o) => !o)}
                    aria-expanded={internshipsOpen}
                    aria-haspopup="menu"
                  >
                    <span className={internshipsOpen ? 'text-[#00d68f]' : ''}>{l.label}</span>
                    <ChevronDown size={14} className={internshipsOpen ? 'text-[#00d68f]' : ''} style={{ transform: internshipsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                  </button>
                  <AnimatePresence>
                    {internshipsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.16 }}
                        className="internships-dropdown"
                        onMouseEnter={canHover ? openInternships : undefined}
                        onMouseLeave={canHover ? scheduleCloseInternships : undefined}
                      >
                        {INTERNSHIP_COLUMNS.map((col) => (
                          <div className="internships-col" key={col.key}>
                            <div className="internships-col-head">
                              <col.icon size={14} strokeWidth={2.25} />
                              <span>{col.title}</span>
                            </div>
                            {col.items.map((item) => (
                              <button
                                key={item.label}
                                className="internships-item"
                                onClick={() => { setInternshipsOpen(false); col.target === 'home' ? navigate('/') : scrollTo(col.target); }}
                              >
                                <span className="internships-item-icon"><item.icon size={14} /></span>
                                <span>
                                  <span className="internships-item-label">{item.label}</span>
                                  <span className="internships-item-desc">{item.desc}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            }
            return (
              <li key={l.id}>
                {l.isRoute ? (
                  <Link to={`/${l.id}`} className="nav-link">
                    {l.label}
                  </Link>
                ) : (
                  <button className="nav-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="nav-ctas">
          {user ? (
            <>
              <div className="nav-user-info">
                <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
                <span className="nav-user-type">
                  {user.role === 'admin' ? 'Admin' : 'Student'}
                </span>
              </div>
              {user.role === 'admin'
                ? <Link to="/admin" className="btn btn-outline" style={{fontSize:'.82rem',padding:'.5rem 1rem'}}>⚙️ Admin</Link>
                : <Link to="/dashboard" className="btn btn-outline" style={{fontSize:'.82rem',padding:'.5rem 1rem'}}>Dashboard</Link>
              }
              <button onClick={handleLogout} className="btn btn-outline" style={{fontSize:'.82rem',padding:'.5rem 1rem'}}>Logout</button>
            </>
          ) : (
            <>
              <div className="nav-students-count">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>4k+ Students</span>
              </div>
              <div className="nav-for-biz">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <span>For Businesses</span>
              </div>
              <Link to="/login" className="btn-nav-login">Login / Sign Up</Link>
            </>
          )}
        </div>

        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="mobile-menu overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 74px)' }}
          >
            {NAV_LINKS.map(l => {
              if (l.dropdown) {
                return (
                  <div key={l.id} className="flex flex-col">
                    <button
                      className="mobile-nav-link inline-flex items-center justify-between"
                      onClick={() => setMobileCoursesOpen((o) => !o)}
                      aria-expanded={mobileCoursesOpen}
                    >
                      {l.label}
                      <motion.span
                        animate={{ rotate: mobileCoursesOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex"
                      >
                        <ChevronDown size={16} />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {mobileCoursesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18, ease: 'easeInOut' }}
                          className="overflow-hidden px-3 pb-4 pt-1 sm:px-4"
                        >
                          <motion.div
                            variants={{
                              hidden: {},
                              visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                            }}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4"
                          >
                            {COURSE_COLUMNS.map((col) => (
                              <motion.div
                                key={col.key}
                                variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } } }}
                              >
                                <div className="mb-2 flex items-center gap-2 text-[#00d68f]">
                                  <col.icon size={14} strokeWidth={2.25} />
                                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                                    {col.title}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  {col.items.map((item) => (
                                    <motion.button
                                      key={item.num}
                                      onClick={() => handleCourseNavigate(item)}
                                      whileTap={{ scale: 0.97 }}
                                      transition={{ duration: 0.1 }}
                                      className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-left text-sm text-white/90 active:bg-white/[0.06]"
                                    >
                                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04] ${item.color}`}>
                                        <item.icon size={14} />
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="flex items-center gap-2">
                                          <span className="truncate">{item.num}. {item.label}</span>
                                          {item.badge && (
                                            <span className="shrink-0 rounded-full bg-[#00d68f]/15 px-1.5 py-0.5 text-[9px] font-semibold text-[#00d68f]">
                                              {item.badge}
                                            </span>
                                          )}
                                        </span>
                                      </span>
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                            <motion.button
                              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } } }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleCourseNavigate({ findMyCourse: true })}
                              className="flex items-center justify-center gap-2 rounded-lg bg-[#00d68f] px-4 py-2.5 text-sm font-semibold text-[#04160f]"
                            >
                              <Rocket size={15} />
                              Find My Course
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              if (l.simpleDropdown) {
                return (
                  <div key={l.id} className="flex flex-col">
                    <button
                      className="mobile-nav-link inline-flex items-center justify-between"
                      onClick={() => setMobileInternshipsOpen((o) => !o)}
                      aria-expanded={mobileInternshipsOpen}
                    >
                      {l.label}
                      <ChevronDown size={16} style={{ transform: mobileInternshipsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                    </button>
                    <AnimatePresence>
                      {mobileInternshipsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden px-3 pb-4 pt-1 sm:px-4"
                        >
                          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                            {INTERNSHIP_COLUMNS.map((col) => (
                              <div key={col.key}>
                                <div className="mb-2 flex items-center gap-2 text-[#00d68f]">
                                  <col.icon size={14} strokeWidth={2.25} />
                                  <span className="text-[11px] font-semibold uppercase tracking-wider">{col.title}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  {col.items.map((item) => (
                                    <button
                                      key={item.label}
                                      onClick={() => { setMenuOpen(false); setMobileInternshipsOpen(false); col.target === 'home' ? navigate('/') : scrollTo(col.target); }}
                                      className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-left text-sm text-white/90 active:bg-white/[0.06]"
                                    >
                                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
                                        <item.icon size={14} />
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="block truncate">{item.label}</span>
                                        <span className="block truncate text-xs text-white/50">{item.desc}</span>
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return l.isRoute ? (
                <Link key={l.id} to={`/${l.id}`} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  {l.label}
                </Link>
              ) : (
                <button key={l.id} className="mobile-nav-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
              );
            })}
            {user ? (
              <>
                {user.role === 'admin'
                  ? <Link to="/admin" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Admin Panel</Link>
                  : <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Dashboard</Link>
                }
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mobile-cta-btn">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="mobile-cta-btn">Login / Sign Up</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
FILEEOF3

echo "[4/7] Writing frontend/src/components/Sections/Hero.jsx ..."
mkdir -p "frontend/src/components/Sections"
cat > "frontend/src/components/Sections/Hero.jsx" << 'FILEEOF4'
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Monitor, IndianRupee, School, Star } from "lucide-react";
import heroStudents from "../../assets/hero-students.jpg/hero-students.png";

const FEATURES = [
  {
    label: "Mentor Guided",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Live Client Projects",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: "Stipend Opportunities",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Real Portfolio",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    label: "Career Growth",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];
const floatingCards = [
  {
    icon: <Users className="h-6 w-6 text-emerald-400" />,
    value: "2,000+",
    label: "Student Impact",
  },
  {
    icon: <Monitor className="h-6 w-6 text-emerald-400" />,
    value: "100+",
    label: "Live Projects",
  },
  {
    icon: <IndianRupee className="h-6 w-6 text-emerald-400" />,
    value: "₹5 Lakh+",
    label: "Paid in Stipends",
  },
  {
    icon: <School className="h-6 w-6 text-emerald-400" />,
    value: "5+",
    label: "College Partners",
  },

];

const STATS = [
  {
    target: 2000,
    suffix: "+",
    label: "Student Impact",
    color: "text-emerald-400",
  },
  { target: 100, suffix: "+", label: "Live Projects", color: "text-amber-400" },
  {
    target: 5,
    prefix: "₹",
    suffix: " Lakh+",
    label: "Paid in Stipends",
    color: "text-orange-400",
  },
  {
    target: 75,
    suffix: "%",
    label: "of Project Value to Students",
    color: "text-emerald-400",
  },
  {
    target: 5,
    suffix: "+",
    label: "College Partners",
    color: "text-orange-400",
  },
  {
    static: "5/5",
    label: "Student Rating",
    color: "text-amber-400",
    stars: true,
  },
];

// A handful of fixed, non-uniform dot positions so the grid doesn't look mechanically repeated.
const GRID_DOTS = [
  { top: "6%", left: "34%" },
  { top: "3%", left: "88%" },
  { top: "18%", left: "4%" },
  { top: "46%", left: "96%" },
  { top: "58%", left: "2%" },
  { top: "72%", left: "46%" },
  { top: "30%", left: "55%" },
  { top: "88%", left: "99%" },
  { top: "95%", left: "20%" },
];

// Count-up on scroll into view — no external CSS, no dependency beyond React.
const Counter = ({ target, prefix = "", suffix = "", duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [target, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0B1D2E] pt-14 pb-0 sm:pt-16 lg:pt-20"
    >
      {/* Ambient background — checkered grid + scattered dots + soft glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F2438] via-[#0B1D2E] to-[#081521]" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {GRID_DOTS.map((d, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-emerald-400/70"
            style={{ top: d.top, left: d.left }}
          />
        ))}
        <motion.div
          className="absolute -top-24 left-[8%] h-[220px] w-[220px] rounded-full bg-emerald-400/10 blur-[80px] sm:h-[320px] sm:w-[320px] sm:blur-[100px]"
          animate={{ x: [0, 25, 0], y: [0, 15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-16 right-[6%] h-[190px] w-[190px] rounded-full bg-amber-400/10 blur-[80px] sm:h-[280px] sm:w-[280px] sm:blur-[100px]"
          animate={{ x: [0, -20, 0], y: [0, -12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left — copy */}
          <div className="flex flex-col items-start">
            <div className="mt-8 inline-flex max-w-full items-center gap-1.5 rounded-full justify-start border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-medium tracking-wide text-emerald-300 sm:mt-12 sm:min-w-[220px] sm:text-[11px] lg:mt-20">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="leading-tight">
                INDIA'S No 1 LEARN-BY-WORKING ECOSYSTEM FOR STUDENTS
              </span>
            </div>

          <motion.h1
  className="mt-4 text-[1.75rem] font-medium leading-[1.12] tracking-tight text-white sm:text-[2.5rem] lg:text-[2.8rem]"
  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
  initial={{
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  }}
  animate={{
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  }}
  transition={{
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier
  }}
>
  Learn In-Demand Skills.
  <br />
  Work on Real Projects.
  <br />

  <motion.span
    className="relative inline-block text-emerald-400"
    animate={{
      y: [0, -2, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    Earn Before You Graduate.

    <motion.svg
      className="absolute -bottom-1.5 left-0 w-full"
      height="8"
      viewBox="0 0 300 10"
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M2 7C60 2 240 2 298 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.6,
          duration: 1,
          ease: "easeOut",
        }}
      />
    </motion.svg>
  </motion.span>
</motion.h1>

            <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-slate-300 sm:text-[14px] lg:text-[15px]">
              Mentor-led training, live client projects and stipend
              opportunities — powered by WeIntern.
            </p>

       <div className="mt-6 w-full max-w-[520px]">
  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
  {FEATURES.map((f, i) => (
    <motion.div
      key={i}
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.55,
        delay: i * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -2,
        scale: 1.02,
        transition: {
          duration: 0.25,
          ease: "easeOut",
        },
      }}
      className="group flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-2 text-[11px] font-medium text-slate-200 backdrop-blur-md transition-colors duration-300 hover:border-emerald-400/40 hover:bg-emerald-500/10 sm:gap-2 sm:px-3 sm:text-xs"
    >
      <motion.span
        className="shrink-0 text-emerald-400"
        whileHover={{
          rotate: 8,
          scale: 1.12,
        }}
        transition={{
          duration: 0.25,
        }}
      >
        {f.icon}
      </motion.span>

      <span className="whitespace-nowrap">
        {f.label}
      </span>
    </motion.div>
  ))}
</div>
</div>

            <div className="mt-6 flex w-full flex-wrap items-center gap-3">
              <motion.a
  href="#courses"
  onClick={(e) => {
    e.preventDefault();
    document
      .getElementById("courses")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
  whileHover={{
    scale: 1.03,
    y: -2,
  }}
  whileTap={{
    scale: 0.98,
  }}
  className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-[#081521] shadow-lg shadow-emerald-500/25 sm:w-auto sm:justify-start sm:px-6 sm:py-3.5 sm:text-base"
>
  {/* Continuous Shine */}
  <motion.div
    className="absolute inset-y-0 -left-24 w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
    animate={{
      x: [-120, 420],
    }}
    transition={{
      duration: 2.8,
      ease: "linear",
      repeat: Infinity,
      repeatDelay: 0.7,
    }}
  />

  {/* Glow */}
  <motion.div
    className="absolute inset-0 rounded-xl bg-white/5"
    animate={{
      opacity: [0.08, 0.18, 0.08],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  <span className="relative z-10">Explore Courses</span>

  <motion.span
    className="relative z-10"
    animate={{
      x: [0, 3, 0],
    }}
    transition={{
      duration: 1.6,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    →
  </motion.span>
</motion.a>
              <motion.a
  href="#contact"
  onClick={(e) => {
    e.preventDefault();
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="group relative inline-flex w-full overflow-hidden rounded-xl p-[1.5px] sm:w-auto"
>
  {/* Cyan Aurora Border */}
  <motion.div
    className="absolute inset-0 rounded-xl"
    style={{
      background: `
        conic-gradient(
          from 0deg,
          transparent 0deg,
          transparent 250deg,
          #E8A820 285deg,
          #ffd23f 305deg,
          #ffd23f 325deg,
          #ffd23f 345deg,
          transparent 360deg
        )
      `,
      filter: "blur(0.5px)",
    }}
    animate={{ rotate: 360 }}
    transition={{
      duration: 4,
      ease: "linear",
      repeat: Infinity,
    }}
  />

  {/* Button */}
  <div className="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-[#0B1220]/95 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:bg-[#10192B] sm:w-auto sm:justify-start sm:px-6 sm:py-3.5 sm:text-base">
    <span>Start Your Journey</span>

    <motion.span
      animate={{ x: [0, 3, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      →
    </motion.span>
  </div>
</motion.a>
            </div>
          </div>

          {/* Right — visual composition */}
          <motion.div
  className="relative mx-auto w-full max-w-md overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-1.5 shadow-2xl shadow-black/40 lg:max-w-none"
  animate={{
    y: [0, -8, 0],
    rotate: [0, 0.4, 0, -0.4, 0],
    scale: [1, 1.01, 1],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  <div className="relative overflow-hidden rounded-[1.15rem] bg-[#0B1220]">
    <img
      src={heroStudents}
      alt="WeIntern students working on live projects"
      className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[390px]"
      onError={(e) => {
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "flex";
      }}
    />

    <div className="hidden aspect-[4/5] w-full items-center justify-center bg-[#0B1220]">
      {/* Fallback */}
    </div>
  </div>

  {/* Logo Badge */}
  <motion.div
    className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur sm:px-4 sm:py-2"
    animate={{
      y: [0, -3, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <img
      src="/welogo.png"
      alt="WeIntern"
      className="h-4 brightness-0 invert sm:h-5"
    />
  </motion.div>
</motion.div>
        </div>
       <div className="relative mt-10 mx-auto w-full max-w-8xl overflow-hidden rounded-2xl border border-white/10 bg-white backdrop-blur-md shadow-lg sm:mt-16">


  <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-6 sm:grid-cols-3 lg:grid-cols-6 lg:px-4">
    {STATS.map((s, i) => (
      <div key={i} className="text-center lg:text-left">
        <div
          className={`text-xl font-semibold sm:text-2xl ${s.color}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {s.static ? (
            s.static
          ) : (
            <Counter
              target={s.target}
              prefix={s.prefix}
              suffix={s.suffix}
            />
          )}
        </div>

        {s.stars && (
          <div className="mt-0.5 text-[10px] text-amber-400">
            ★★★★★
          </div>
        )}

        <div className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          {s.label}
        </div>
      </div>
    ))}
  </div>
</div>
      </div>

      
    </section>
  );
};

export default Hero;
FILEEOF4

echo "[5/7] Writing frontend/src/components/Sections/Testimonials.jsx ..."
mkdir -p "frontend/src/components/Sections"
cat > "frontend/src/components/Sections/Testimonials.jsx" << 'FILEEOF5'
import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame, AnimatePresence } from "framer-motion";
import ContactSection from "./ContactFrom";

const TESTIMONIALS = [
  {
    initials: "AP",
    color: "#E8A820",
    name: "AYUSH PATEL",
    role: "WeIntern Intern",
    stars: 5,
    text: '"Currently interning here and it’s been a great experience so far! The work culture is super chill and welcoming, and you actually get to work on real-world projects instead of just basic tasks. Everyone is really supportive whenever you get stuck. Glad I joined! 🙌"',
  },
  {
    initials: "AG",
    color: "#E8A820",
    name: "Aastha Gade",
    role: "WeIntern Student",
    stars: 5,
    text: '"Very nice and innovative place, best for career support and best guidance for future goals and skills development."',
  },
  {
    initials: "PD",
    color: "#9B59B6",
    name: "Prabina Das",
    role: "WeIntern Student",
    stars: 5,
    text: '"Best Platform for internships."',
  },
  {
    initials: "RK",
    color: "#E67E22",
    name: "Ria Kim",
    role: "WeIntern Student",
    stars: 5,
    text: '"Great workplaces don\'t just assign tasks, every task was an opportunity to learn something new. Thank you for an unforgettable learning journey!"',
  },
  {
    initials: "YP",
    color: "#18B45B",
    name: "Yashshree Pimpalkar",
    role: "WeIntern Student",
    stars: 5,
    text: '"My experience at WeIntern has been great so far. I\'m learning new things, gaining practical experience and getting valuable exposure to a professional work environment."',
  },
  {
    initials: "AP",
    color: "#F39C12",
    name: "Atasi Pradhan",
    role: "WeIntern Student",
    stars: 5,
    text: '"Best place to start career 🚀. Good learning environment and supportive team 😇."',
  },
  {
    initials: "PS",
    color: "#ffd23f",
    name: "Priyankarani Sahu",
    role: "WeIntern Student",
    stars: 5,
    text: '"Great experience with WeIntern! The mentors are supportive, the learning environment is excellent, and I gained valuable practical skills. Highly recommended for students and freshers looking for quality internship opportunities."',
  },
  {
    initials: "AD",
    color: "#E74C3C",
    name: "Aachal Deshmukh",
    role: "WeIntern Student",
    stars: 5,
    text: '"Excellent tech company! Professional team, modern office, and great client service."',
  },
  {
    initials: "AS",
    color: "#8E44AD",
    name: "Amiya Samal",
    role: "WeIntern Student",
    stars: 5,
    text: '"A great place to learn and improve your skills. Highly recommended."',
  },
  {
    initials: "PS",
    color: "#16A085",
    name: "Pratham shorts",
    role: "WeIntern Student",
    stars: 5,
    text: "",
  },
  {
    initials: "MW",
    color: "#D35400",
    name: "Mangesh Wadichar",
    role: "WeIntern Student",
    stars: 5,
    text: "",
  },
];

const StarRating = ({ count }) => (
  <div className="flex shrink-0 items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <svg
        key={i}
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="#f59e0b"
        stroke="none"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const QuoteIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
  </svg>
);

// Frosted-glass testimonial card — needs the colored ambient blobs behind the
// marquee to actually read as glass, otherwise translucency has nothing to
// pick up.
const TestimonialCard = ({ t }) => (
  <div className="group relative w-[260px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#06131F]/85 p-4 shadow-xl shadow-slate-900/15 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-[#071A29]/90 hover:shadow-2xl hover:shadow-slate-900/20 sm:w-[340px] sm:p-6">
    {/* Subtle emerald glass glow */}
    <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-400/10 blur-3xl transition-all duration-300 group-hover:bg-emerald-400/20" />

    <div className="relative">
      <QuoteIcon className="h-5 w-5 text-emerald-300/80 sm:h-6 sm:w-6" />

      <p
        className="mt-2 text-[12px] leading-relaxed text-slate-200 sm:mt-3 sm:text-[14px]"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "72px",
        }}
      >
        {t.text}
      </p>

      <div className="mt-4 flex items-center gap-2.5 border-t border-white/10 pt-3 sm:mt-5 sm:gap-3 sm:pt-4">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-1 ring-white/20 sm:h-9 sm:w-9 sm:text-xs"
          style={{ background: t.color }}
        >
          {t.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-semibold text-white sm:text-sm">
            {t.name}
          </div>

          <div className="truncate text-[10px] text-emerald-300/80 sm:text-xs">
            {t.role}
          </div>
        </div>

        <StarRating count={t.stars} />
      </div>
    </div>
  </div>
);

// Continuous, seamless-loop marquee row. Duplicates its item set once so the
// track can wrap invisibly, and drives position with useAnimationFrame so it
// can be paused smoothly on hover instead of relying on a CSS keyframe reset.
const MarqueeRow = ({ items, speed = 34, direction = 1 }) => {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const [setWidth, setSetWidthState] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setSetWidthState(trackRef.current.scrollWidth / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (isPaused || !setWidth) return;
    let next = x.get() - (direction * speed * delta) / 1000;
    if (direction > 0 && next <= -setWidth) next += setWidth;
    if (direction < 0 && next >= 0) next -= setWidth;
    x.set(next);
  });

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-5">
        {[...items, ...items].map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
};

const Testimonials = () => {
  const [showPopup, setShowPopup] = useState(false);

  const items = TESTIMONIALS.filter((t) => t.text && t.text.trim().length > 0);
  const mid = Math.ceil(items.length / 2);
  const rowA = items.slice(0, mid);
  const rowB = items.slice(mid);

  const avatarStack = items.slice(0, 5);
  const featured = items[0];

  return (
    <>
      <section
        className="relative overflow-hidden bg-white pt-3 pb-14 sm:pt-6 sm:pb-24"
        id="testimonials"
      >
        {/* Ambient color blobs so the glass cards below have something to
            refract — kept soft enough not to fight the copy. */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-[8%] h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-[120px]" />
          <div className="absolute top-40 right-[6%] h-[280px] w-[280px] rounded-full bg-yellow-400/8 blur-[120px]" />
          <div className="absolute bottom-0 left-[35%] h-[260px] w-[260px] rounded-full bg-orange-400/7 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header — now starts from the left, copy unchanged */}
          <motion.div
  className="mx-auto max-w-3xl text-center"
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  {/* Eyebrow */}
  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/70 px-3.5 py-1.5 backdrop-blur-sm">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
    <span
      className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-[11px]"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      Real Stories
    </span>
  </div>

  {/* Heading */}
  <h2
    className="text-[20px] font-semibold leading-[1.12] tracking-[-0.035em] text-slate-900 sm:text-3xl md:text-4xl lg:text-[30px]"
    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
  >
    From Students{" "}
    <span className="relative inline-block text-emerald-600">
  Who Made the Leap
  <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-emerald-400/70" />
</span>
  </h2>

  {/* Description */}
  <p
    className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:mt-5 sm:text-base sm:leading-7"
    style={{ fontFamily: "'Inter', sans-serif" }}
  >
    Real experiences from students who turned learning into
    <span className="font-medium text-slate-700"> skills, opportunities, and results.</span>
  </p>
</motion.div>
        </div>

        {/* Marquee — full-bleed, edges fade so cards drift off naturally */}
        <motion.div
          className="relative mt-9 space-y-3 sm:mt-14 sm:space-y-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}

        >
          <MarqueeRow items={rowA} direction={1} speed={30} />
          <MarqueeRow items={rowB} direction={-1} speed={26} />
        </motion.div>

     {/* Compact CTA */}
<div className="relative mx-4 mt-16 w-auto max-w-5xl overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0B1D2E] px-4 py-5 backdrop-blur-xl sm:mx-auto sm:w-full sm:px-8 sm:py-8 lg:px-10">

  {/* Ambient glow */}
  <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/[0.08] blur-3xl" />
  <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/[0.05] blur-3xl" />

  <div className="relative flex flex-col items-center justify-between gap-4 text-center md:flex-row md:gap-6 md:text-left">

    {/* Content */}
    <motion.div
      className="max-w-xl"
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-1.5 inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-400 sm:mb-2 sm:gap-2 sm:text-[10px]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
        Start Building
      </div>

      <h3
        className="text-xl font-semibold leading-tight text-white sm:text-3xl"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Ready to turn internships into{" "}
        <span className="text-emerald-400">real experience?</span>
      </h3>

      <p className="mt-1.5 max-w-lg text-[11px] leading-relaxed text-slate-400 sm:mt-2 sm:text-sm">
        Build real projects, learn from mentors, and create a portfolio that
        gets noticed.
      </p>
    </motion.div>

    {/* Actions */}
    <motion.div
      className="flex shrink-0 flex-wrap justify-center gap-2.5 sm:gap-3"
      initial={{ opacity: 0, x: 15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      <motion.button
        onClick={() => setShowPopup(true)}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-[#06120d] shadow-lg shadow-emerald-500/15 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
      >
        {/* Minimal Shine */}
        <motion.span
          className="absolute inset-y-0 -left-16 w-6 -skew-x-12 bg-white/15 blur-[1px]"
          animate={{ x: [-60, 170] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />

        <span className="relative z-10">Join WeIntern</span>

        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </motion.button>

      <a
        href="#courses"
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-emerald-400/25 hover:bg-white/[0.08] hover:text-white sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
      >
        Explore Courses
      </a>
    </motion.div>
  </div>

  {/* Bottom accent */}
  <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
</div>
      </section>

      {/* POPUP — redesigned two-panel modal: glass promo panel + form */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-[1.75rem] bg-white shadow-2xl md:grid-cols-[0.85fr_1.15fr]"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                aria-label="Close"
                className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 md:text-white"
              >
                ×
              </button>

              {/* Left — glass promo panel, hidden on small screens */}
              <div
                className="relative hidden flex-col justify-between overflow-hidden p-8 text-white md:flex"
                style={{
                  background:
                    "linear-gradient(160deg, #081521 0%, #0B1D2E 45%, #0B3B34 100%)",
                }}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <div className="absolute -bottom-10 -left-10 h-[220px] w-[220px] rounded-full bg-emerald-400/20 blur-[90px]" />
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium tracking-wide text-emerald-200 backdrop-blur-md">
                    Let's get you started
                  </div>
                  <h4
                    className="mt-4 text-xl font-semibold leading-snug"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Join the ecosystem building real careers.
                  </h4>
                  <p className="mt-2 text-sm text-slate-300">
                    Tell us a bit about yourself and a mentor will reach out
                    to guide you through the next steps.
                  </p>
                </div>

                      <div className="mb-5 h-[2px] w-12 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.45)]" />

      {/* CARD 1 */}
      <div className="group relative mb-3 flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.055]">

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-lg text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.06)] transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/[0.12]">
          ✉
        </div>

        <div className="relative min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Email
          </span>

          <h3 className="mt-1 truncate text-[12px] font-medium text-slate-200 transition-colors duration-300 group-hover:text-white">
            support@weintern.in
          </h3>
        </div>

        <span className="relative ml-auto text-lg text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400">
          ↗
        </span>
      </div>

      {/* CARD 2 */}
      <div className="group relative mb-3 flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.055]">

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-lg text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.06)] transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/[0.12]">
          ☎
        </div>

        <div className="relative min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Phone
          </span>

          <h3 className="mt-1 truncate text-[12px] font-medium text-slate-200 transition-colors duration-300 group-hover:text-white">
            +91 7414974582
          </h3>
        </div>

        <span className="relative ml-auto text-lg text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400">
          ↗
        </span>
      </div>

      {/* CARD 3 */}
      <div className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.055]">

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-lg text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.06)] transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/[0.12]">
          📍
        </div>

        <div className="relative min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Location
          </span>

          <h3 className="mt-1 truncate text-[12px] font-medium text-slate-200 transition-colors duration-300 group-hover:text-white">
            Pune, Maharashtra, India
          </h3>
        </div>

        <span className="relative ml-auto text-lg text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400">
          ↗
        </span>
      </div>
              </div>

              {/* Right — the actual form */}
              <div className="max-h-[85vh] overflow-y-auto p-1 sm:p-2">
                <ContactSection />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Testimonials;
FILEEOF5

echo "[6/7] Writing frontend/src/context/CoursesContext.jsx ..."
mkdir -p "frontend/src/context"
cat > "frontend/src/context/CoursesContext.jsx" << 'FILEEOF6'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { client, QUERIES } from '../utils/sanityClient';
import { Icon } from '@iconify/react';
const STORAGE_KEY = 'weintern_courses_v4';

const DEFAULT_COURSES = [
  { id:1, icon:'mdi:web', title:'Full Stack Web Development', desc:'Build production-grade websites from scratch. HTML to React, Node.js to deployment — 4 real client projects included.', duration:'12 Weeks', level:'beginner', tools:['HTML/CSS','JavaScript','React','Node.js','MongoDB'], price:7999, originalPrice:9999, colors:{h1:'#e76f51',h2:'#f4a261'}, status:'active' },
  { id:2, icon:'mdi:cellphone', title:'Mobile App Development', desc:'Design and ship cross-platform apps. Learn Flutter and build apps that go live on the Play Store and App Store.', duration:'10 Weeks', level:'intermediate', tools:['Flutter','Dart','Firebase','REST APIs','Android/iOS'], price:12999, originalPrice:15999, colors:{h1:'#2a9d8f',h2:'#264653'}, status:'active' },
  { id:3, icon:'mdi:robot-outline', title:'AI & Automation', desc:'Master AI tools, LLMs, and workflow automation. Build chatbots, AI pipelines, and smart automations for real businesses.', duration:'8 Weeks', level:'intermediate', tools:['Python','OpenAI API','LangChain','n8n','Make'], price:7999, originalPrice:9999, colors:{h1:'#6c3483',h2:'#a569bd'}, status:'active' },
  { id:4, icon:'mdi:cloud-cog-outline', title:'Cloud Solutions & DevOps', desc:'Learn cloud infrastructure, containerization, CI/CD pipelines, and deploy scalable systems.', duration:'10 Weeks', level:'intermediate', tools:['AWS','Docker','Kubernetes','CI/CD','Linux'], price:12999, originalPrice:15999, colors:{h1:'#E8A820',h2:'#ffd23f'}, status:'active' },
  { id:5, icon:'mdi:palette-outline', title:'UI/UX Design', desc:'From wireframes to pixel-perfect interfaces. Learn design thinking, user research, and prototyping.', duration:'8 Weeks', level:'beginner', tools:['Figma','Adobe XD','Prototyping','User Research','Design Systems'], price:3999, colors:{h1:'#c0392b',h2:'#e74c3c'}, status:'active' },
  { id:6, icon:'mdi:bullhorn-outline', title:'Digital Marketing', desc:'Master SEO, social media, paid ads, email campaigns, and content strategy. Run real campaigns.', duration:'6 Weeks', level:'beginner', tools:['Google Ads','Meta Ads','SEO','Canva','Analytics'], price:2999, colors:{h1:'#e67e22',h2:'#f39c12'}, status:'active' },
  { id:7, icon:'mdi:chart-bar', title:'Data Science & Analytics', desc:'Turn raw data into business decisions. Data cleaning, visualization, machine learning, and pipelines.', duration:'12 Weeks', level:'intermediate', tools:['Python','Pandas','Scikit-learn','Tableau','SQL'], price:7999, originalPrice:9999, colors:{h1:'#1e8449',h2:'#27ae60'}, status:'active' },
  {
  id:8,
  icon:'mdi:video-outline',
  title:'Video Editing & Content Creation',
  desc:'Master professional video editing, motion graphics, reels creation, and content production for social media platforms.',
  duration:'8 Weeks',
  level:'beginner',
  tools:['Premiere Pro','After Effects','CapCut','Color Grading','Content Strategy'],
  price:4499,
  colors:{h1:'#be185d',h2:'#ec4899'},
  status:'active'
},

{
  id:9,
  icon:'mdi:cloud-outline',
  title:'Cloud Computing',
  desc:'Master cloud platforms, deployment strategies, virtual machines, storage, and scalable infrastructure.',
  duration:'12 Weeks',
  level:'intermediate',
  tools:['AWS','Azure','Docker','Linux','Cloud Deployment'],
  price:6499,
  colors:{h1:'#E8A820',h2:'#ffd23f'},
  status:'active'
},

{
  id:10,
  icon:'mdi:cog-transfer-outline',
  title:'DevOps Engineering',
  desc:'Build CI/CD pipelines, automate deployments, monitor applications, and manage scalable infrastructure.',
  duration:'10 Weeks',
  level:'advanced',
  tools:['Jenkins','Docker','Kubernetes','Terraform','GitHub Actions'],
  price:6999,
  colors:{h1:'#334155',h2:'#64748b'},
  status:'active'
},

{
  id:11,
  icon:'mdi:language-python',
  title:'Python Programming',
  desc:'Master Python from basics to advanced. Build automation scripts, data analysis tools, web applications, and AI projects.',
  duration:'10 Weeks',
  level:'beginner',
  tools:['Python Basics','OOP','Data Structures','Libraries','Project Development'],
  price:3999,
  originalPrice:5999,
  colors:{h1:'#4c1d95',h2:'#7c3aed'},
  status:'active'
},

{
  id:12,
  icon:'mdi:language-java',
  title:'Java Programming',
  desc:'Learn Java fundamentals, object-oriented programming, Spring framework, and build enterprise-level applications.',
  duration:'12 Weeks',
  level:'beginner',
  tools:['Java Basics','OOP','Spring Boot','MySQL','REST APIs'],
  price:3999,
  colors:{h1:'#166534',h2:'#22c55e'},
  status:'active'
},

{
  id:13,
  icon:'mdi:language-cpp',
  title:'C/C++ Programming',
  desc:'Master C and C++ for system programming, data structures, algorithms, and high-performance applications.',
  duration:'10 Weeks',
  level:'beginner',
  tools:['C Basics','C++ OOP','Data Structures','Algorithms','Memory Management'],
  price:3999,
  originalPrice:5999,
  colors:{h1:'#E8A820',h2:'#ffd23f'},
  status:'active'
},
];

const CoursesContext = createContext(null);

const normTools = (t) => {
  if (Array.isArray(t)) return t.map(x => x.trim()).filter(Boolean);
  if (typeof t === 'string') return t.split(',').map(x => x.trim()).filter(Boolean);
  return [];
};

export const CoursesProvider = ({ children }) => {
const [courses, setCourses] = useState(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {

        // Merge new default courses with old localStorage courses
        const mergedCourses = [...parsed];

        DEFAULT_COURSES.forEach((defaultCourse) => {
          const exists = parsed.some(
            (course) => course.title === defaultCourse.title
          );

          if (!exists) {
            mergedCourses.push(defaultCourse);
          }
        });

        return mergedCourses;
      }
    }
  } catch (error) {
    console.error('Course storage parse error:', error);
  }

  return DEFAULT_COURSES;
});

  // Try fetching from Sanity on mount — merge with local
  useEffect(() => {
    client && client.fetch(QUERIES.courses)
      .then(sanityCourses => { if (!sanityCourses) return;
        if (!sanityCourses || sanityCourses.length === 0) return;
        // Convert Sanity format to our format
        const converted = sanityCourses.map(c => ({
          id: c._id,
          icon: c.icon || 'mdi:school-outline',
          title: c.title,
          desc: c.description || c.tagline || '',
          tagline: c.tagline || '',
          about: c.about || '',
          duration: c.duration || '',
          level: c.level || 'beginner',
          tools: normTools(c.tools),
          price: c.price || 0,
          colors: { h1: c.colorH1 || '#1B2A4A', h2: c.colorH2 || '#243659' },
          language: c.language || 'English + Hindi',
          status: 'active',
          fromSanity: true,
        }));
        // Merge: Sanity courses replace matching local ones, add new ones
        setCourses(prev => {
          const localOnly = prev.filter(lc =>
            !converted.find(sc => sc.title === lc.title) && !lc.fromSanity
          );
          return [...localOnly, ...converted];
        });
      })
      .catch(() => {}); // Silently fail - use local data
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { const u = JSON.parse(e.newValue); if (Array.isArray(u)) setCourses(u); } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const COLOR_PRESETS = [
    {h1:'#e76f51',h2:'#f4a261'},{h1:'#2a9d8f',h2:'#264653'},
    {h1:'#6c3483',h2:'#a569bd'},{h1:'#E8A820',h2:'#ffd23f'},
    {h1:'#c0392b',h2:'#e74c3c'},{h1:'#e67e22',h2:'#f39c12'},
    {h1:'#1e8449',h2:'#27ae60'},{h1:'#2c3e50',h2:'#ffd23f'},
  ];

  const addCourse = (form, colorIdx = 0) => {
    const c = { id:Date.now(), icon:form.icon||'mdi:school-outline', title:form.title, desc:form.desc||form.tagline||form.about||'', tagline:form.tagline||'', about:form.about||'', duration:form.duration, level:form.level||'beginner', tools:normTools(form.tools), price:Number(form.price), colors:COLOR_PRESETS[colorIdx]||COLOR_PRESETS[0], language:form.language||'English + Hindi', status:'active' };
    setCourses(prev => { const u=[...prev,c]; localStorage.setItem(STORAGE_KEY,JSON.stringify(u)); return u; });
    return c;
  };

  const updateCourse = (id, form, colorIdx) => {
    setCourses(prev => {
      const u = prev.map(c => c.id===id ? { ...c, icon:form.icon||c.icon, title:form.title||c.title, desc:form.desc||form.tagline||c.desc, tagline:form.tagline||c.tagline, about:form.about||c.about, duration:form.duration||c.duration, level:form.level||c.level, tools:normTools(form.tools).length?normTools(form.tools):c.tools, price:Number(form.price)||c.price, colors:colorIdx!==undefined?COLOR_PRESETS[colorIdx]:c.colors, language:form.language||c.language } : c);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); return u;
    });
  };

  const deleteCourse = (id) => {
    setCourses(prev => { const u=prev.filter(c=>c.id!==id); localStorage.setItem(STORAGE_KEY,JSON.stringify(u)); return u; });
  };

  const toggleStatus = (id) => {
    setCourses(prev => { const u=prev.map(c=>c.id===id?{...c,status:c.status==='active'?'inactive':'active'}:c); localStorage.setItem(STORAGE_KEY,JSON.stringify(u)); return u; });
  };

  return (
    <CoursesContext.Provider value={{ courses, activeCourses:courses.filter(c=>c.status==='active'), addCourse, updateCourse, deleteCourse, toggleStatus, COLOR_PRESETS }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error('useCourses must be used within CoursesProvider');
  return ctx;
};
FILEEOF6

echo "[7/7] Writing frontend/src/styles/global.css ..."
mkdir -p "frontend/src/styles"
cat > "frontend/src/styles/global.css" << 'FILEEOF7'
/* ===========================
   WEINTERN v4 React – Global CSS
=========================== */
:root {
  --navy:    #1B2A4A;
  --navy2:   #243659;
  --navy3:   #0f1d33;
  --gold:    #E8A820;
  --gold2:   #f5c842;
  --gold3:   rgba(232,168,32,.13);
  --cyan:    #E8A820;
  --cyan2:   #ffd23f;
  --cyan3:   rgba(232,168,32,.13);
  --cream:   #f4f6fb;
  --white:   #ffffff;
  --text:    #1a2640;
  --muted:   #5a6a82;
  --border:  rgba(27,42,74,.1);
  --sh:      0 4px 24px rgba(27,42,74,.09);
  --shlg:    0 16px 48px rgba(27,42,74,.15);
  --shgold:  0 8px 32px rgba(232,168,32,.3);
  --shcyan:  0 8px 32px rgba(232,168,32,.3);
  --r:       16px;
  --rsm:     8px;
  --ease:    .3s cubic-bezier(.4,0,.2,1);
}

/* ============ RESET ============ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { overflow-x: hidden; font-family: 'Poppins', sans-serif; }
*:focus { outline: none !important; box-shadow: none !important; }
*:focus-visible { outline: 2px solid var(--cyan) !important; outline-offset: 2px !important; }
input:focus-visible, textarea:focus-visible, select:focus-visible, button:focus-visible, a:focus-visible {
  outline: 2px solid var(--cyan) !important;
  outline-offset: 2px !important;
}
.container { max-width: 1160px; margin: 0 auto; padding: 0 1.5rem; }

/* ============ POPPINS FOR ALL NUMBERS ============ */
* {
  font-variant-numeric: tabular-nums;
  font-family: 'Poppins', sans-serif;
}

/* Import Poppins for numbers */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Apply Poppins to all elements that contain numbers */
body, input, textarea, select, button, 
.cs-offer-new-price, .cs-offer-old-price, .enroll-price,
.enroll-offer-price, .enroll-original-price,
.cs-card-price, .stat-value, .hero-stat-value,
.price, .amount, .count, .number {
  font-feature-settings: 'tnum', 'lnum';
}

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: .85rem 1.8rem; border-radius: 50px; font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: .97rem; text-decoration: none; cursor: pointer;
  border: none; transition: var(--ease); white-space: nowrap; position: relative;
  overflow: hidden; line-height: 1.5; background: none;
}
.btn::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,.15); opacity: 0; transition: var(--ease); }
.btn:hover::after { opacity: 1; }
.btn-primary { background: var(--gold); color: var(--navy); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shgold); }
.btn-outline { background: transparent; color: var(--cyan); border: 2px solid var(--cyan); }
.btn-outline:hover { background: var(--cyan); color: white; transform: translateY(-2px); box-shadow: var(--shcyan); }
.btn-white { background: white; color: var(--navy); }
.btn-white:hover { background: var(--navy); color: white; transform: translateY(-2px); }
.btn-lg { padding: 1.05rem 2.4rem; font-size: 1.02rem; font-weight: 700; }
.btn-full { width: 100%; border-radius: var(--rsm); }
.btn-glow { animation: pulseGlow 3s ease infinite; }
.btn-danger { background: #dc4545; color: white; }
.btn-danger:hover { background: #c03333; transform: translateY(-2px); }
.btn-success { background: #27ae60; color: white; }
.btn-success:hover { background: #1e8449; transform: translateY(-2px); }

@keyframes pulseGlow {
  0%,100% { box-shadow: var(--shgold); }
  50% { box-shadow: 0 0 0 8px rgba(232,168,32,.15), var(--shgold); }
}

.section-label {
  font-family: 'Space Mono', monospace; font-size: .72rem; letter-spacing: .14em;
  text-transform: uppercase; color: var(--gold); margin-bottom: .75rem; display: block;
}
.section-label.light { color: var(--gold2); }
.section-title {
  font-family: 'Poppins', sans-serif; font-size: clamp(2rem,4vw,3rem);
  font-weight: 700; line-height: 1.15; color: var(--navy); margin-bottom: 1rem;
}
.section-title.light { color: white; }
.section-sub { color: var(--muted); font-size: 1.05rem; max-width: 580px; margin-bottom: 3rem; }

/* REVEAL */
.reveal { opacity: 1;  transition: opacity .65s ease, transform .65s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* ============ FORM SHARED ============ */
.the-form {
  background: var(--cream); border-radius: var(--r); padding: 2.5rem;
  max-width: 820px; box-shadow: var(--sh); margin: 0 auto;
}
.the-form-alt { background: white; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: .4rem; margin-bottom: 1.25rem; }
.form-group:last-of-type { margin-bottom: 0; }
.form-group label { font-weight: 600; font-size: .84rem; color: var(--navy); }
.form-group input, .form-group select, .form-group textarea {
  padding: .78rem 1rem; border: 1.5px solid var(--border); border-radius: var(--rsm);
  font-family: 'DM Sans', sans-serif; font-size: .92rem; color: var(--text);
  background: white; transition: border-color var(--ease), box-shadow var(--ease); width: 100%;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none; border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(232,168,32,.12);
}
.form-group textarea { resize: vertical; }
.form-note { text-align: center; margin-top: 1.5rem; font-size: .9rem; color: var(--muted); font-weight: 500; }

/* Check group */
.check-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; margin-top: 1rem; }
.check-item {
  display: flex; align-items: center; justify-content: center; gap: .6rem;
  padding: 1rem; border: 1.5px solid var(--border); border-radius: 40px;
  font-size: .9rem; font-weight: 500; background: white; cursor: pointer;
  transition: all .3s ease; text-align: center; min-height: 60px;
}
.check-item:hover { border-color: var(--cyan); color: var(--cyan); }
.check-item input { accent-color: var(--cyan); flex-shrink: 0; width: 18px; height: 18px; }
.check-item span { color: var(--text); white-space: nowrap; }

/* Apply btn group */
.apply-btn-group {
  display: flex; gap: 15px; width: 100%; justify-content: center;
  align-items: center; flex-wrap: wrap; margin-top: 1.5rem;
}
.apply-btn-group .btn {
  flex: 1 1 calc(50% - 7.5px); min-width: 160px; max-width: 280px;
}
.whatsapp-btn {
  width: 100%; max-width: 280px; display: flex; align-items: center; justify-content: center;
  background: #25D366; color: white; text-align: center; padding: 1rem 1.8rem;
  border-radius: 50px; font-weight: 600; text-decoration: none; transition: .3s;
  font-size: 1.02rem; margin-top: 12px; border: none; cursor: pointer; height: auto;
  line-height: 1.5;
}
.whatsapp-btn:hover { background: #1ebe5d; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,211,102,.3); }

/* ============ MODAL ============ */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.6);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal-box {
  background: white; padding: 2.5rem; width: 100%; max-width: 480px;
  border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,.2);
  animation: popup .3s ease; max-height: 85vh; overflow-y: auto;
}
@keyframes popup {
  from { transform: scale(.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.modal-box h3 { margin-bottom: 1.5rem; text-align: center; font-family: 'Playfair Display', serif; color: var(--navy); }
.modal-close {
  position: absolute; top: 1rem; right: 1rem; background: none; border: none;
  font-size: 1.4rem; cursor: pointer; color: var(--muted); line-height: 1;
}

/* ============ WA FLOAT ============ */
.wa-float {
  position: fixed; bottom: 1.75rem; right: 1.75rem; z-index: 999;
  background: #25D366; width: 54px; height: 54px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,.4); transition: var(--ease);
}
.wa-float:hover { transform: scale(1.1); box-shadow: 0 8px 28px rgba(37,211,102,.55); }

/* ============ MARQUEE ============ */
.marquee-strip { background: var(--navy); padding: .75rem 0; overflow: hidden; border-top: 1px solid rgba(255,255,255,.06); border-bottom: 1px solid rgba(255,255,255,.06); }
.marquee-track { display: flex; gap: 3rem; animation: marquee 28s linear infinite; width: max-content; }
.marquee-track span { font-family: 'Space Mono', monospace; font-size: .72rem; color: rgba(255,255,255,.6); white-space: nowrap; letter-spacing: .06em; }
.marquee-track span:nth-child(odd) { color: var(--gold); }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ============ BADGE / TAGS ============ */
.badge-status {
  display: inline-flex; align-items: center; padding: .22rem .7rem;
  border-radius: 50px; font-size: .7rem; font-weight: 700; letter-spacing: .04em;
}
.badge-pending { background: rgba(232,168,32,.15); color: var(--gold); }
.badge-reviewing { background: rgba(232,168,32,.15); color: var(--cyan); }
.badge-accepted { background: rgba(39,174,96,.15); color: #27ae60; }
.badge-rejected { background: rgba(220,69,69,.15); color: #dc4545; }
.badge-paid { background: rgba(39,174,96,.15); color: #27ae60; }
.badge-enrolled { background: rgba(232,168,32,.15); color: var(--cyan); }

/* ============ TOAST ============ */
.toast-custom { font-family: 'DM Sans', sans-serif !important; }

/* ============ RESPONSIVE ============ */
@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
  .check-group { grid-template-columns: 1fr; }
  .the-form, .the-form-alt { padding: 1.5rem; }
}
@media (max-width: 420px) {
  .apply-btn-group { flex-direction: column; align-items: stretch; }
  .apply-btn-group .btn { max-width: 100%; }
}
FILEEOF7

echo ""
echo "Done. cd frontend && npm start -- check the course cards on the homepage."
echo ""
echo "To deploy:"
echo "   git add ."
echo "   git commit -m \"style: redesign course cards (colorful tech icons, cycling colors, Join Now link)\""
echo "   git push origin main"
