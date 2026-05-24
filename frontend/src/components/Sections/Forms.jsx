import React, { useState } from "react";
import { submitHireRequest } from "../../utils/api";
import toast from "react-hot-toast";
import "./Forms.css";

export const ApplySection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitHireRequest({
        ...form,
        company: "Contact Form",
        services: ["General Inquiry"],
        budget: "N/A",
        description: form.message,
      });
      setDone(true);
      toast.success("✅ Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="apply-section" id="apply">
      <div className="container">
        <div className="section-label">Join Our Internship</div>
        <h2 className="section-title">Join as Intern</h2>
        <p className="section-sub">
          Apply for our Summer Internship program and gain real-world experience
          working on live client projects. We'll get back to you within 24
          hours.
        </p>
        <div className="the-form">
          {done && (
            <div className="contact-success">
              🎉 Thank you! We've received your application and will respond
              shortly.
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="contact-actions">
            <a
              href="https://forms.gle/LxGku72rwGYXsLpr7"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-lg btn-glow"
            >
              Apply for Summer Internship →
            </a>
            <a
              href="https://wa.me/917414974582"
              target="_blank"
              rel="noreferrer"
              className="whatsapp-btn"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
          <p className="form-note">
            ✓ Response within 24 hours · ✓ Free consultation · ✓ No obligation
          </p>
        </div>
      </div>
    </section>
  );
};
