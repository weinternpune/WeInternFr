import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CoursesContext';
import { COURSE_DETAILS } from '../components/Sections/CourseDetail';
import { EnrollModal } from '../components/Sections/Courses';
import Navbar from '../components/Layout/Navbar';
import toast from 'react-hot-toast';
import {
  slugify,
  getMentor,
  getRoadmap,
  getVideos,
  getTestimonials,
  getMaterials,
  getPrerequisites,
  getTechIcon,
  PARTNERS,
  WHY_CHOOSE,
} from '../data/courseExtras';
import './CoursePage.css';

const buildFallbackDetails = (course) => ({
  icon: course.icon || 'mdi:school',
  tagline: course.tagline || course.desc || 'Professional course by WeIntern',
  price: course.price || 0,
  duration: course.duration || 'Flexible',
  level: (course.level || 'beginner').charAt(0).toUpperCase() + (course.level || 'beginner').slice(1),
  language: course.language || 'English + Hindi',
  certificate: true,
  stipend: true,
  about:
    course.about ||
    course.desc ||
    course.tagline ||
    'This course is designed by industry experts to give you real-world skills and hands-on experience.',
  tools: Array.isArray(course.tools)
    ? course.tools
    : (course.tools || '').split(',').map((t) => t.trim()).filter(Boolean),
  curriculum: [
    { week: 'Phase 1', title: 'Fundamentals & Setup', topics: ['Environment setup', 'Core concepts', 'Basic projects', 'Best practices'] },
    { week: 'Phase 2', title: 'Intermediate Topics', topics: ['Advanced features', 'Real patterns', 'Code review', 'Debugging'] },
    { week: 'Phase 3', title: 'Real Client Projects', topics: ['Client requirements', 'Project execution', 'Delivery', 'Portfolio'] },
  ],
});

const Stars = ({ count }) => (
  <div className="cp-stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Icon key={i} icon="mdi:star" width={14} height={14} color={i < count ? '#f59e0b' : '#e2e5ee'} />
    ))}
  </div>
);

const CoursePage = () => {
  const { slug } = useParams();
  const { activeCourses } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollCourseData, setEnrollCourseData] = useState(null);

  const course = activeCourses.find((c) => slugify(c.title) === slug);

  if (!course) {
    return (
      <div className="cp-page">
        <Navbar />
        <div className="cp-notfound">
          <h2>Course not found</h2>
          <p>This course may have been removed or renamed.</p>
          <Link to="/" className="cp-btn cp-btn-primary">Back to all courses</Link>
        </div>
      </div>
    );
  }

  const details = COURSE_DETAILS[course.title] || buildFallbackDetails(course);
  const originalPrice = course.originalPrice || Math.round((course.price || details.price) * 1.2);
  const offerPrice = course.price || details.price;
  const discount = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);

  const mentor = getMentor(course);
  const roadmap = getRoadmap(course, details);
  const videos = getVideos(course, details);
  const testimonials = getTestimonials(course);
  const materials = getMaterials(course, details);
  const prerequisites = getPrerequisites(course);

  const handleEnroll = () => {
    if (!user) {
      toast('Please login or register to enroll', { icon: 'ℹ️' });
      navigate('/login');
      return;
    }
    setEnrollCourseData(course);
  };

  return (
    <div className="cp-page">
      <Navbar />

      {/* Hero */}
      <div className="cp-hero">
        <div className="cp-hero-inner">
          <div className="cp-hero-left">
            <div className="cp-hero-badge">
              <span className="cp-hero-badge-icon"><Icon icon={details.icon} width={16} height={16} /></span>
              CERTIFICATION COURSE
            </div>
            <h1 className="cp-hero-title">{course.title}</h1>
            <p className="cp-hero-tagline">{details.tagline}</p>

            <div className="cp-hero-badges">
              <span className="cp-badge"><Icon icon="mdi:clock-outline" width={14} height={14} /> {details.duration}</span>
              <span className="cp-badge"><Icon icon="mdi:chart-bar" width={14} height={14} /> {details.level}</span>
              <span className="cp-badge"><Icon icon="mdi:web" width={14} height={14} /> {details.language}</span>
              {details.certificate && <span className="cp-badge"><Icon icon="mdi:certificate-outline" width={14} height={14} /> Certificate</span>}
            </div>

            <div className="cp-hero-price-row">
              <span className="cp-price-old">₹{Number(originalPrice).toLocaleString('en-IN')}</span>
              <span className="cp-price-new">₹{Number(offerPrice).toLocaleString('en-IN')}</span>
              <span className="cp-price-discount">{discount}% OFF</span>
              <button className="cp-btn cp-btn-primary" onClick={handleEnroll}>
                Enroll Now <Icon icon="mdi:arrow-right" width={16} height={16} />
              </button>
            </div>
          </div>

          <div className="cp-hero-right">
            <div className="cp-hero-illustration">
              <div className="cp-hi-glow" />
              <div className="cp-hi-monitor">
                <div className="cp-hi-monitor-bar" />
                <div className="cp-hi-lines">
                  {[...Array(6)].map((_, i) => <div key={i} className="cp-hi-line" style={{ width: `${55 + (i % 3) * 15}%` }} />)}
                </div>
              </div>
              <div className="cp-hi-tag cp-hi-tag-1"><Icon icon="mdi:code-tags" width={20} height={20} /></div>
              <div className="cp-hi-tag cp-hi-tag-2"><Icon icon={details.icon} width={20} height={20} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Why choose */}
      <div className="cp-why-strip">
        <div className="cp-why-inner">
          {WHY_CHOOSE.map((w, i) => (
            <div className="cp-why-item" key={i}>
              <div className="cp-why-icon"><Icon icon={w.icon} width={22} height={22} /></div>
              <div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cp-body">
        {/* Skills you will master */}
        {!!details.tools?.length && (
          <section className="cp-section cp-skills-section">
            <span className="cp-section-eyebrow">— What You'll Learn —</span>
            <h2 className="cp-section-title cp-center">Skills You Will Master</h2>
            <div className="cp-skills-grid">
              {details.tools.map((t) => (
                <div className="cp-skill-card" key={t}>
                  <div className="cp-skill-icon"><Icon icon={getTechIcon(t)} width={30} height={30} /></div>
                  <h4>{t}</h4>
                  <p>Build practical skills with {t} used in real projects.</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Overview</span>
          <h2 className="cp-section-title">About this course</h2>
          <p className="cp-about-text">{details.about}</p>
        </section>

        {/* Prerequisites */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Before you start</span>
          <h2 className="cp-section-title">Requirements to get started</h2>
          <ul className="cp-check-list">
            {prerequisites.map((p, i) => (
              <li key={i}><Icon icon="mdi:check-circle" width={18} height={18} /> {p}</li>
            ))}
          </ul>
        </section>

        {/* Roadmap */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Curriculum</span>
          <h2 className="cp-section-title">Course Roadmap & Topics</h2>
          <div className="cp-roadmap">
            {roadmap.map((r, i) => (
              <div className="cp-roadmap-step" key={i}>
                <div className="cp-roadmap-marker">{i + 1}</div>
                <div className="cp-roadmap-content">
                  <span className="cp-roadmap-phase">{r.phase}</span>
                  <h3 className="cp-roadmap-title">{r.title}</h3>
                  <div className="cp-roadmap-topics">
                    {r.topics.map((t) => <span key={t} className="cp-topic-chip">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Lecture Videos */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Preview</span>
          <h2 className="cp-section-title">Demo Lecture Videos</h2>
          <div className="cp-video-grid">
            {videos.map((v, i) => (
              <div className="cp-video-card" key={i}>
                <div className="cp-video-thumb">
                  {v.videoUrl ? (
                    <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="cp-video-play">
                      <Icon icon="mdi:play-circle" width={44} height={44} />
                    </a>
                  ) : (
                    <span className="cp-video-soon">Demo coming soon</span>
                  )}
                </div>
                <div className="cp-video-info">
                  <p className="cp-video-title">{v.title}</p>
                  <span className="cp-video-duration">{v.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mentor */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Meet your guide</span>
          <h2 className="cp-section-title">Your Mentor</h2>
          <div className="cp-mentor-card">
            <div className="cp-mentor-avatar"><Icon icon={mentor.avatarIcon} width={34} height={34} /></div>
            <div className="cp-mentor-info">
              <h3>{mentor.name}</h3>
              <p className="cp-mentor-role">{mentor.role} · {mentor.years}+ years experience</p>
              <p className="cp-mentor-bio">{mentor.bio}</p>
              <a href={`mailto:${mentor.email}`} className="cp-mentor-email">
                <Icon icon="mdi:email-outline" width={14} height={14} /> {mentor.email}
              </a>
            </div>
          </div>
        </section>

        {/* Study Materials */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Resources</span>
          <h2 className="cp-section-title">Free Study Materials</h2>
          <div className="cp-materials-grid">
            {materials.map((m, i) => (
              <div className="cp-material-card" key={i}>
                <Icon icon="mdi:file-download-outline" width={22} height={22} />
                <span className="cp-material-title">{m.title}</span>
                {m.downloadUrl ? (
                  <a href={m.downloadUrl} className="cp-material-btn" download>Download</a>
                ) : (
                  <span className="cp-material-btn cp-material-btn-disabled">Coming soon</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Real feedback</span>
          <h2 className="cp-section-title">Student Testimonials</h2>
          <div className="cp-testimonial-grid">
            {testimonials.map((t, i) => (
              <div className="cp-testimonial-card" key={i}>
                <Stars count={t.rating} />
                <p className="cp-testimonial-quote">"{t.quote}"</p>
                <p className="cp-testimonial-name">{t.name}</p>
                <p className="cp-testimonial-batch">{t.batch}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="cp-section cp-partners-section">
          <span className="cp-section-eyebrow">Trusted by</span>
          <h2 className="cp-section-title cp-center">Our Company Partners</h2>
          <div className="cp-partners-row">
            {PARTNERS.map((p) => (
              <div className="cp-partner-chip" key={p.name}>
                <Icon icon={p.icon} width={20} height={20} /><span>{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="cp-bottom-cta">
          <div>
            <span className="cp-price-new" style={{ fontSize: '1.4rem' }}>₹{Number(offerPrice).toLocaleString('en-IN')}</span>
            <span className="cp-price-old" style={{ marginLeft: 10 }}>₹{Number(originalPrice).toLocaleString('en-IN')}</span>
          </div>
          <button className="cp-btn cp-btn-primary" onClick={handleEnroll}>
            Enroll Now <Icon icon="mdi:arrow-right" width={16} height={16} />
          </button>
        </div>
      </div>

      {enrollCourseData && (
        <EnrollModal course={enrollCourseData} onClose={() => setEnrollCourseData(null)} />
      )}
    </div>
  );
};

export default CoursePage;
