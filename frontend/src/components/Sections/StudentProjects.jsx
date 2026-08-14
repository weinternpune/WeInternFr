import React, { useState, useEffect, useRef } from "react";
import ai_chatbot from "../../assets/ai_chatbot.jpg";
import analytics from "../../assets/analytics.jpg";
import ecommerce from "../../assets/ecommerce.jpg";
import edtech from "../../assets/edtech.jpg";
import fleet_monitoring from "../../assets/fleet_monitoring.png";
import healthcare from "../../assets/healthcare.jpg";
import platform from "../../assets/platform.jpg";
import food_delivery from "../../assets/food_delivery.jpg";
import job_portal from "../../assets/job_portal.jpg";
import travel_booking from "../../assets/travel_booking.jpg";
import Trading from "../../assets/Trading-image.jpg";
import "./StudentProjects.css";
const projectData = [
  {
    id: 1,
    image: ecommerce,
    title: "E-Commerce Website",
    subtitle: "Built for Retail Brand",
    tech: ["React", "Node.js", "MongoDB"],
  },

  {
    id: 2,
    image: ai_chatbot,
    title: "AI Chatbot Automation",
    subtitle: "Built for SaaS Company",
    tech: ["Python", "OpenAI", "FastAPI"],
  },

  {
    id: 3,
    image: fleet_monitoring,
    title: "Fintech Dashboard",
    subtitle: "Built for Fintech Startup",
    tech: ["React", "Node.js", "Chart.js"],
  },

  {
    id: 4,
    image: platform,
    title: "Real Estate Platform",
    subtitle: "Built for Real Estate Firm",
    tech: ["Next.js", "MongoDB", "Stripe"],
  },

  {
    id: 5,
    image: edtech,
    title: "EdTech Platform",
    subtitle: "Built for Online Learning",
    tech: ["Next.js", "Tailwind", "Prisma"],
  },

  {
    id: 6,
    image: healthcare,
    title: "Healthcare App",
    subtitle: "Built for Clinic Network",
    tech: ["React", "Firebase", "Stripe"],
  },

  {
    id: 7,
    image: analytics,
    title: "Analytics Dashboard",
    subtitle: "Built for Marketing Agency",
    tech: ["Vue", "D3.js", "Node.js"],
  },

  {
    id: 8,
    image: food_delivery,
    title: "Food Delivery App",
    subtitle: "Built for Restaurant Chain",
    tech: ["React", "Node.js", "MongoDB"],
  },

  {
    id: 9,
    image: job_portal,
    title: "Job Portal Website",
    subtitle: "Built for Hiring Platform",
    tech: ["Next.js", "Firebase", "Tailwind"],
  },

  {
    id: 10,
    image: travel_booking,
    title: "Travel Booking Platform",
    subtitle: "Built for Travel Agency",
    tech: ["React", "Express", "Stripe"],
  },

  {
    id: 11,
    image: Trading,
    title: "Trading Platform",
    subtitle: "Built for Trading Agency",
    tech: ["React", "Express", "Stripe" , "MongoDB"],
  },
  {
  id: 12,
  type: "more",
  title: "More Projects",
  subtitle: "Explore our complete project collection",
},

];
const GAP = 20;
const getVisibleCards = (width) => {
  if (width >= 1200) return 4;
  if (width >= 992) return 3;
  if (width >= 768) return 2;
  return 1;
};
const ProjectCard = ({ image, title, subtitle, tech, type }) => {
  if (type === "more") {
    return (
      <article
        className="
          project-card group flex h-full min-h-[360px] cursor-pointer
          flex-col items-center justify-center
          border border-slate-200
          bg-gradient-to-br from-slate-50 via-white to-emerald-50/40
          text-center
          transition-all duration-300
          hover:-translate-y-1
          hover:border-emerald-200
          hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]
        "
      >
        {/* Icon */}
        <div
          className="
            mb-5 flex h-16 w-16 items-center justify-center
            rounded-2xl bg-slate-900 text-2xl text-white
            shadow-[0_10px_25px_rgba(15,23,42,0.12)]
            transition-all duration-300
            group-hover:scale-105
            group-hover:bg-emerald-600
          "
        >
          +
        </div>

        <h3 className="text-xl font-bold tracking-tight text-slate-900">
          More Projects
        </h3>

        <p className="mt-2 max-w-[210px] text-xs leading-5 text-slate-500">
          Explore more real-world projects built by our student teams.
        </p>

        <div
          className="
            mt-6 inline-flex items-center gap-2
            rounded-full bg-slate-900
            px-4 py-2
            text-[11px] font-bold text-white
            transition-all duration-300
            group-hover:bg-emerald-600
          "
        >
          View All Projects
          <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </article>
    );
  }

  return (
    <article className="project-card">
      <div className="project-image-wrapper">
        <img
          src={image}
          alt={title}
          className="project-image"
          loading="lazy"
        />
      </div>

      <div className="project-content">
        <h3>{title}</h3>

        <p className="project-subtitle">
          {subtitle}
        </p>

        <div className="project-tech">
          {tech.map((item) => (
            <span className="tech-pill" key={item}>
              {item}
            </span>
          ))}
        </div>

        <div className="project-footer">
          <span className="project-label">
            TECHNOLOGIES
          </span>

          <span className="project-view">
            View All Project
            <span className="project-view-arrow">→</span>
          </span>
        </div>
      </div>
    </article>
  );
};
const StudentProjects = () => {
  const [start, setStart] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const trackRef = useRef(null);
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const newVisibleCards = getVisibleCards(width);
      setVisibleCards(newVisibleCards);
      if (trackRef.current) {
        const totalWidth = trackRef.current.clientWidth;
        if (totalWidth > 0) {
          const gapTotal = GAP * Math.max(0, newVisibleCards - 1);
          const newCardWidth = (totalWidth - gapTotal) / newVisibleCards;
          setCardWidth(newCardWidth);
        }
      }
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, [showAll]);
  useEffect(() => {
    const maxStart = Math.max(0, projectData.length - visibleCards);
    if (start > maxStart) {
      setStart(maxStart);
    }
  }, [visibleCards, start]);
  const maxStart = Math.max(0, projectData.length - visibleCards);
  const handlePrevious = () => {
    setStart((current) => Math.max(0, current - 1));
  };
  const handleNext = () => {
    setStart((current) => Math.min(maxStart, current + 1));
  };
  const handleViewMore = () => {
    setShowAll((current) => !current);
    setStart(0);
  };
  return (
    <section className="student-projects-section">
      {" "}
      <div className="student-projects-container">
        {" "}
        {/* Header */}{" "}
<div className="mb-9 flex w-full flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">

  {/* Header Content */}
  <div className="flex w-full flex-1 flex-col items-center text-center sm:w-auto">

    <div className="mb-2.5 inline-flex items-center justify-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-500">
      <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.09)]" />
      <span>Student Projects</span>
    </div>

    <h2 className="m-0 max-w-[620px] text-[20px] font-bold leading-[1.12] tracking-[-0.035em] text-slate-900 sm:text-[20px] md:text-[33px] lg:text-[36px]">
      Real Projects
      <span className="mx-2 font-medium text-slate-900">
        By
      </span>
      <span className="font-semibold text-slate-700">
        Student Teams
      </span>
    </h2>

    <p className="mt-2 max-w-md text-[11px] leading-5 text-slate-500 sm:text-xs">
      Real clients. Real problems. Real impact.
    </p>

  </div>

  {/* View More */}
  <button
    className="
      group
      flex
      shrink-0
      items-center
      gap-2.5
      rounded-full
      border
      border-slate-200
      bg-white
      py-1.5
      pl-4
      pr-1.5
      text-[11px]
      font-bold
      text-slate-700
      shadow-[0_4px_14px_rgba(15,23,42,0.045)]
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:border-slate-300
      hover:text-slate-900
      hover:shadow-[0_10px_25px_rgba(15,23,42,0.09)]
      sm:text-xs
    "
    onClick={handleViewMore}
  >
    <span className="whitespace-nowrap">
      {showAll ? "Show Less" : "View More Projects"}
    </span>

    <span
      className="
        flex
        h-[30px]
        w-[30px]
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-slate-900
        text-[13px]
        leading-none
        text-white
        transition-all
        duration-300
        group-hover:translate-x-0.5
        group-hover:bg-emerald-600
        group-hover:shadow-[0_5px_12px_rgba(5,150,105,0.2)]
      "
    >
      {showAll ? "←" : "→"}
    </span>
  </button>

</div>
        {/* Slider */}{" "}
        {!showAll ? (
          <div className="projects-slider">
            {" "}
            <button
              className="slider-btn"
              onClick={handlePrevious}
              disabled={start === 0}
              aria-label="Previous projects"
            >
              {" "}
              ←{" "}
            </button>{" "}
            <div className="projects-track-wrapper" ref={trackRef}>
              {" "}
              <div
                className="projects-track"
                style={{
                  transform: `translateX(-${start * (cardWidth + GAP)}px)`,
                  gap: `${GAP}px`,
                }}
              >
                {" "}
                {projectData.map((project) => (
                  <div
                    key={project.id}
                    className="project-slide"
                    style={{
                      width:
                        cardWidth > 0
                          ? `${cardWidth}px`
                          : `calc((100% - ${GAP * (visibleCards - 1)}px) / ${visibleCards})`,
                    }}
                  >
                    {" "}
                    <ProjectCard {...project} />{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>{" "}
            <button
              className="slider-btn"
              onClick={handleNext}
              disabled={start + visibleCards >= projectData.length}
              aria-label="Next projects"
            >
              {" "}
              →{" "}
            </button>{" "}
          </div>
        ) : (
          <div className="projects-grid-all">
            {" "}
            {projectData.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}{" "}
          </div>
        )}{" "}
        {/* Slider Progress */}{" "}
        {!showAll && (
          <div className="slider-progress">
            {" "}
            <span> {String(start + 1).padStart(2, "0")} </span>{" "}
            <div className="progress-line">
              {" "}
              <div
                className="progress-fill"
                style={{
                  width: `${((start + visibleCards) / projectData.length) * 100}%`,
                }}
              />{" "}
            </div>{" "}
            <span> {String(projectData.length).padStart(2, "0")} </span>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </section>
  );
};
export default StudentProjects;
