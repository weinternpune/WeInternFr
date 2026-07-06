import React, { useState } from 'react';
import { usePhoneVerification } from '../../context/PhoneVerificationContext';
import toast from 'react-hot-toast';
import './PhoneVerificationModal.css';

const PhoneVerificationModal = () => {
  const {
    showVerificationModal,
    verificationStep,
    closeVerificationModal,
    submitPhoneNumber,
    submitOTP,
    submitInterests,
  } = usePhoneVerification();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const courses = [
    'Full Stack Development',
    'Frontend Development',
    'Backend Development',
    'Mobile App Development',
    'UI/UX Design',
    'Data Science',
    'Machine Learning',
    'Digital Marketing',
    'Cloud Computing',
    'DevOps',
  ];

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call backend API to send OTP
      // await API.post('/api/phone-verification/send-otp', { phone });
      
      setTimeout(() => {
        toast.success('OTP sent successfully!');
        submitPhoneNumber(phone);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call backend API to verify OTP
      // await API.post('/api/phone-verification/verify-otp', { phone, otp: otpString });
      
      setTimeout(() => {
        toast.success('Phone verified successfully!');
        submitOTP(otpString);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleInterestToggle = (course) => {
    setSelectedInterests((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const handleInterestsSubmit = (e) => {
    e.preventDefault();
    
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one course');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call backend API to save interests
      // await API.post('/api/phone-verification/save-interests', { phone, interests: selectedInterests });
      
      setTimeout(() => {
        toast.success('Your interests have been saved!');
        submitInterests(selectedInterests);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to save interests. Please try again.');
      setLoading(false);
    }
  };

  if (!showVerificationModal) return null;

  return (
    <div className="pv-overlay">
      <div className="pv-modal">
        <button className="pv-close" onClick={closeVerificationModal}>×</button>

        {verificationStep === 'phone' && (
          <div className="pv-content">
            <div className="pv-icon">📱</div>
            <h2 className="pv-title">Verify Your Phone Number</h2>
            <p className="pv-subtitle">Get full access to all our courses and content</p>

            <form onSubmit={handlePhoneSubmit}>
              <div className="pv-input-group">
                <label htmlFor="phone">Mobile Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter your 10-digit mobile number"
                  required
                  maxLength="10"
                  className="pv-input"
                />
              </div>

              <button type="submit" className="pv-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          </div>
        )}

        {verificationStep === 'otp' && (
          <div className="pv-content">
            <div className="pv-icon">🔐</div>
            <h2 className="pv-title">Enter OTP</h2>
            <p className="pv-subtitle">We've sent a 6-digit OTP to {phone}</p>

            <form onSubmit={handleOTPSubmit}>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    className="otp-box"
                    maxLength="1"
                    required
                  />
                ))}
              </div>

              <button type="submit" className="pv-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                className="pv-resend"
                onClick={() => handlePhoneSubmit({ preventDefault: () => {} })}
              >
                Resend OTP
              </button>
            </form>
          </div>
        )}

        {verificationStep === 'interests' && (
          <div className="pv-content">
            <div className="pv-icon">🎯</div>
            <h2 className="pv-title">Select Your Interests</h2>
            <p className="pv-subtitle">Choose courses you're interested in</p>

            <form onSubmit={handleInterestsSubmit}>
              <div className="interests-grid">
                {courses.map((course) => (
                  <button
                    key={course}
                    type="button"
                    className={`interest-btn ${selectedInterests.includes(course) ? 'selected' : ''}`}
                    onClick={() => handleInterestToggle(course)}
                  >
                    <span className="interest-check">
                      {selectedInterests.includes(course) ? '✓' : '+'}
                    </span>
                    {course}
                  </button>
                ))}
              </div>

              <button type="submit" className="pv-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Complete Verification'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerificationModal;
