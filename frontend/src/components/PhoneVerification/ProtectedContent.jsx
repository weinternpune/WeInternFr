import React from 'react';
import { usePhoneVerification } from '../../context/PhoneVerificationContext';
import './ProtectedContent.css';

const ProtectedContent = ({ children, allowedPaths = [] }) => {
  const { isVerified, startVerification } = usePhoneVerification();
  
  // Check if current path is allowed without verification
  const currentPath = window.location.pathname;
  const isAllowedPath = allowedPaths.some(path => currentPath.includes(path));

  // If verified or on allowed path, show content normally
  if (isVerified || isAllowedPath) {
    return <>{children}</>;
  }

  // Otherwise, show blurred content with verification prompt
  return (
    <div className="protected-content-wrapper">
      <div className="protected-content-blur">
        {children}
      </div>
      <div className="protected-content-overlay">
        <div className="protected-content-card">
          <div className="protected-icon">🔒</div>
          <h3>Unlock Full Access</h3>
          <p>Verify your phone number to access all our courses and content</p>
          <button className="protected-unlock-btn" onClick={startVerification}>
            Unlock Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedContent;
