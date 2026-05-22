import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Hero.css';

const FEARS = [
  '"Will I be job-ready when I graduate?"',
  '"Companies want experienced candidates…"',
  '"I have a degree but no real projects."',
  '"Nobody gives freshers a chance."'
];
const STATS = [
  { target: 200, label: 'Interns' },
  { target: 50, label: 'Live Projects' },
  { target: 30, label: 'Businesses' },
  { target: 10000, label: 'Hours Logged' }
];

// Floating particles background
const ParticleBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    while (container.firstChild) container.removeChild(container.firstChild);

    const PARTICLES = [
      { color: 'rgba(232,168,32,0.7)',  minSize: 3, maxSize: 6,  count: 14 },
      { color: 'rgba(33,150,201,0.6)',  minSize: 2, maxSize: 5,  count: 12 },
      { color: 'rgba(255,255,255,0.25)',minSize: 1, maxSize: 3,  count: 10 },
      { color: 'rgba(232,168,32,0.35)', minSize: 6, maxSize: 10, count: 5  },
    ];

    PARTICLES.forEach(({ color, minSize, maxSize, count }) => {
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        const size = minSize + Math.random() * (maxSize - minSize);
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 8;
        const xMove = (Math.random() - 0.5) * 80;
        const yMove = -(40 + Math.random() * 80);

        Object.assign(p.style, {
          position: 'absolute',
          width: size + 'px',
          height: size + 'px',
          borderRadius: '50%',
          background: color,
          boxShadow: size > 5 ? `0 0 ${size * 3}px ${color}` : 'none',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animation: `heroParticleFloat ${duration}s ease-in-out ${delay}s infinite`,
          '--xMove': xMove + 'px',
          '--yMove': yMove + 'px',
          pointerEvents: 'none',
        });
        container.appendChild(p);
      }
    });

    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        const dur = 2000, start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          setCount(Math.floor(easeOut(p) * target));
          if (p < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref} className="hstat-n">{count.toLocaleString()}</span>;
};

const Hero = () => {
  const [fearIdx, setFearIdx] = useState(0);
  const { user } = useAuth();
  useEffect(() => {
    const t = setInterval(() => setFearIdx(i => (i + 1) % FEARS.length), 3200);
    return () => clearInterval(t);
  }, []);
  const scrollToCourses = () => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <ParticleBackground />
        <div className="hero-orb orb-1" /><div className="hero-orb orb-2" />
        <div className="hero-orb orb-3" /><div className="hero-grid" />
      </div>
      <div className="hero-inner">
        <div className="hero-content animate-up">
          <div className="hero-badge"><span className="badge-dot" />🌱 A New Era of Learning</div>
          <h1 className="hero-title">
            Students Don't<br />Wait for Opportunity.<br />
            <span className="highlight">They Build It.</span>
          </h1>
          <p className="hero-sub">WeIntern hires students into real teams, working on real client projects — earning real experience, real income, and real confidence.</p>
          <div className="hero-fear">
            <div className="fear-label">Every student fears:</div>
            <div className="fear-rotate">
              {FEARS.map((f, i) => (
                <span key={i} className={`fear-item${i === fearIdx ? ' active' : ''}`}>{f}</span>
              ))}
            </div>
            <div className="fear-resolve">✓ At WeIntern, you're already working in the industry.</div>
          </div>
          <div className="hero-btns">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-primary btn-lg btn-glow">
                  {user.role === 'admin' ? '⚙️ Admin Panel →' : '👤 My Dashboard →'}
                </Link>
                <button onClick={scrollToCourses} className="btn btn-outline btn-lg">Enroll in a Course →</button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg btn-glow">Get Started Free →</Link>
                <Link to="/login" className="btn btn-outline btn-lg">Login →</Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="hstat-div" />}
                <div className="hstat"><Counter target={s.target} /><sup>+</sup><div>{s.label}</div></div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="hero-visual animate-up-delay">
          <div className="float-card fc-1">
            <div className="fc-icon" style={{ background: '#E8A820' }}>🌐</div>
            <div className="fc-text"><strong>Aman M.</strong><span>Live Project Delivered</span></div>
            <div className="fc-check">✓</div>
          </div>
          <div className="float-card fc-2">
            <div className="fc-icon" style={{ background: '#2196C9' }}>📱</div>
            <div className="fc-text"><strong>Priya S.</strong><span>Earning Stipend</span></div>
            <div className="fc-check">✓</div>
          </div>
          <div className="float-card fc-3">
            <div className="fc-icon" style={{ background: '#1B2A4A' }}>🤖</div>
            <div className="fc-text"><strong>Rahul K.</strong><span>4 Projects Done</span></div>
            <div className="fc-check">✓</div>
          </div>
          <div className="hero-center-card">
            <div className="hcc-logo"><img src="/welogo.png" alt="WeIntern" style={{ height: 48, width: 'auto' }} /></div>
            <div className="hcc-title">Your Journey Starts Here</div>
            <div className="hcc-steps">
              {['Apply','Learn','Earn','Grow'].map((s, i) => (
                <React.Fragment key={s}>
                  {i > 0 && <div className="hcc-arrow">→</div>}
                  <div className={`hcc-step${i === 0 ? ' active-step' : ''}`}>{s}</div>
                </React.Fragment>
              ))}
            </div>
            <div className="hcc-ring ring-1" /><div className="hcc-ring ring-2" />
          </div>
        </div>
      </div>
      <div className="scroll-hint">
        <div className="scroll-mouse"><div className="scroll-dot" /></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

export default Hero;
