import React, { useState } from "react";
import { saveLead } from "../../services/chatApi";
import { BsX } from "react-icons/bs";

export default function LeadForm({ onClose, onSuccess, onSkip }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_domain: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.preferred_domain) {
      setStatusMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await saveLead(formData);
      if (res.success) {
        const submittedName = formData.name;
        setStatusMessage({
          type: "success",
          text: `🎉 Thank you, ${submittedName}! Your application has been saved successfully in our database.`,
        });
        if (onSuccess) {
          onSuccess(submittedName);
        }
        setFormData({
          name: "",
          email: "",
          phone: "",
          preferred_domain: "",
        });
      } else {
        throw new Error(res.error || res.message || "Failed to submit lead.");
      }
    } catch (err) {
      const errorMessage = err?.message || String(err);
      setStatusMessage({
        type: "error",
        text: `Error submitting application: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkipClick = () => {
    if (onSkip) {
      onSkip();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div style={{
      position: "relative",
      maxWidth: "420px",
      width: "100%",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
      border: "1px solid #e2e8f0",
      fontFamily: "'Poppins', sans-serif",
      color: "#1e293b",
      boxSizing: "border-box"
    }}>
      {/* Top-Right X / Close Button */}
      <button
        type="button"
        onClick={handleSkipClick}
        title="Close registration form"
        aria-label="Close registration form"
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          color: "#475569",
          backgroundColor: "#f1f5f9",
          padding: "4px 10px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          border: "1px solid #cbd5e1",
          cursor: "pointer",
          zIndex: 10
        }}
      >
        <BsX size={18} />
        <span>Close</span>
      </button>

      <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "4px", paddingRight: "60px" }}>
        Apply for WeIntern Internship 🚀
      </h2>
      <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "18px" }}>
        Fill in your details below to register for our internship programs.
      </p>

      {statusMessage && (
        <div style={{
          padding: "12px",
          borderRadius: "10px",
          marginBottom: "14px",
          fontSize: "13px",
          backgroundColor: statusMessage.type === "success" ? "#f0fdf4" : "#fef2f2",
          color: statusMessage.type === "success" ? "#166534" : "#991b1b",
          border: statusMessage.type === "success" ? "1px solid #bbf7d0" : "1px solid #fecaca"
        }}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
            Full Name <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "9px 12px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
            Email Address <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "9px 12px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
            Phone Number <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "9px 12px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
            Preferred Domain <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select
            name="preferred_domain"
            value={formData.preferred_domain}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "9px 12px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              outline: "none",
              boxSizing: "border-box",
              backgroundColor: "#ffffff"
            }}
          >
            <option value="">Select a domain...</option>
            <option value="Full Stack Web Development">Full Stack Web Development</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="AI & Automation">AI & Automation</option>
            <option value="Data Science & Analytics">Data Science & Analytics</option>
            <option value="Python Programming">Python Programming</option>
            <option value="Java Programming">Java Programming</option>
            <option value="C/C++ Programming">C/C++ Programming</option>
            <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
            <option value="DevOps Engineering">DevOps Engineering</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Digital Marketing & SEO">Digital Marketing & SEO</option>
            <option value="Video Editing & Content Creation">Video Editing & Content Creation</option>
            <option value="Full Stack Development">Full Stack Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Cyber Security">Cyber Security</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "6px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {loading ? "Submitting..." : "🚀 Submit Application"}
          </button>

          <button
            type="button"
            onClick={handleSkipClick}
            style={{
              width: "100%",
              backgroundColor: "#f1f5f9",
              color: "#334155",
              fontWeight: 500,
              padding: "9px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            ⏩ Skip Registration / Continue without Registration
          </button>
        </div>
      </form>
    </div>
  );
}
