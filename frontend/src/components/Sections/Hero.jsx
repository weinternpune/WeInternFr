import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import heroStudents from "../../assets/hero-students.jpg/WhatsApp Image 2026-05-23 at 09.41.02.jpeg";
import './Hero.css';

const HeroParticles = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    while (container.firstChild) container.removeChild(container.firstChild);
    const PARTICLES = [
      { color: 'rgba(24,180,91,0.6)',   minSize: 3, maxSize: 6,  count: 14 },
      { color: 'rgba(255,255,255,0.2)', minSize: 1, maxSize: 3,  count: 12 },
      { color: 'rgba(24,180,91,0.25)',  minSize: 6, maxSize: 10, count: 5  },
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
          position: 'absolute', width: size + 'px', height: size + 'px',
          borderRadius: '50%', background: color,
          boxShadow: size > 5 ? `0 0 ${size * 3}px ${color}` : 'none',
          left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
          animation: `heroParticleFloat ${duration}s ease-in-out ${delay}s infinite`,
          '--xMove': xMove + 'px', '--yMove': yMove + 'px', pointerEvents: 'none',
        });
        container.appendChild(p);
      }
    });
    return () => { while (container.firstChild) container.removeChild(container.firstChild); };
  }, []);
  return <div ref={containerRef} style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }} />;
};

const Counter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(target * ease));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Hero = () => {
  const { user } = useAuth();
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />
        <div className="hero-grid" />
        <HeroParticles />
      </div>
      <div className="hero-inner">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="badge-dot" />
            India's #1 Learn-by-Working Ecosystem for Students
          </div>
          <h1 className="hero-title">
            Learn In-Demand Skills.<br />
            Work on Real Projects.<br />
            <span className="highlight">Earn Before You Graduate.</span>
          </h1>
          <p className="hero-sub">
            Mentor-led training, live client projects and stipend opportunities — powered by WeIntern.
          </p>
          <div className="hero-features">
            {[
              { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label:'Mentor Guided' },
              { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, label:'Live Client Projects' },
              { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label:'Stipend Opportunities' },
              { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, label:'Real Portfolio' },
              { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, label:'Career Growth' },
            ].map((f,i) => (
              <div key={i} className="hf-item">
                <span className="hf-icon">{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
          {/* Desktop buttons — hidden on mobile */}
          <div className="hero-btns hero-btns-desktop">
            <a href="#courses" className="btn-hero-primary" onClick={e=>{e.preventDefault();document.getElementById('courses')?.scrollIntoView({behavior:'smooth'})}}>Explore Courses →</a>
            <a href="#contact" className="btn-hero-outline" onClick={e=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}}>Start Your Journey →</a>
          </div>
        </div>

        {/* CENTER — Big Image */}
        <div className="hero-center">
          <div className="hero-img-box">
            <img src="/hero-students.jpg" alt="WeIntern Students" className="hero-main-img" onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/>
            <div className="hero-img-fallback" style={{display:'none'}}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(24,180,91,0.5)" strokeWidth="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <p>Place hero-students.jpg in /public/</p>
            </div>
            {/* Logo badge */}
            <div className="hero-logo-badge">
              <img src="/welogo.png" alt="WeIntern" style={{height:24,filter:'brightness(0) invert(1)'}}/>
            </div>
          </div>
        </div>

        {/* RIGHT — Stats */}
        <div className="hero-stats-side">
          {[
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, val:'12,500+', label:'Students Trained' },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, val:'920+', label:'Live Projects Delivered' },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, val:'₹4.5 Cr+', label:'Paid to Students in Stipends' },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>, val:'200+', label:'College Partners' },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, val:'4.8/5', label:'Student Rating' },
          ].map((s,i) => (
            <div key={i} className="hss-item">
              <div className="hss-icon">{s.icon}</div>
              <div>
                <strong>{s.val}</strong>
                <span>{s.label}</span>
                {s.val === '4.8/5' && <div className="hss-stars">★★★★★</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-only buttons — shown below image on mobile */}
        <div className="hero-btns hero-btns-mobile">
          <a href="#courses" className="btn-hero-primary" onClick={e=>{e.preventDefault();document.getElementById('courses')?.scrollIntoView({behavior:'smooth'})}}>Explore Courses →</a>
          <a href="#contact" className="btn-hero-outline" onClick={e=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}}>Start Your Journey →</a>
        </div>
      </div>
      

      <div className="hero-stats-bar">
        <div className="hsb-inner">
          {[
            {val:'₹4.5 Cr+', label:'Paid to Students in Stipends', color:'#18b45b'},
            {val:'75%', label:'of Project Value Goes to Students', color:'#18b45b'},
            {val:'920+', label:'Live Projects Completed', color:'#2563eb'},
            {val:'12,500+', label:'Students Impacted', color:'#7c3aed'},
            {val:'200+', label:'College Partners', color:'#7c3aed'},
            {val:'4.8/5', label:'Student Rating', color:'#f59e0b', stars:true},
          ].map((s,i)=>(
            <div key={i} className="hsb-item">
              <div className="hsb-val" style={{color:s.color}}>{s.val}</div>
              <div className="hsb-label">{s.label}</div>
              {s.stars && <div className="hsb-stars">★★★★★</div>}
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
};

export default Hero;
