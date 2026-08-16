#!/bin/bash
set -e

# ============================================================
# WeIntern - Redesign course cards to match compact reference
# Removes: category badge, offer-price box, checklist bullets,
# feature pills. Keeps: Enroll Now (real payment flow), Join
# Now link, tabs, carousel, all responsive breakpoints.
# Run from your project ROOT:
#   cd ~/path/to/WeInternFr
#   bash redesign-course-cards-v2.sh
# ============================================================

SRC="frontend/src"

if [ ! -f "$SRC/components/Sections/Courses.jsx" ]; then
  echo "Cannot find $SRC/components/Sections/Courses.jsx -- run this from your project root."
  exit 1
fi

echo "[1/2] Writing components/Sections/Courses.jsx ..."
cat > "$SRC/components/Sections/Courses.jsx" << 'FILEEOF1'
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
        <div className="cs-header-row">
          <div>
            <h2 className="cs-main-title">
              Popular <span className="cs-title-accent">Programs</span>
            </h2>
            <p className="cs-sub">Upskill with Job-Ready Programs &amp; Career-Driven Certifications.</p>
          </div>
          <button
            className="cs-view-all"
            onClick={() => window.scrollTo({ top: document.getElementById('courses')?.offsetTop - 80, behavior: 'smooth' })}
          >
            View All Programs <Icon icon="lucide:arrow-right" width={14} height={14} />
          </button>
        </div>
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

              return (
                <div
                  key={c.id || c.title}
                  className="cs-card"
                  onClick={() => navigate(`/courses/${slugify(c.title)}`)}
                >
                  {/* Compact icon zone: cycling navy/blue-gray/gold background + tech badges */}
                  <div className="cs-card-icon-zone">
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

echo "[2/2] Writing components/Sections/Courses.css ..."
cat > "$SRC/components/Sections/Courses.css" << 'FILEEOF2'
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
  height: 92px;
  padding: 0.9rem;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(150deg, #1c2444, #0e1428);
}

/* (wave bottom-edge removed for the clean flat-card redesign) */

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
  padding: 0.9rem 0.9rem 0.2rem;
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

  /* Compact icon zone on mobile too */
  .cs-card-icon-zone {
    height: 100px;
    padding: 1rem;
  }

  .cs-tech-badge {
    width: 34px;
    height: 34px;
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

/* Cycle icon-zone + enroll-button background: navy / soft blue-gray / gold / navy ... */
.cs-card:nth-child(4n+2) .cs-card-icon-zone,
.cs-card:nth-child(4n+2) .cs-enroll {
  background: linear-gradient(150deg, #7d97ad, #4b6478) !important;
}
.cs-card:nth-child(4n+3) .cs-card-icon-zone,
.cs-card:nth-child(4n+3) .cs-enroll {
  background: linear-gradient(150deg, #ffd23f, #E8A820) !important;
}
.cs-card:nth-child(4n+3) .cs-join-now { color: #b8860b; }
.cs-card:nth-child(4n+1) .cs-card-icon-zone,
.cs-card:nth-child(4n) .cs-card-icon-zone,
.cs-card:nth-child(4n+1) .cs-enroll,
.cs-card:nth-child(4n) .cs-enroll {
  background: linear-gradient(150deg, #1c2444, #0e1428) !important;
}

.cs-header-row {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
}
.cs-view-all {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; cursor: pointer;
  color: #E8A820; font-weight: 700; font-size: .88rem;
  white-space: nowrap; padding-bottom: 4px;
}
.cs-view-all:hover { opacity: .8; }
@media (max-width: 640px) {
  .cs-header-row { flex-direction: column; align-items: flex-start; }
}
FILEEOF2

echo ""
echo "Done. cd frontend && npm start -- check the Courses section (tabs + carousel)."
echo "Cards now cycle navy / blue-gray / gold / navy, with tech-icon badges and"
echo "a Join Now link, matching your reference. Enroll Now (payment) still works."
echo ""
echo "To deploy:"
echo "   git add ."
echo "   git commit -m \"style: simplify course cards to match compact reference design\""
echo "   git push origin main"
