import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import heroStudents from "../../assets/hero-students.jpg/hero-students.jpeg";

import heroFullStack from "../../assets/HeroSlider/HeroSection_Slider2.png";
import heroCloud from "../../assets/HeroSlider/HeroSection_Slider3.png";
import heroOther from "../../assets/HeroSlider/HeroSection_Slider4.png";
import "./Hero.css";
import PartnersMarquee from "./PartnersMarquee";

const TRUST_AVATARS = [
  "https://miro.medium.com/v2/resize:fit:1200/1*smwgXLZyjz4zHVAeQJ2XMw.jpeg",
  "https://tse4.mm.bing.net/th/id/OIP.RQI38wBc0zOLPA2LOeTrgAHaEJ?r=0&w=626&h=351&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://th.bing.com/th/id/OIP.8CxADCGhYY-D5Elhs5WfqgHaEJ?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://media.istockphoto.com/id/1384475206/photo/indian-businessman-using-laptop-computer-working-in-modern-office-asian-student-studying.jpg?s=170667a&w=0&k=20&c=rx2Mpvn-JyqSP3-TR1qEfvbUGf_Y3ER_O11PU7yUTo4=",
];

const STATS = [
  { val: "15+", label: "Programs" },
  { val: "500+", label: "Internships" },
  { val: "100+", label: "Expert Mentors" },
  { val: "95%", label: "Placement Support" },
];

// --- Slide 1 = original full hero (text + image + stats). Slides 2-4 = image-only. ---
const SLIDES = [
  {
    id: "general",
    hasText: true,
    badge: "Learn. Intern. Grow.",
    title: (
      <>
        Your Skills.<br />
        Your <span className="hero2-accent-gold">Internship.</span><br />
        Your <span className="hero2-accent-cyan">Future.</span>
      </>
    ),
    sub: "WeIntern is the Gen Z platform to learn in-demand skills, gain real-world experience and launch your dream career.",
    primaryCta: "Explore Programs",
    scrollTarget: "courses",
    image: heroStudents,
    imageAlt: "WeIntern students",
  },
  {
    id: "fullstack",
    hasText: false,
    image: heroFullStack,
    imageAlt: "Full Stack development track",
  },
  {
    id: "cloud",
    hasText: false,
    image: heroCloud,
    imageAlt: "Cloud & DevOps track",
  },
  {
    id: "other",
    hasText: false,
    image: heroOther,
    imageAlt: "Other WeIntern tracks",
  },
];

const TRANSITION_MS = 450; // must match the CSS transition duration below
const AUTOPLAY_MS = 6000;

const Hero = () => {
  const [displayIndex, setDisplayIndex] = useState(0); // slide actually rendered
  const [isVisible, setIsVisible] = useState(true); // controls fade in/out
  const autoplayTimer = useRef(null);
  const transitionTimer = useRef(null);

  const changeSlide = (getNextIndex) => {
    // fade current slide out first
    setIsVisible(false);
    clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => {
      setDisplayIndex((prev) => getNextIndex(prev));
      setIsVisible(true); // fade new slide in
    }, TRANSITION_MS);
  };

  const nextSlide = () => changeSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => changeSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  const goToSlide = (index) => {
    if (index === displayIndex) return;
    changeSlide(() => index);
  };

  useEffect(() => {
    autoplayTimer.current = setInterval(nextSlide, AUTOPLAY_MS);
    return () => {
      clearInterval(autoplayTimer.current);
      clearTimeout(transitionTimer.current);
    };
  }, []);

  // restart autoplay countdown whenever the user manually changes slides
  const handleManualChange = (fn) => {
    clearInterval(autoplayTimer.current);
    fn();
    autoplayTimer.current = setInterval(nextSlide, AUTOPLAY_MS);
  };

  const slide = SLIDES[displayIndex];
  const visibilityClass = isVisible ? "hero2-slide-visible" : "hero2-slide-hidden";

  return (
    <section className="hero2">
      {slide.hasText ? (
        <div className={`hero2-inner hero2-slide-transition ${visibilityClass}`}>
          <div className="hero2-left">
            <div className="hero2-badge">{slide.badge}</div>
            <h1 className="hero2-title">{slide.title}</h1>
            <p className="hero2-sub">{slide.sub}</p>
            <div className="hero2-btns">
              <button
                className="hero2-btn-primary"
                onClick={() => document.getElementById(slide.scrollTarget)?.scrollIntoView({ behavior: "smooth" })}
              >
                {slide.primaryCta} <Icon icon="lucide:arrow-right" width={16} height={16} />
              </button>
              <button className="hero2-btn-outline">
                <Icon icon="lucide:play" width={13} height={13} /> Book A Demo
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
              <img src={slide.image} alt={slide.imageAlt} className="hero2-img" />
              <div className="hero2-stats-card">
                {STATS.map((s) => (
                  <div className="hero2-stat" key={s.label}>
                    <span className="hero2-stat-icon">
                      <Icon icon="lucide:bar-chart-2" width={14} height={14} />
                    </span>
                    <span className="hero2-stat-val">{s.val}</span>
                    <span className="hero2-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`hero2-image-only hero2-slide-transition ${visibilityClass}`}>
          <img src={slide.image} alt={slide.imageAlt} className="hero2-image-only-img" />
        </div>
      )}

      {/* Slide controls */}
      <div className="hero2-slider-controls">
        <button
          className="hero2-slider-arrow hero2-slider-arrow-left"
          onClick={() => handleManualChange(prevSlide)}
          aria-label="Previous slide"
        >
          <Icon icon="lucide:chevron-left" width={18} height={18} />
        </button>
        <div className="hero2-slider-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              className={`hero2-dot ${i === displayIndex ? "hero2-dot-active" : ""}`}
              onClick={() => handleManualChange(() => goToSlide(i))}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="hero2-slider-arrow hero2-slider-arrow-right"
          onClick={() => handleManualChange(nextSlide)}
          aria-label="Next slide"
        >
          <Icon icon="lucide:chevron-right" width={18} height={18} />
        </button>
      </div>
    </section>
  );
};

export default Hero;