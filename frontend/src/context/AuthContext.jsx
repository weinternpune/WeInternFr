import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('wi_token');
    const savedUser = localStorage.getItem('wi_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Re-validate token
      getProfile()
        .then(res => {
          setUser(res.data.data);
          localStorage.setItem('wi_user', JSON.stringify(res.data.data));
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('wi_token', token);
    localStorage.setItem('wi_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('wi_token');
    localStorage.removeItem('wi_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
