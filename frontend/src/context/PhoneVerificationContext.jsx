import React, { createContext, useContext, useState, useEffect } from 'react';

const PhoneVerificationContext = createContext();

export const usePhoneVerification = () => {
  const context = useContext(PhoneVerificationContext);
  if (!context) {
    throw new Error('usePhoneVerification must be used within PhoneVerificationProvider');
  }
  return context;
};

export const PhoneVerificationProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userInterests, setUserInterests] = useState([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState('phone'); // 'phone', 'otp', 'interests'

  // Check if user is already verified (localStorage)
  useEffect(() => {
    const verified = localStorage.getItem('phoneVerified');
    const phone = localStorage.getItem('userPhone');
    const interests = localStorage.getItem('userInterests');
    
    if (verified === 'true') {
      setIsVerified(true);
      setPhoneNumber(phone || '');
      setUserInterests(interests ? JSON.parse(interests) : []);
    }
  }, []);

  const startVerification = () => {
    setShowVerificationModal(true);
    setVerificationStep('phone');
  };

  const closeVerificationModal = () => {
    setShowVerificationModal(false);
  };

  const submitPhoneNumber = (phone) => {
    setPhoneNumber(phone);
    setVerificationStep('otp');
  };

  const submitOTP = (otp) => {
    // Move to interests step
    setVerificationStep('interests');
  };

  const submitInterests = (interests) => {
    setUserInterests(interests);
    setIsVerified(true);
    
    // Save to localStorage
    localStorage.setItem('phoneVerified', 'true');
    localStorage.setItem('userPhone', phoneNumber);
    localStorage.setItem('userInterests', JSON.stringify(interests));
    
    setShowVerificationModal(false);
  };

  const resetVerification = () => {
    setIsVerified(false);
    setPhoneNumber('');
    setUserInterests([]);
    localStorage.removeItem('phoneVerified');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userInterests');
  };

  const value = {
    isVerified,
    phoneNumber,
    userInterests,
    showVerificationModal,
    verificationStep,
    startVerification,
    closeVerificationModal,
    submitPhoneNumber,
    submitOTP,
    submitInterests,
    resetVerification,
  };

  return (
    <PhoneVerificationContext.Provider value={value}>
      {children}
    </PhoneVerificationContext.Provider>
  );
};
