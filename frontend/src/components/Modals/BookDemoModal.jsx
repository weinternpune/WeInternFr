import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './BookDemoModal.css';

const BookDemoModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bdm-overlay" onClick={onClose}>
        <div className="bdm-modal bdm-success" onClick={(e) => e.stopPropagation()}>
          <div className="bdm-success-icon">
            <Icon icon="mdi:check-circle" width={64} height={64} />
          </div>
          <h2 className="bdm-success-title">Successfully Submitted!</h2>
          <p className="bdm-success-text">
            Thank you for booking a demo. Our team will contact you within 24 hours.
          </p>
          <button className="bdm-btn bdm-btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bdm-overlay" onClick={onClose}>
      <div className="bdm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="bdm-close" onClick={onClose} aria-label="Close modal">
          <Icon icon="mdi:close" width={24} height={24} />
        </button>

        <div className="bdm-header">
          <Icon icon="mdi:video-outline" width={32} height={32} className="bdm-header-icon" />
          <h2 className="bdm-title">Book A Demo</h2>
          <p className="bdm-subtitle">
            Schedule a free demo session with our experts to explore how WeIntern can accelerate your career.
          </p>
        </div>

        <form className="bdm-form" onSubmit={handleSubmit}>
          <div className="bdm-field">
            <label className="bdm-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="bdm-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bdm-field">
            <label className="bdm-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="bdm-input"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bdm-field">
            <label className="bdm-label">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              className="bdm-input"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              maxLength="10"
            />
          </div>

          <div className="bdm-field">
            <label className="bdm-label">Interested Course *</label>
            <select
              name="course"
              className="bdm-input bdm-select"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Select a course</option>
              <option value="Full Stack Web Development">Full Stack Web Development</option>
              <option value="Data Science & Analytics">Data Science & Analytics</option>
              <option value="AI & Automation">AI & Automation</option>
              <option value="Cloud Solutions & DevOps">Cloud Solutions & DevOps</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Python Programming">Python Programming</option>
              <option value="Java Programming">Java Programming</option>
              <option value="C/C++ Programming">C/C++ Programming</option>
              <option value="DevOps Engineering">DevOps Engineering</option>
              <option value="Video Editing & Content Creation">Video Editing & Content Creation</option>
            </select>
          </div>

          <div className="bdm-field">
            <label className="bdm-label">Message (Optional)</label>
            <textarea
              name="message"
              className="bdm-input bdm-textarea"
              placeholder="Tell us about your goals and what you'd like to learn..."
              value={formData.message}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="bdm-btn bdm-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icon icon="mdi:loading" className="bdm-spinner" width={18} height={18} />
                Submitting...
              </>
            ) : (
              <>
                Submit Request
                <Icon icon="mdi:arrow-right" width={18} height={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookDemoModal;
