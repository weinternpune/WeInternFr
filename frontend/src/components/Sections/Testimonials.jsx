
import React, { useState } from 'react';
import './Testimonials.css';
import ContactSection from "./ContactFrom";

const TESTIMONIALS = [
  { initials:'AK', color:'#E8A820', name:'Arjun Kumar', role:'Web Dev Intern → Junior Dev at TechCorp', stars:5, text:'"Before WeIntern, I had 12 certificates and zero real projects. Six months later, I had delivered 3 live client websites and received my first salary-based job offer. The difference is night and day."' },
  { initials:'SM', color:'#2196C9', name:'Sneha Mishra', role:'AI Intern → Data Science Analyst', stars:5, text:'"I was terrified of interviews because I had nothing to show. At WeIntern, I worked on a real AI chatbot for a client. That single project got me through 4 interview rounds. I couldn\'t believe it."' },
  { initials:'RP', color:'#e67e22', name:'Rohit Patil', role:'App Intern → Freelancer (₹80k/month)', stars:5, text:'"The stipend was a bonus, but the experience was priceless. I learned more in 3 months at WeIntern than 2 years of college. Real mentorship, real deadlines, real clients — this is the education we needed."' },
];

const StarRating = ({ count }) => (

  <div className="testi-stars">

    {Array.from({ length: count }).map((_, i) => (

      <svg
        key={i}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="#f59e0b"
        stroke="none"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>

    ))}

  </div>

);

const Testimonials = () => {

  const [showPopup, setShowPopup] = useState(false);

  return (

    <>

      <section className="testimonials-section" id="testimonials">

        <div className="container">

          <div className="section-label">
            Real Stories
          </div>

          <h2 className="section-title">
            From Students Who Made the Leap
          </h2>

          <p className="section-sub">
            These aren't just success stories — they're proof that the model works.
          </p>

          <div className="testi-grid">

            {TESTIMONIALS.map((t, i) => (

              <div key={i} className="testi-card">

                <div className="testi-top">

                  <div
                    className="testi-avatar"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>

                  <div className="testi-info">

                    <strong>{t.name}</strong>

                    <span>{t.role}</span>

                  </div>

                  <StarRating count={t.stars} />

                </div>

                <p className="testi-text">
                  {t.text}
                </p>

                <div className="testi-verified">

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#18b45b"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>

                  Verified WeIntern Alumni

                </div>

              </div>

            ))}

          </div>

          {/* CTA SECTION */}

          <div className="testi-cta">

            <div className="testi-cta-stats">

              {[
                { val: '4.8/5', label: 'Average Rating' },
                { val: '2,000+', label: 'Reviews' },
                { val: '98%', label: 'Would Recommend' }
              ].map((s, i) => (

                <div key={i} className="tcs-item">

                  <strong>{s.val}</strong>

                  <span>{s.label}</span>

                </div>

              ))}

            </div>

            {/* BUTTON */}

            <button
              className="btn-testi-cta"
              onClick={() => setShowPopup(true)}
            >
              Join WeIntern →
            </button>

          </div>

        </div>

      </section>

      {/* POPUP */}

      {showPopup && (

        <div className="popup-overlay">

          <div className="popup-container">

            <button
              className="popup-close"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>

            <ContactSection />

          </div>

        </div>

      )}

    </>

  );

};

export default Testimonials;