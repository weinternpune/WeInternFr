import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAdminStats } from '../utils/api';
import toast from 'react-hot-toast';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadStats = useCallback(async (showToast = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await getAdminStats();
      
      setStats(response.data.data);
      setLastUpdated(new Date());
      
      if (showToast) {
        toast.success('Data updated');
      }
    } catch (error) {
      console.error('Failed to load admin stats:', error);
      if (showToast) {
        toast.error('Failed to update data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(() => {
    loadStats(true);
  }, [loadStats]);

  // Event-driven updates for real-time sync (when user performs actions)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'admin_data_updated') {
        loadStats(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadStats]);

  // Trigger update across tabs when data changes
  const triggerGlobalUpdate = () => {
    localStorage.setItem('admin_data_updated', Date.now().toString());
    localStorage.removeItem('admin_data_updated'); // Trigger storage event
  };

  const value = {
    stats,
    loading,
    lastUpdated,
    loadStats,
    refreshStats,
    triggerGlobalUpdate
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};