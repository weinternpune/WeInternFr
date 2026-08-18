import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer" id="contact">
    <div className="footer-inner">

      {/* ================= TOP ================= */}
      <div className="footer-top">

        {/* Brand */}
        <div className="footer-brand">
          <img
            src="/welogo.png"
            alt="WeIntern"
            className="footer-logo"
          />

          <p>
            Where Students Don't Wait for
            <br />
            Opportunity. They Build It.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.linkedin.com/company/weinternx/"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in" />
            </a>

            <a
              href="https://www.instagram.com/weinternx"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" />
            </a>

            <a
              href="https://whatsapp.com/channel/0029VbCWcNLlyPtbKBYhmn2Y"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
              aria-label="WhatsApp"
            >
              <i className="fab fa-whatsapp" />
            </a>

            <a
              href="https://twitter.com/weinternx"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
              aria-label="X"
            >
              <i className="fab fa-x-twitter" />
            </a>
          </div>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h5>Company</h5>

          <a href="#story">
            Our Story
            <span>›</span>
          </a>

          <a href="#how">
            How It Works
            <span>›</span>
          </a>

          <a href="#ecosystem">
            Ecosystem
            <span>›</span>
          </a>

          <a href="#courses">
            Courses
            <span>›</span>
          </a>

          <a href="#testimonials">
            Intern Stories
            <span>›</span>
          </a>
        </div>

        {/* Join Us */}
        <div className="footer-col">
          <h5>Join Us</h5>

          <a href="#apply">
            Apply as Intern
            <span>›</span>
          </a>

          <a href="#hire">
            Hire a Team
            <span>›</span>
          </a>

          <a href="#contact">
            Partner With Us
            <span>›</span>
          </a>
        </div>

        {/* Contact */}
        <div className="footer-col footer-contact">
          <h5>Contact</h5>

          <a href="mailto:contact@we-intern.in">
            <i className="far fa-envelope" />
            contact@we-intern.in
          </a>

          <a href="tel:+917414974582">
            <i className="fas fa-phone-alt" />
            +91 74149 74582
          </a>

          <span>
            <i className="fas fa-map-marker-alt" />
            India · Remote-First
          </span>
        </div>

        {/* Location / Map */}
        <div className="footer-location">
          <h5>Our Location</h5>

         <div className="footer-map">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.289256198922!2d73.94289637506326!3d18.560993582540547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c36dbb5048ff%3A0xf69deab017762391!2sWEINTERN%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sus!4v1786969585545!5m2!1sen!2sus"
    title="WeIntern Private Limited Location"
    loading="lazy"
    allowFullScreen
    referrerPolicy="strict-origin-when-cross-origin"
  />
</div>
        </div>

      </div>

      {/* ================= BOTTOM ================= */}
      <div className="footer-bottom">

        <p>
          © 2024 WeIntern. All rights reserved.
          Built with <span className="heart">♥</span> by the WeIntern Team.
        </p>

        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <span>|</span>
          <a href="#">Terms of Service</a>
        </div>

      </div>

    </div>
  </footer>
);

export default Footer;