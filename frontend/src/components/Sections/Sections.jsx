// ===== Problem Section =====
import React from 'react';
import useReveal from '../../hooks/useReveal';
import './Sections.css';

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
  const ECO_NODES = ['Students','Businesses','Experience','Income','Growth','Partners'];

  return (
    <section className="how" id="how">
      <div className="container">
        <div className="section-label">The Solution</div>
        <h2 className="section-title">How WeIntern Works</h2>
        <p className="section-sub">A sustainable ecosystem where everyone wins.</p>
        <div className="audience-tabs">
          {[['students','👨‍💻 For Students'],['businesses','🏢 For Businesses'],['partners','🤝 For Partners']].map(([k,l]) => (
            <button key={k} className={`tab-btn${tab===k?' active':''}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
        {tab === 'students' && (
          <div>
            <div className="steps">
              {STEPS.map((s,i) => (
                <React.Fragment key={s.num}>
                  {i > 0 && <div className="step-connector"><div className="sc-arrow">→</div></div>}
                  <div className="step reveal">
                    <div className="step-num">{s.num}</div>
                    <div className="step-icon">{s.icon}</div>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="transformation reveal">
              <div className="tf-before">
                <span className="tf-label tf-label-before">Before WeIntern</span>
                {['"I have completed a course."','"I am looking for experience."','"I hope someone gives me a chance."'].map(t => <div key={t} className="tf-item">{t}</div>)}
              </div>
              <div className="tf-arrow"><div className="tf-arrow-line" /><div className="tf-arrow-head">→</div></div>
              <div className="tf-after">
                <span className="tf-label tf-label-after">After WeIntern</span>
                {['"I built 4 live projects for real clients."','"I have verified industry experience."','"I create my own opportunities."'].map(t => <div key={t} className="tf-item tf-item-good">{t}</div>)}
              </div>
            </div>
          </div>
        )}
        {tab === 'businesses' && (
          <div>
            <div className="biz-grid">
              {BIZ.map(b => (
                <div key={b.num} className="biz-card reveal">
                  <div className="biz-num">{b.num}</div>
                  <div className="biz-icon">{b.icon}</div>
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
            <div className="biz-why reveal">
              <h3>Why Businesses Choose WeIntern</h3>
              <div className="why-grid">
                {['Cost-effective supervised development','Energetic, passionate teams','Modern tech stack expertise','Transparent communication','You\'re also helping a student\'s career','Continuous post-delivery support'].map(w => (
                  <div key={w} className="why-item"><span className="why-icon">✓</span>{w}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 'partners' && (
          <div className="partner-layout">
            <div className="partner-text reveal">
              <h3>Invest in the Future of Work</h3>
              <p>WeIntern is more than a company — it's a movement. As a partner or investor, you become part of building a generation of professionals who are confident, capable, and career-ready from day one.</p>
              <p>We're creating a scalable ecosystem where education meets real industry, and the gap between college and career simply doesn't exist.</p>
              <a href="#contact" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Connect With Us →</a>
            </div>
            <div className="ecosystem reveal">
              <div className="eco-center">WeIntern</div>
              <div className="eco-orbit">
                {ECO_NODES.map((n, i) => (
                  <div key={n} className="eco-node" style={{ '--deg': `${i * 60}deg` }}>{n}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ===== Services =====
export const Services = () => {
  const SERVICES = [
    { icon:'🌐', title:'Website Development', desc:'From landing pages to full-stack web apps. React, Next.js, Node.js, and more.', tags:['React','Next.js','Node.js','MongoDB'] },
    { icon:'📱', title:'App Development', desc:'Native and cross-platform mobile apps that solve real problems with beautiful UX.', tags:['Flutter','React Native','iOS','Android'] },
    { icon:'🤖', title:'AI & Automation', desc:'Smart chatbots, workflow automation, AI dashboards, and ML integrations.', tags:['Python','LangChain','OpenAI','n8n'] },
    { icon:'☁️', title:'Cloud Solutions', desc:'Cloud infrastructure, deployment pipelines, scalable architecture.', tags:['AWS','GCP','Docker','CI/CD'] },
    { icon:'💎', title:'Digital Products', desc:'SaaS platforms, admin dashboards, CRMs, and custom digital tools.', tags:['SaaS','Dashboard','CRM','API'] }
  ];
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-label">What We Build</div>
        <h2 className="section-title">Services WeIntern Delivers</h2>
        <p className="section-sub">Real client projects across modern technology domains — built by passionate intern teams, supervised by experts.</p>
        <div className="services-grid">
          {SERVICES.map(s => (
            <div key={s.title} className="service-card reveal">
              <div className="sc-glow" />
              <span className="service-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="service-tags">{s.tags.map(t => <span key={t}>{t}</span>)}</div>
            </div>
          ))}
          <div className="service-card service-card-cta reveal">
            <div className="sc-cta-content">
              <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>💬</div>
              <h3>Have a project in mind?</h3>
              <p>Let's build something great together.</p>
              <a href="#hire" className="btn btn-primary" style={{ marginTop:'1.25rem' }}>Get a Free Quote →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ===== Testimonials =====
export const Testimonials = () => {
  const TESTI = [
    { init:'AK', name:'Arjun Kumar', role:'Web Dev Intern → Junior Dev at TechCorp', color:'var(--gold)', quote:'Before WeIntern, I had 12 certificates and zero real projects. Six months later, I had delivered 3 live client websites and received my first salary-based job offer. The difference is night and day.' },
    { init:'SM', name:'Sneha Mishra', role:'AI Intern → Data Science Analyst', color:'var(--cyan)', quote:'I was terrified of interviews because I had nothing to show. At WeIntern, I worked on a real AI chatbot for a client. That single project got me through 4 interview rounds. I couldn\'t believe it.' },
    { init:'RP', name:'Rohit Patil', role:'App Intern → Freelancer (₹80k/month)', color:'#e67e22', quote:'The stipend was a bonus, but the experience was priceless. I learned more in 3 months at WeIntern than 2 years of college. Real mentorship, real deadlines, real clients.' },
];
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-label">Real Stories</div>
        <h2 className="section-title">From Students Who Made the Leap</h2>
        <p className="section-sub">These aren't just success stories — they're proof that the model works.</p>
        <div className="testi-grid">
          {TESTI.map(t => (
            <div key={t.name} className={`testi-card reveal${t.isBiz?' testi-biz':''}`}>
              {t.isBiz && <span className="testi-biz-label">🏢 Business Testimonial</span>}
              <div className="testi-top">
                <div className="testi-avatar" style={{ background: t.color }}>{t.init}</div>
                <div><strong>{t.name}</strong><span>{t.role}</span></div>
                <div className="testi-stars">★★★★★</div>
              </div>
              <p>"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
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
  return (
    <section className="vision" id="vision">
      <style>{`@keyframes particleFloat{0%,100%{transform:translateY(0px) scale(1);opacity:.4}50%{transform:translateY(-30px) scale(1.2);opacity:.8}}`}</style>
      <div className="vision-particles" id="visionParticles" />
      <div className="container">
        <div className="vision-inner">
          <div className="vision-left reveal">
            <span className="section-label light">Our Vision</span>
            <h2 className="section-title light">Building a Generation<br />That's Ready.</h2>
            <p className="vision-p">To create a generation of professionals who are not afraid of interviews, not confused about skills, and not dependent only on degrees.</p>
            <div className="vision-flow">
              {[['📚','Learning'],['💼','Experience'],['💰','Income'],['🚀','Future']].map(([e,l],i) => (
                <React.Fragment key={l}>
                  {i>0 && <div className="vf-arr">→</div>}
                  <div className="vf-item">{e} <span>{l}</span></div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="vision-right reveal">
            <div className="founder-card">
              <div className="founder-glow" />
              <div className="founder-top">
                <div className="founder-av">AW</div>
                <div className="founder-meta"><strong>Ashwin</strong><span>Founder, WeIntern</span></div>
              </div>
              <blockquote className="founder-q">"I started WeIntern because I saw talented students being rejected — not for lack of skill, but lack of opportunity. We're changing that, one intern at a time."</blockquote>
              <div className="founder-links">
                <a href="#" className="flink">LinkedIn ↗</a>
                <a href="#" className="flink">Instagram ↗</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
