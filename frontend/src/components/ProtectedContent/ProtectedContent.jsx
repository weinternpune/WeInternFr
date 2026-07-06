import React, { useState, useEffect } from 'react';
import PhoneGate from '../PhoneGate/PhoneGate';
import './ProtectedContent.css';

const ProtectedContent = ({ children, enableTimer = true, delay = 15000 }) => {
  const [showPhoneGate, setShowPhoneGate] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    // Check if phone is already verified (for ANY user - logged in or not)
    const verified = localStorage.getItem('phoneVerified') === 'true';
    
    console.log('🔍 Phone Verification Check:', {
      verified,
      enableTimer,
      delay,
      timerStarted
    });
    
    if (verified) {
      console.log('✅ Phone already verified');
      setIsVerified(true);
      return;
    }

    console.log('❌ Phone NOT verified - starting timer');

    // Start timer to show phone gate after delay
    if (enableTimer && !timerStarted) {
      setTimerStarted(true);
      console.log(`⏰ Timer started - popup will show in ${delay/1000} seconds`);
      
      const timer = setTimeout(() => {
        console.log('🚀 Timer complete - showing phone gate!');
        setShowPhoneGate(true);
      }, delay);

      return () => {
        console.log('⏹️ Timer cleared');
        clearTimeout(timer);
      };
    }
  }, [enableTimer, delay, timerStarted]);

  const handlePhoneGateComplete = () => {
    console.log('✅ Phone verification complete!');
    setIsVerified(true);
    setShowPhoneGate(false);
  };

  // If phone verified, show normal content
  if (isVerified) {
    console.log('📱 Rendering: Normal content (verified)');
    return <>{children}</>;
  }

  // If phone gate should be shown, show it with blurred content
  if (showPhoneGate) {
    console.log('📱 Rendering: Phone gate with blur');
    return (
      <>
        <div className="content-blurred-wrapper">
          <div className="content-blurred">
            {children}
          </div>
        </div>
        <PhoneGate onComplete={handlePhoneGateComplete} />
      </>
    );
  }

  // Show blurred content while timer is running (before popup appears)
  console.log('📱 Rendering: Blurred content (waiting for timer)');
  return (
    <div className="content-blurred-wrapper">
      <div className="content-blurred">
        {children}
      </div>
    </div>
  );
};

export default ProtectedContent;
