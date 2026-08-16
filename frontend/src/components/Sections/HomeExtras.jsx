import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "./HomeExtras.css";

/* ── Placement Partners strip ─────────────────────────── */
const PARTNERS = ["Deloitte", "Radical", "CodePlateau", "BMC", "Pradisys", "WeNexa"];

export const PartnersStrip = () => (
  <section className="hx-partners">
    <div className="hx-partners-inner">
      <span className="hx-partners-label">Our Placement<br />Partners</span>
      <div className="hx-partners-logos">
        {PARTNERS.map((p) => <span key={p} className="hx-partner-name">{p}</span>)}
      </div>
    </div>
  </section>
);

/* ── Why Choose WeIntern ──────────────────────────────── */
const WHY = [
  { icon: "mdi:rocket-launch-outline", title: "Skill-First Learning", desc: "Industry-focused training designed for real-world impact.", bg: "#14192e" },
  { icon: "mdi:briefcase-outline", title: "Real Internships", desc: "Work on live projects and gain hands-on experience.", bg: "#E8A820" },
  { icon: "mdi:account-group-outline", title: "Mentorship", desc: "Learn from industry experts who guide your journey.", bg: "#3db8f0" },
  { icon: "mdi:chart-line", title: "Career Boost", desc: "Resume building, interview prep & 100% placement support.", bg: "#14192e" },
];

export const WhyChoose = () => (
  <section className="hx-why">
    <span className="hx-eyebrow">— Why Choose —</span>
    <h2 className="hx-title">
      Why Choose <span className="hx-title-navy">We</span><span className="hx-title-cyan">Intern</span>?
    </h2>
    <p className="hx-sub">We don't just teach. We transform.</p>
    <div className="hx-why-grid">
      {WHY.map((w) => (
        <div className="hx-why-card" key={w.title}>
          <div className="hx-why-icon" style={{ background: w.bg }}>
            <Icon icon={w.icon} width={24} height={24} color="#fff" />
          </div>
          <h4>{w.title}</h4>
          <p>{w.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ── Testimonials carousel (2 visible) ────────────────── */
const TESTIMONIALS = [
  { name: "Ananya", role: "Data Science Intern", photo: "https://i.pravatar.cc/120?img=32", quote: "WeIntern gave me the skills and confidence to grab my dream internship. The mentors are amazing!" },
  { name: "Rohit", role: "Full Stack Developer", photo: "https://i.pravatar.cc/120?img=51", quote: "The hands-on projects and real-world exposure made all the difference." },
  { name: "Priya", role: "UI/UX Design Intern", photo: "https://i.pravatar.cc/120?img=45", quote: "From learning Figma to shipping real designs — this program changed my career path." },
  { name: "Karan", role: "Digital Marketing Intern", photo: "https://i.pravatar.cc/120?img=13", quote: "Practical, mentor-led, and genuinely career-focused. Best decision I made this year." },
];

export const HomeTestimonials = () => {
  const [start, setStart] = useState(0);
  const visible = [TESTIMONIALS[start % TESTIMONIALS.length], TESTIMONIALS[(start + 1) % TESTIMONIALS.length]];

  const prev = () => setStart((s) => (s - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setStart((s) => (s + 1) % TESTIMONIALS.length);

  return (
    <section className="hx-testimonials">
      <div className="hx-testi-inner">
        <div className="hx-testi-head">
          <h2>What Our <span className="hx-title-gold">Students</span> Say</h2>
          <div className="hx-testi-arrows">
            <button onClick={prev} aria-label="Previous"><Icon icon="mdi:chevron-left" width={20} height={20} /></button>
            <button onClick={next} aria-label="Next"><Icon icon="mdi:chevron-right" width={20} height={20} /></button>
          </div>
        </div>
        <div className="hx-testi-grid">
          {visible.map((t, i) => (
            <div className="hx-testi-card" key={t.name + i}>
              <img src={t.photo} alt={t.name} className="hx-testi-photo" />
              <div>
                <p className="hx-testi-quote">"{t.quote}"</p>
                <p className="hx-testi-name">— {t.name}, {t.role}</p>
                <div className="hx-testi-stars">
                  {Array.from({ length: 5 }).map((_, s) => <Icon key={s} icon="mdi:star" width={14} height={14} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Newsletter CTA ────────────────────────────────────── */
export const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };
  return (
    <section className="hx-newsletter">
      <div className="hx-newsletter-inner">
        <div>
          <h3>Ready to kickstart your journey?</h3>
          <p>Join thousands of learners and build your future with WeIntern.</p>
        </div>
        <form className="hx-newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email" required placeholder="Enter your email"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Get Started <Icon icon="lucide:arrow-right" width={14} height={14} /></button>
        </form>
      </div>
    </section>
  );
};
