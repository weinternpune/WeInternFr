import React, { useState, useEffect, useRef } from 'react';
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
import './StudentProjects.css';

const projectData = [
  { id:1,  image:ecommerce,        title:"E-Commerce Website",      subtitle:"Built for Retail Brand",     tech:["React","Node.js","MongoDB"] },
  { id:2,  image:ai_chatbot,       title:"AI Chatbot Automation",   subtitle:"Built for SaaS Company",     tech:["Python","OpenAI","FastAPI"] },
  { id:3,  image:fleet_monitoring, title:"Fintech Dashboard",       subtitle:"Built for Fintech Startup",  tech:["React","Node.js","Chart.js"] },
  { id:4,  image:platform,         title:"Real Estate Platform",    subtitle:"Built for Real Estate Firm", tech:["Next.js","MongoDB","Stripe"] },
  { id:5,  image:edtech,           title:"EdTech Platform",         subtitle:"Built for Online Learning",  tech:["Next.js","Tailwind","Prisma"] },
  { id:6,  image:healthcare,       title:"Healthcare App",          subtitle:"Built for Clinic Network",   tech:["React","Firebase","Stripe"] },
  { id:7,  image:analytics,        title:"Analytics Dashboard",     subtitle:"Built for Marketing Agency", tech:["Vue","D3.js","Node.js"] },
  { id:8,  image:food_delivery,    title:"Food Delivery App",       subtitle:"Built for Restaurant Chain", tech:["React","Node.js","MongoDB"] },
  { id:9,  image:job_portal,       title:"Job Portal Website",      subtitle:"Built for Hiring Platform",  tech:["Next.js","Firebase","Tailwind"] },
  { id:10, image:travel_booking,   title:"Travel Booking Platform", subtitle:"Built for Travel Agency",    tech:["React","Express","Stripe"] },
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

const StudentProjects = () => {
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
      <div className="sp-container">
        <div className="section-header">
          <div />
          <div className="section-content">
            <h2>Real Projects Done by Our <span>Student Teams</span></h2>
            <p>Real clients. Real problems. Real impact.</p>
          </div>
          <button
            className="view-more-btn"
            onClick={() => { setShowAll(s => !s); setStart(0); }}>
            {showAll ? "← Show Less" : "View More Projects →"}
          </button>
        </div>

        {!showAll ? (
          <div className="projects-slider">
            <button className="slider-btn"
              onClick={() => setStart(s => Math.max(0, s - 1))}
              disabled={start === 0}>‹</button>
            <div className="projects-track-wrapper" ref={trackRef}>
              <div className="projects-track"
                style={{ transform:`translateX(-${start * (cardWidth + GAP)}px)`, gap:`${GAP}px` }}>
                {projectData.map(p => (
                  <div key={p.id}
                    style={{ minWidth: cardWidth > 0 ? `${cardWidth}px` : `calc((100% - ${GAP*(VISIBLE-1)}px) / ${VISIBLE})` }}>
                    <ProjectCard {...p} />
                  </div>
                ))}
              </div>
            </div>
            <button className="slider-btn"
              onClick={() => setStart(s => Math.min(projectData.length - VISIBLE, s + 1))}
              disabled={start + VISIBLE >= projectData.length}>›</button>
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

export default StudentProjects;
