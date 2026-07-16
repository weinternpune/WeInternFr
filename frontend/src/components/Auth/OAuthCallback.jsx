import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('OAuth login failed. Please try again.');
      navigate('/login');
      return;
    }

    if (!token) {
      toast.error('No token received. Please try again.');
      navigate('/login');
      return;
    }

    const handleOAuth = async () => {
      try {
        // Save token
        localStorage.setItem('wi_token', token);

        // Get user profile using the token
        const res = await API.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          const user = res.data.data;
          localStorage.setItem('wi_user', JSON.stringify(user));
          login(user, token);
          toast.success(`Welcome, ${user.name}! 🎉`);

          // Redirect based on role
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
          throw new Error('Failed to get user profile');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        toast.error('Login failed. Please try again.');
        localStorage.removeItem('wi_token');
        navigate('/login');
      }
    };

    handleOAuth();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d1b2e, #1B2A4A)',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        width: 48, height: 48, border: '3px solid #18b45b',
        borderTopColor: 'transparent', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
        Completing login...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default OAuthCallback;
