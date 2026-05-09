import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer" id="contact">
    <div className="footer-inner">
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/welogo.png" alt="WeIntern" className="footer-logo" />
          <p>Where Students Don't Wait for Opportunity. They Build It.</p>
          <div className="footer-socials">
            <a href="https://www.linkedin.com/company/weinternx/" target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
            <a href="https://www.instagram.com/weinternx" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram"><i className="fab fa-instagram" /></a>
            <a href="https://whatsapp.com/channel/0029VbCWcNLlyPtbKBYhmn2Y" target="_blank" rel="noreferrer" className="social-btn" aria-label="WhatsApp"><i className="fab fa-whatsapp" /></a>
            <a href="https://twitter.com/weinternx" target="_blank" rel="noreferrer" className="social-btn"><i className="fab fa-x-twitter" /></a>
          </div>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <a href="#story">Our Story</a>
          <a href="#how">How It Works</a>
          <a href="#services">Services</a>
          <a href="#courses">Courses</a>
          <a href="#testimonials">Intern Stories</a>
        </div>
        <div className="footer-col">
          <h5>Join Us</h5>
          <a href="#apply">Apply as Intern</a>
          <a href="#hire">Hire a Team</a>
          <a href="#contact">Partner With Us</a>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <a href="mailto:contact.weintern@gmail.com">contact.weintern@gmail.com</a>
          <a href="tel:+917414974582">+91 74149 74582</a>
          <span>India · Remote-First</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 WeIntern. All rights reserved. Built with ❤️ by the WeIntern Team.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
