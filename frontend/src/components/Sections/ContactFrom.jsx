import "./ContactFrom.css";

export default function ContactSection() {
  return (
    <section className="contact-section">

      <div className="contact-wrapper">

        {/* LEFT SIDE */}

        <div className="contact-left">

          <div className="tag">
            CONTACT US
          </div>

          <h1>
            Let's Build Your
            <span>Career Journey</span>
          </h1>

          <p className="desc">
            Have questions about internships, courses,
            or placements? Our team is here to
            help you.
          </p>

          <div className="green-line"></div>

          {/* CARD 1 */}

          <div className="info-card">

            <div className="icon-box">
              ✉
            </div>

            <div>
              <h3>Email</h3>
              <p>support@weintern.in</p>
            </div>

          </div>

          {/* CARD 2 */}

          <div className="info-card">

            <div className="icon-box">
              ☎
            </div>

            <div>
              <h3>Phone</h3>
              <p>+91 7414974582</p>
            </div>

          </div>

          {/* CARD 3 */}

          <div className="info-card">

            <div className="icon-box">
              📍
            </div>

            <div>
              <h3>Location</h3>
              <p>Pune , Maharashtra, India</p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="contact-right">

          <h2>Send us a Message</h2>

          <div className="title-line"></div>

          <form>

            <div className="form-grid">

              <div className="input-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your name" required />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" required/>
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <input type="text" placeholder="Enter your number" required/>
              </div>

              <div className="input-group">
                <label>Subject</label>
                <input type="text" placeholder="Enter subject" required/>
              </div>

              <div className="input-group full-width">
                <label>Your Message</label>

                <textarea placeholder="Write your message here..." required></textarea>
              </div>

            </div>

            <button className="send-btn">
              Send Message →
            </button>

            <div className="privacy">
              🛡 We respect your privacy. Your information is safe with us.
            </div>

          </form>

        </div>

      </div>

    </section>
  );
}