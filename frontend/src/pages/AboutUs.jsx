import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* Header with back button */}
      <div className="about-header">
        <div className="about-header-inner">
          <Link to="/" className="about-back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Home
          </Link>
          <Link to="/" className="about-logo">
            <img src="/welogo.png" alt="WeIntern" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="about-hero">
        <div className="about-particles" id="aboutParticles" />
        
        <div className="about-content-wrapper">
          {/* Left Side - Vision */}
          <div className="about-left">
            <div className="about-label">OUR VISION</div>
            <h1 className="about-title">
              Building a Generation<br />
              That's Ready.
            </h1>
            <p className="about-description">
              To create a generation of professionals who are not afraid of interviews, 
              not confused about skills, and not dependent only on degrees.
            </p>

            {/* Flow badges */}
            <div className="about-flow">
              <div className="flow-item">
                <span className="flow-icon">📚</span>
                <span className="flow-label">Learning</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">
                <span className="flow-icon">💼</span>
                <span className="flow-label">Experience</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">
                <span className="flow-icon">💰</span>
                <span className="flow-label">Income</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">
                <span className="flow-icon">🚀</span>
                <span className="flow-label">Future</span>
              </div>
            </div>
          </div>

          {/* Right Side - Founder Card */}
          <div className="about-right">
            <div className="founder-card">
              <div className="founder-glow" />
              
              <div className="founder-header">
                <div className="founder-avatar">AW</div>
                <div className="founder-info">
                  <h3>Ashwin</h3>
                  <p>Founder, Weintern</p>
                </div>
              </div>

              <blockquote className="founder-quote">
                "I started Weintern because I saw talented students being rejected — 
                not for lack of skill, but lack of opportunity. We're changing that, 
                one intern at a time."
              </blockquote>

              <div className="founder-social">
                <a href="https://www.linkedin.com/in/ashwin-weintern" target="_blank" rel="noopener noreferrer" className="social-link">
                  LinkedIn
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/weintern.in" target="_blank" rel="noopener noreferrer" className="social-link">
                  Instagram
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="about-mission-inner">
          <h2 className="mission-title">Our Mission</h2>
          <p className="mission-text">
            To empower every student with practical skills, real experience, and financial 
            independence through meaningful work. We bridge the gap between education and 
            employment by providing hands-on training and real project opportunities.
          </p>
          
          <div className="mission-stats">
            <div className="mission-stat">
              <div className="stat-value">12,500+</div>
              <div className="stat-label">Students Trained</div>
            </div>
            <div className="mission-stat">
              <div className="stat-value">920+</div>
              <div className="stat-label">Projects Delivered</div>
            </div>
            <div className="mission-stat">
              <div className="stat-value">₹4.5 Cr+</div>
              <div className="stat-label">Paid in Stipends</div>
            </div>
            <div className="mission-stat">
              <div className="stat-value">200+</div>
              <div className="stat-label">College Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="about-values-inner">
          <h2 className="values-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>Student-First Approach</h3>
              <p>Every decision we make prioritizes student growth, learning, and success.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Real-World Learning</h3>
              <p>We believe in learning by doing, not just theory and certifications.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Fair Compensation</h3>
              <p>Students deserve to earn for the value they create through their work.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Continuous Growth</h3>
              <p>We foster an environment of constant learning and skill development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-cta-inner">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of students who are learning, earning, and building their future with WeIntern.</p>
          <div className="about-cta-buttons">
            <Link to="/#courses" className="btn-about-primary">Explore Courses</Link>
            <Link to="/#contact" className="btn-about-outline">Get in Touch</Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="about-footer">
        <div className="about-footer-inner">
          {/* Company Info */}
          <div className="footer-section footer-company">
            <div className="footer-logo-section">
              <Link to="/" className="footer-logo-link">
                <img src="/welogo.png" alt="WeIntern" className="footer-logo" />
              </Link>
              <p className="footer-tagline">Empowering students with practical skills, real experience, and financial independence.</p>
            </div>
            <div className="footer-social-links">
              <a href="https://www.linkedin.com/company/weintern" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/weintern.in" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://twitter.com/weintern" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section footer-contact">
            <h4>Contact Us</h4>
            <div className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <a href="tel:+917414974582">+91 7414974582</a>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a href="mailto:contact@weintern.in">contact@weintern.in</a>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>

          {/* Company Details */}
          <div className="footer-section footer-details">
            <h4>Company Details</h4>
            <div className="footer-detail-item">
              <strong>Industry:</strong>
              <span>IT Services and IT Consulting</span>
            </div>
            <div className="footer-detail-item">
              <strong>Company Size:</strong>
              <span>11-50 employees</span>
            </div>
            <div className="footer-detail-item">
              <strong>Founded:</strong>
              <span>2025</span>
            </div>
            <div className="footer-detail-item">
              <strong>Headquarters:</strong>
              <span>Pune, Maharashtra</span>
            </div>
          </div>

          {/* Specialties */}
          <div className="footer-section footer-specialties">
            <h4>Our Specialties</h4>
            <div className="footer-tags">
              <span>IT Services</span>
              <span>Web Development</span>
              <span>App Development</span>
              <span>AI Automation</span>
              <span>UI/UX Design</span>
              <span>API Integration</span>
              <span>Startup Solutions</span>
              <span>Business Growth</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p>&copy; 2025 WeIntern. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
