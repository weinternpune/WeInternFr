import React from "react";
import { Icon } from "@iconify/react";
import heroStudents from "../../assets/hero-students.jpg/hero-students.png";
import "./Hero.css";
import PartnersMarquee from "./PartnersMarquee";

const TRUST_AVATARS = [
  "https://i.pravatar.cc/64?img=12",
  "https://i.pravatar.cc/64?img=32",
  "https://i.pravatar.cc/64?img=45",
  "https://i.pravatar.cc/64?img=25",
];

const STATS = [
  { val: "15+", label: "Programs" },
  { val: "500+", label: "Internships" },
  { val: "100+", label: "Expert Mentors" },
  { val: "95%", label: "Placement Support" },
];

const Hero = () => {
  return (
    <section className="hero2">
      <div className="hero2-inner">
        <div className="hero2-left">
          <div className="hero2-badge">Learn. Intern. Grow.</div>
          <h1 className="hero2-title">
            Your Skills.<br />
            Your <span className="hero2-accent-gold">Internship.</span><br />
            Your <span className="hero2-accent-cyan">Future.</span>
          </h1>
          <p className="hero2-sub">
            WeIntern is the Gen Z platform to learn in-demand skills, gain real-world experience and launch your dream career.
          </p>
          <div className="hero2-btns">
            <button className="hero2-btn-primary" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Programs <Icon icon="lucide:arrow-right" width={16} height={16} />
            </button>
            <button className="hero2-btn-outline">
              <Icon icon="lucide:play" width={13} height={13} /> Watch Reel
            </button>
          </div>
          <div className="hero2-trust">
            <span className="hero2-trust-label">Trusted by students from</span>
            <div className="hero2-avatars">
              {TRUST_AVATARS.map((src, i) => (
                <img src={src} alt="" key={i} className="hero2-avatar" />
              ))}
              <span className="hero2-avatar hero2-avatar-count">1K+</span>
            </div>
            <span className="hero2-trust-count">1,000+ Students Joined</span>
          </div>
        </div>

        <div className="hero2-right">
          <div className="hero2-img-wrap">
            <img src={heroStudents} alt="WeIntern students" className="hero2-img" />
            <div className="hero2-stats-card">
              {STATS.map((s) => (
                <div className="hero2-stat" key={s.label}>
                  <span className="hero2-stat-icon"><Icon icon="lucide:bar-chart-2" width={14} height={14} /></span>
                  <span className="hero2-stat-val">{s.val}</span>
                  <span className="hero2-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
