// ===== Problem Section =====

import React, { useState, useEffect, useRef } from 'react';
import useReveal from '../../hooks/useReveal';
import './Sections.css';

import ai_chatbot from "../../assets/ai_chatbot.jpg";
import analytics from "../../assets/analytics.jpg";
import ecommerce from "../../assets/ecommerce.jpg";
import edtech from "../../assets/edtech.jpg";
import fleet_monitoring from "../../assets/fleet_monitoring.jpg";
import healthcare from "../../assets/healthcare.jpg";
import platform from "../../assets/platform.jpg";
import food_delivery from "../../assets/food_delivery.jpg";
import job_portal from "../../assets/job_portal.jpg";
import travel_booking from "../../assets/travel_booking.jpg";

export const Problem = () => {
  const q1 = useReveal(); const q2 = useReveal(); const q3 = useReveal(); const q4 = useReveal();
  return (
    <section className="problem" id="story">
      <div className="container">
        <div className="section-label">The Reality</div>
        <h2 className="section-title">The Gap No One Talks About</h2>
        <div className="gap-visual">
          <div className="gap-side gap-student reveal" ref={q1}>
            <div className="gap-icon">🎓</div>
            <h3>Students Graduate With</h3>
            <ul>
              {['Certificates & degrees','Completed courses','Good grades'].map(i => <li key={i} className="good">✓ {i}</li>)}
              {['Real client experience','Deadline pressure skills','Team collaboration','Confidence to execute'].map(i => <li key={i} className="bad">✗ {i}</li>)}
            </ul>
          </div>
          <div className="gap-bridge reveal" ref={q2}>
            <div className="gap-chasm"><div className="chasm-label">THE GAP</div><div className="chasm-sub">Frustration.<br />Self-doubt.<br />Missed chances.</div></div>
            <div className="bridge-connector"><div className="bc-line" /><div className="bc-badge">WeIntern</div><div className="bc-line" /></div>
          </div>
          <div className="gap-side gap-industry reveal" ref={q3}>
            <div className="gap-icon">🏢</div>
            <h3>Industry Demands</h3>
            <ul>
              {['Real project execution','Deadline management','Team collaboration','Problem solving','Communication skills','Industry tools'].map(i => <li key={i} className="good">✓ {i}</li>)}
              <li className="bad">✗ "No freshers please"</li>
            </ul>
          </div>
        </div>
        <div className="problem-quote reveal" ref={q4}>
          <blockquote>"They graduate with theory.<br />Industry demands execution."</blockquote>
        </div>
      </div>
    </section>
  );
};

// ===== HowItWorks =====
export const HowItWorks = () => {
  const [tab, setTab] = React.useState('students');
  const STEPS = [
    { num:'01', icon:'📝', title:'Apply & Get Selected', desc:'No prior experience needed. Just passion and the willingness to grow. Submit your application and our team reviews within 3–5 days.' },
    { num:'02', icon:'👥', title:'Join a Real Team', desc:'Become part of a supervised intern team working on actual client projects — web dev, apps, AI, cloud, and more.' },
    { num:'03', icon:'💰', title:'Earn While You Learn', desc:'Receive a stipend for your real contributions. Not just a certificate — actual income while you build real skills.' },
    { num:'04', icon:'🚀', title:'Build Your Portfolio', desc:'Leave with 4–6 live projects, verified industry experience, and the confidence to own any interview room.' }
  ];
  const BIZ = [
    { num:'01', icon:'💡', title:'Share Your Requirements', desc:'Tell us what you need. We assess scope, timeline, and match your project to the right intern team.' },
    { num:'02', icon:'👥', title:'Get a Supervised Team', desc:'Passionate interns supervised by expert mentors. Quality guaranteed, deadlines respected.' },
    { num:'03', icon:'🚀', title:'Receive Quality Output', desc:'High-quality, tested, delivered products — cost-effective without compromising standards.' },
    { num:'04', icon:'🔄', title:'Continuous Support', desc:'Post-delivery support included. Long-term partnership, not just a one-time delivery.' }
  ];
  // const ECO_NODES = ['Students','Businesses','Experience','Income','Growth','Partners'];

  // return (
  //   <section className="how" id="how" id="how">
  //     <div className="container">
  //       <div className="section-label">The Solution</div>
  //       <h2 className="section-title">How WeIntern Works</h2>
  //       <p className="section-sub">A sustainable ecosystem where everyone wins.</p>
  //       <div className="audience-tabs">
  //         {[['students','👨‍💻 For Students'],['businesses','🏢 For Businesses'],['partners','🤝 For Partners']].map(([k,l]) => (
  //           <button key={k} className={`tab-btn${tab===k?' active':''}`} onClick={() => setTab(k)}>{l}</button>
  //         ))}
  //       </div>
  //       {tab === 'students' && (
  //         <div>
  //           <div className="steps">
  //             {STEPS.map((s,i) => (
  //               <React.Fragment key={s.num}>
  //                 {i > 0 && <div className="step-connector"><div className="sc-arrow">→</div></div>}
  //                 <div className="step reveal">
  //                   <div className="step-num">{s.num}</div>
  //                   <div className="step-icon">{s.icon}</div>
  //                   <h4>{s.title}</h4>
  //                   <p>{s.desc}</p>
  //                 </div>
  //               </React.Fragment>
  //             ))}
  //           </div>
  //           <div className="transformation reveal">
  //             <div className="tf-before">
  //               <span className="tf-label tf-label-before">Before WeIntern</span>
  //               {['"I have completed a course."','"I am looking for experience."','"I hope someone gives me a chance."'].map(t => <div key={t} className="tf-item">{t}</div>)}
  //             </div>
  //             <div className="tf-arrow"><div className="tf-arrow-line" /><div className="tf-arrow-head">→</div></div>
  //             <div className="tf-after">
  //               <span className="tf-label tf-label-after">After WeIntern</span>
  //               {['"I built 4 live projects for real clients."','"I have verified industry experience."','"I create my own opportunities."'].map(t => <div key={t} className="tf-item tf-item-good">{t}</div>)}
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //       {tab === 'businesses' && (
  //         <div>
  //           <div className="biz-grid">
  //             {BIZ.map(b => (
  //               <div key={b.num} className="biz-card reveal">
  //                 <div className="biz-num">{b.num}</div>
  //                 <div className="biz-icon">{b.icon}</div>
  //                 <h4>{b.title}</h4>
  //                 <p>{b.desc}</p>
  //               </div>
  //             ))}
  //           </div>
  //           <div className="biz-why reveal">
  //             <h3>Why Businesses Choose WeIntern</h3>
  //             <div className="why-grid">
  //               {['Cost-effective supervised development','Energetic, passionate teams','Modern tech stack expertise','Transparent communication','You\'re also helping a student\'s career','Continuous post-delivery support'].map(w => (
  //                 <div key={w} className="why-item"><span className="why-icon">✓</span>{w}</div>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //       {tab === 'partners' && (
  //         <div className="partner-layout">
  //           <div className="partner-text reveal">
  //             <h3>Invest in the Future of Work</h3>
  //             <p>WeIntern is more than a company — it's a movement. As a partner or investor, you become part of building a generation of professionals who are confident, capable, and career-ready from day one.</p>
  //             <p>We're creating a scalable ecosystem where education meets real industry, and the gap between college and career simply doesn't exist.</p>
  //             <a href="#contact" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Connect With Us →</a>
  //           </div>
  //           <div className="ecosystem reveal">
  //             <div className="eco-center">WeIntern</div>
  //             <div className="eco-orbit">
  //               {ECO_NODES.map((n, i) => (
  //                 <div key={n} className="eco-node" style={{ '--deg': `${i * 60}deg` }}>{n}</div>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </section>
  // );
};

// ===== EcosystemSection =====
export const EcosystemSection = () => {

  const STEP_ICONS = [
    // 1. Learn — open book
    <svg viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 10C24 10 14 7 8 10v26c6-3 16 0 16 0s10-3 16 0V10c-6-3-16 0-16 0z"/>
      <line x1="24" y1="10" x2="24" y2="36"/>
    </svg>,
    // 2. Build — code brackets
    <svg viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18,14 8,24 18,34"/>
      <polyline points="30,14 40,24 30,34"/>
      <line x1="28" y1="12" x2="20" y2="36"/>
    </svg>,
    // 3. Get Assigned — briefcase
    <svg viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="18" width="32" height="22" rx="3"/>
      <path d="M16 18v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4"/>
      <line x1="8" y1="28" x2="40" y2="28"/>
    </svg>,
    // 4. Work & Grow — two people / team
    <svg viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="16" r="5"/>
      <path d="M6 38c0-6.627 5.373-12 12-12"/>
      <circle cx="32" cy="14" r="4"/>
      <path d="M28 38c0-5.523 3.582-10 8-10"/>
      <path d="M18 26c3.5 0 6.5 1.5 8.5 4"/>
    </svg>,
    // 5. Earn — rupee coin
    <svg viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="16"/>
      <path d="M18 17h12M18 23h12M22 23l-4 8"/>
      <path d="M18 17c0 0 8 0 8 6s-8 6-8 6"/>
    </svg>,
  ];

  const STEP_COLORS = [
    { bg: '#22c55e', border: '#16a34a' },   // green  — Learn
    { bg: '#3b82f6', border: '#2563eb' },   // blue   — Build
    { bg: '#8b5cf6', border: '#7c3aed' },   // purple — Get Assigned
    { bg: '#f97316', border: '#ea580c' },   // orange — Work & Grow
    { bg: '#ec4899', border: '#db2777' },   // pink   — Earn
  ];

  const STEP_LABELS = [
    { num: 1, title: 'Learn',        desc: 'Learn in-demand skills with expert mentors' },
    { num: 2, title: 'Build',        desc: 'Build real projects and create your portfolio' },
    { num: 3, title: 'Get Assigned', desc: 'Get assigned to live projects from WeNexa (our IT arm)' },
    { num: 4, title: 'Work & Grow',  desc: 'Work under mentor supervision and improve your industry skills' },
    { num: 5, title: 'Earn',         desc: 'Earn stipend and become financially independent while you learn' },
  ];

  return (
    <section className="eco-wrapper" id="ecosystem">

      {/* ── TOP: Step Flow + Mission ── */}
      <div className="eco-heading-block">
        <h2 className="eco-title">
          How the <span className="eco-title-brand">Weintern</span> Ecosystem Works
        </h2>
        <p className="eco-subtitle">From learning to earning — a journey that changes your future.</p>
      </div>

      {/* Steps + Mission side by side */}
      <div className="eco-top-body">
        {/* Steps */}
        <div className="eco-steps">
          {STEP_LABELS.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="eco-step-card">
                <div className="eco-step-circle" style={{ background: STEP_COLORS[i].bg, borderColor: STEP_COLORS[i].border }}>
                  {STEP_ICONS[i]}
                </div>
                <div>
                  <span className="eco-step-label">{s.num}. {s.title} </span>
                  <span className="eco-step-desc">{s.desc}</span>
                </div>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className="eco-step-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="13,6 19,12 13,18"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mission box */}
        <div className="eco-mission">
          <h4 className="eco-mission-head">Our Mission</h4>
          <p className="eco-mission-body">
            To empower every student with practical skills, real experience and financial independence through meaningful work.
          </p>
          <div className="eco-mission-brands">
            <span className="eco-mb-wi">Weintern</span>
            <span className="eco-mb-inf">∞</span>
            <span className="eco-mb-wn"><span className="eco-mb-we">We</span>Nexa</span>
          </div>
          <p className="eco-mission-tag">Stronger Together</p>
        </div>
      </div>

      {/* ── BOTTOM: Dark Impact Banner ── */}
      <div className="eco-bottom">
        <div className="eco-bottom-inner">

          {/* Left: heading */}
          <div className="eco-b-left">
            <h2 className="eco-b-heading">
              Real Work. Real Impact.<br />
              <span className="eco-b-green">Real Income</span> for Students.
            </h2>
            <p className="eco-b-sub">We believe students deserve to earn for the value they create.</p>
          </div>

          {/* Donut */}
          <div className="eco-donut">
            <svg viewBox="0 0 120 120" className="eco-donut-svg">
              <defs>
                <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
              {/* Track */}
              <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="16" />
              {/* 75% arc: circumference = 2π×46 ≈ 289, 75% = 217 */}
              <circle cx="60" cy="60" r="46" fill="none" stroke="url(#dg)" strokeWidth="16"
                strokeDasharray="217 72" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="eco-donut-center">
              <span className="eco-donut-pct">75%</span>
              <span className="eco-donut-lbl">OF PROJECT VALUE<br />GOES TO<br />STUDENTS</span>
            </div>
          </div>

          {/* 4 benefit columns */}
          <div className="eco-b-benefits">

            {/* Financial Independence — purse/wallet with clasp */}
            <div className="eco-b-card">
              <div className="eco-b-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 16c0-3 2-5 5-5h10c3 0 5 2 5 5v12c0 2-1.5 4-4 4H14c-2.5 0-4-2-4-4V16z"/>
                  <path d="M15 11c0-2 1-4 5-4s5 2 5 4"/>
                  <path d="M10 21h20"/>
                  <circle cx="20" cy="25" r="2" fill="currentColor" stroke="none"/>
                </svg>
              </div>
              <h4 className="eco-b-title">Financial<br/>Independence</h4>
              <p className="eco-b-desc">Students earn real income through their skills and hard work.</p>
            </div>

            {/* Industry Experience — briefcase with bar chart */}
            <div className="eco-b-card">
              <div className="eco-b-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="15" width="28" height="19" rx="2"/>
                  <path d="M14 15v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/>
                  <line x1="13" y1="34" x2="13" y2="27"/>
                  <line x1="20" y1="34" x2="20" y2="24"/>
                  <line x1="27" y1="34" x2="27" y2="29"/>
                </svg>
              </div>
              <h4 className="eco-b-title">Industry<br/>Experience</h4>
              <p className="eco-b-desc">Work on real projects and gain experience before graduation.</p>
            </div>

            {/* Career Growth — upward trending line */}
            <div className="eco-b-card">
              <div className="eco-b-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="5,32 14,21 21,26 30,13 36,8"/>
                  <polyline points="30,8 36,8 36,14"/>
                </svg>
              </div>
              <h4 className="eco-b-title">Career<br/>Growth</h4>
              <p className="eco-b-desc">Build confidence, strong portfolio and better career opportunities.</p>
            </div>

            {/* Better Future — two people silhouettes */}
            <div className="eco-b-card">
              <div className="eco-b-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="14" cy="13" r="4.5"/>
                  <path d="M4 33c0-5.523 4.477-10 10-10"/>
                  <path d="M14 23c5.523 0 10 4.477 10 10"/>
                  <circle cx="28" cy="11" r="3.5"/>
                  <path d="M24 33c0-4.418 1.79-8 4-8"/>
                  <path d="M28 25c2.21 0 4 3.582 4 8"/>
                </svg>
              </div>
              <h4 className="eco-b-title">Better<br/>Future</h4>
              <p className="eco-b-desc">Empowered students create a stronger and better India.</p>
            </div>

          </div>
        </div>

        {/* Bottom note */}
        <div className="eco-b-note">
          <span>🔒</span>
          When you learn with Weintern, you don't just get a course – you get opportunities that pay.
        </div>
      </div>

    </section>
  );
};

// student project

export const Testimonials = () => {
const projectData = [
  { id: 1,  image: ecommerce,       title: "E-Commerce Website",       subtitle: "Built for Retail Brand",     tech: ["React", "Node.js", "MongoDB"] },
  { id: 2,  image: ai_chatbot,      title: "AI Chatbot Automation",    subtitle: "Built for SaaS Company",     tech: ["Python", "OpenAI", "FastAPI"] },
  { id: 3,  image: fleet_monitoring,title: "Fintech Dashboard",        subtitle: "Built for Fintech Startup",  tech: ["React", "Node.js", "Chart.js"] },
  { id: 4,  image: platform,        title: "Real Estate Platform",     subtitle: "Built for Real Estate Firm", tech: ["Next.js", "MongoDB", "Stripe"] },
  { id: 5,  image: edtech,          title: "EdTech Platform",          subtitle: "Built for Online Learning",  tech: ["Next.js", "Tailwind", "Prisma"] },
  { id: 6,  image: healthcare,      title: "Healthcare App",           subtitle: "Built for Clinic Network",   tech: ["React", "Firebase", "Stripe"] },
  { id: 7,  image: analytics,       title: "Analytics Dashboard",      subtitle: "Built for Marketing Agency", tech: ["Vue", "D3.js", "Node.js"] },
  { id: 8,  image: food_delivery,   title: "Food Delivery App",        subtitle: "Built for Restaurant Chain", tech: ["React", "Node.js", "MongoDB"] },
  { id: 9,  image: job_portal,      title: "Job Portal Website",       subtitle: "Built for Hiring Platform",  tech: ["Next.js", "Firebase", "Tailwind"] },
  { id: 10, image: travel_booking,  title: "Travel Booking Platform",  subtitle: "Built for Travel Agency",    tech: ["React", "Express", "Stripe"] },
];

const VISIBLE = 5;
const GAP = 14;

const ProjectCard = ({ image, title, subtitle, tech }) => (
  <div className="project-card">
    <div className="project-image-wrapper">
      <img src={image} alt={title} className="project-image" />
    </div>
    <div className="project-content">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <div className="tech-stack">
        {tech.map((item, i) => <span key={i}>{item}</span>)}
      </div>
    </div>
  </div>
);

const StudentProjectsSection = () => {
  const [start, setStart] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const trackRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const updateCardWidth = () => {
      if (trackRef.current) {
        const totalWidth = trackRef.current.offsetWidth;
        const width = (totalWidth - GAP * (VISIBLE - 1)) / VISIBLE;
        setCardWidth(width);
      }
    };
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, [showAll]);

  return (
    <section className="student-projects-section">
      <div className="container">

        <div className="section-header">
          <div />
          <div className="section-content">
            <h2>Real Projects Done by Our <span>Student Teams</span></h2>
            <p>Real clients. Real problems. Real impact.</p>
          </div>
          <button
            className="view-more-btn"
            onClick={() => { setShowAll(s => !s); setStart(0); }}
          >
            {showAll ? "← Show Less" : "View More Projects →"}
          </button>
        </div>

        {!showAll ? (
          <div className="projects-slider">
            <button
              className="slider-btn"
              onClick={() => setStart(s => Math.max(0, s - 1))}
              disabled={start === 0}
            >‹</button>

            <div className="projects-track-wrapper" ref={trackRef}>
              <div
                className="projects-track"
                style={{
                  transform: `translateX(-${start * (cardWidth + GAP)}px)`,
                  gap: `${GAP}px`,
                }}
              >
                {projectData.map(p => (
                  <div
                    key={p.id}
                    style={{ minWidth: cardWidth > 0 ? `${cardWidth}px` : `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
                  >
                    <ProjectCard {...p} />
                  </div>
                ))}
              </div>
            </div>

            <button
              className="slider-btn"
              onClick={() => setStart(s => Math.min(projectData.length - VISIBLE, s + 1))}
              disabled={start + VISIBLE >= projectData.length}
            >›</button>
          </div>
        ) : (
          <div className="projects-grid-all">
            {projectData.map(p => <ProjectCard key={p.id} {...p} />)}
          </div>
        )}

      </div>
    </section>
  );
};

};
// ===== Vision =====
export const Vision = () => {
  React.useEffect(() => {
    const container = document.getElementById('visionParticles');
    if (!container) return;
    // Clear existing
    while (container.firstChild) container.removeChild(container.firstChild);

    const CONFIGS = [
      { color: 'rgba(232,168,32,0.55)', minSize: 3, maxSize: 6 },
      { color: 'rgba(33,150,201,0.45)',  minSize: 2, maxSize: 5 },
      { color: 'rgba(255,255,255,0.15)', minSize: 1, maxSize: 3 },
    ];

    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      const cfg = CONFIGS[Math.floor(Math.random() * CONFIGS.length)];
      const size = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize);
      const duration = 6 + Math.random() * 9;
      const delay = Math.random() * 5;
      const xMove = (Math.random() - 0.5) * 50;
      const yMove = -(20 + Math.random() * 50);

      Object.assign(p.style, {
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: cfg.color,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animation: `visionParticleAnim ${duration}s ease-in-out ${delay}s infinite`,
        '--vx': xMove + 'px',
        '--vy': yMove + 'px',
        pointerEvents: 'none',
      });
      container.appendChild(p);
    }

    if (!document.getElementById('vision-particle-style')) {
      const style = document.createElement('style');
      style.id = 'vision-particle-style';
      style.textContent = `
        @keyframes visionParticleAnim {
          0%   { transform: translate(0,0) scale(1);   opacity: 0; }
          15%  { opacity: 1; }
          50%  { transform: translate(var(--vx), var(--vy)) scale(1.4); opacity: 0.9; }
          85%  { opacity: 0.3; }
          100% { transform: translate(calc(var(--vx)*1.8), calc(var(--vy)*1.8)) scale(0.6); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  // return (
  //   <section className="vision" id="vision" id="vision">
  //     <style>{`@keyframes particleFloat{0%,100%{transform:translateY(0px) scale(1);opacity:.4}50%{transform:translateY(-30px) scale(1.2);opacity:.8}}`}</style>
  //     <div className="vision-particles" id="visionParticles" />
  //     <div className="container">
  //       <div className="vision-inner">
  //         <div className="vision-left reveal">
  //           <span className="section-label light">Our Vision</span>
  //           <h2 className="section-title light">Building a Generation<br />That's Ready.</h2>
  //           <p className="vision-p">To create a generation of professionals who are not afraid of interviews, not confused about skills, and not dependent only on degrees.</p>
  //           <div className="vision-flow">
  //             {[['📚','Learning'],['💼','Experience'],['💰','Income'],['🚀','Future']].map(([e,l],i) => (
  //               <React.Fragment key={l}>
  //                 {i>0 && <div className="vf-arr">→</div>}
  //                 <div className="vf-item">{e} <span>{l}</span></div>
  //               </React.Fragment>
  //             ))}
  //           </div>
  //         </div>
  //         <div className="vision-right reveal">
  //           <div className="founder-card">
  //             <div className="founder-glow" />
  //             <div className="founder-top">
  //               <div className="founder-av">AW</div>
  //               <div className="founder-meta"><strong>Ashwin</strong><span>Founder, WeIntern</span></div>
  //             </div>
  //             <blockquote className="founder-q">"I started WeIntern because I saw talented students being rejected — not for lack of skill, but lack of opportunity. We're changing that, one intern at a time."</blockquote>
  //             <div className="founder-links">
  //               <a href="#" className="flink">LinkedIn ↗</a>
  //               <a href="#" className="flink">Instagram ↗</a>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );
};
