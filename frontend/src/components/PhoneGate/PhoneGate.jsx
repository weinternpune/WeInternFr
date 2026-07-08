/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import './PhoneGate.css';

const PhoneGate = ({ onComplete }) => {
  const [step, setStep] = useState('phone'); // phone, otp, interests
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const interests = [
    { id: 'fullstack', name: 'Full Stack Development', icon: '💻' },
    { id: 'mobile', name: 'Mobile App Development', icon: '📱' },
    { id: 'ai', name: 'AI & Automation', icon: '🤖' },
    { id: 'cloud', name: 'Cloud & DevOps', icon: '☁️' },
    { id: 'data', name: 'Data Science', icon: '📊' },
    { id: 'design', name: 'UI/UX Design', icon: '🎨' },
    { id: 'marketing', name: 'Digital Marketing', icon: '📈' },
    { id: 'business', name: 'Business Analytics', icon: '💼' },
  ];

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    console.log('📤 Sending OTP for phone:', phone);
    setLoading(true);
    try {
      // Send OTP via backend
      const response = await API.post('/auth/send-phone-otp', { phone });
      console.log('✅ OTP sent response:', response.data);
      
      // In development, show OTP in alert if available
      if (response.data.otp) {
        console.log('🔢 Development OTP:', response.data.otp);
        alert(`🔢 DEVELOPMENT MODE\n\nYour OTP is: ${response.data.otp}\n\nThis is only shown in development mode.\nCheck backend console for OTP.`);
      } else {
        console.log('📝 Check backend console for OTP');
      }
      
      setOtpSent(true);
      setStep('otp');
      toast.success('OTP sent! Check backend console');
    } catch (error) {
      console.error('❌ Send OTP error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    console.log('📤 Verifying OTP...');
    console.log('📞 Phone:', phone);
    console.log('🔢 OTP:', otp);
    
    setLoading(true);
    try {
      // Verify OTP via backend
      const response = await API.post('/auth/verify-phone-otp', { phone, otp });
      console.log('✅ OTP verified:', response.data);
      setStep('interests');
      toast.success('Phone number verified successfully!');
    } catch (error) {
      console.error('❌ Verify OTP error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleInterestToggle = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleComplete = async () => {
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }

    setLoading(true);
    try {
      // Save interests and mark as verified
      await API.post('/auth/save-interests', { 
        phone, 
        interests: selectedInterests 
      });
      
      // Store verification status in localStorage
      localStorage.setItem('phoneVerified', 'true');
      localStorage.setItem('verifiedPhone', phone);
      
      toast.success('All set! You can now access all content');
      onComplete();
    } catch (error) {
      toast.error('Failed to save interests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone-gate-overlay">
      <div className="phone-gate-modal">
        {step === 'phone' && (
          <div className="pg-step">
            <div className="pg-header">
              <div className="pg-icon">📱</div>
              <h2>Unlock Full Access</h2>
              <p>Verify your mobile number to explore all our programs and get personalized recommendations</p>
            </div>
            
            <div className="pg-body">
              <div className="pg-input-group">
                <label>Mobile Number</label>
                <div className="pg-phone-input">
                  <span className="pg-country-code">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                    autoFocus
                  />
                </div>
              </div>

              <button 
                className="pg-btn-primary" 
                onClick={handleSendOTP}
                disabled={loading || phone.length !== 10}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>

              <div className="pg-benefits">
                <div className="pg-benefit-item">
                  <span className="pg-benefit-icon">✓</span>
                  <span>Access all course details</span>
                </div>
                <div className="pg-benefit-item">
                  <span className="pg-benefit-icon">✓</span>
                  <span>Get personalized recommendations</span>
                </div>
                <div className="pg-benefit-item">
                  <span className="pg-benefit-icon">✓</span>
                  <span>Receive important updates</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="pg-step">
            <div className="pg-header">
              <div className="pg-icon">🔐</div>
              <h2>Verify OTP</h2>
              <p>Enter the 6-digit OTP sent to +91 {phone}</p>
              <button className="pg-edit-phone" onClick={() => setStep('phone')}>
                Edit Number
              </button>
            </div>
            
            <div className="pg-body">
              <div className="pg-input-group">
                <label>Enter OTP</label>
                <input
                  type="tel"
                  className="pg-otp-input"
                  placeholder="000000"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                  autoFocus
                />
              </div>

              <button 
                className="pg-btn-primary" 
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button className="pg-btn-link" onClick={handleSendOTP} disabled={loading}>
                Didn't receive OTP? Resend
              </button>
            </div>
          </div>
        )}

        {step === 'interests' && (
          <div className="pg-step">
            <div className="pg-header">
              <div className="pg-icon">🎯</div>
              <h2>What interests you?</h2>
              <p>Select the programs you're interested in to get personalized content</p>
            </div>
            
            <div className="pg-body">
              <div className="pg-interests-grid">
                {interests.map(interest => (
                  <button
                    key={interest.id}
                    className={`pg-interest-card ${selectedInterests.includes(interest.id) ? 'selected' : ''}`}
                    onClick={() => handleInterestToggle(interest.id)}
                  >
                    <span className="pg-interest-icon">{interest.icon}</span>
                    <span className="pg-interest-name">{interest.name}</span>
                    {selectedInterests.includes(interest.id) && (
                      <span className="pg-interest-check">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <button 
                className="pg-btn-primary" 
                onClick={handleComplete}
                disabled={loading || selectedInterests.length === 0}
              >
                {loading ? 'Saving...' : `Continue with ${selectedInterests.length} interest${selectedInterests.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneGate;
