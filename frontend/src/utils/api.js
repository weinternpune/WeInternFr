import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  withCredentials: true
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('wi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wi_token');
      localStorage.removeItem('wi_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const resendOTP = (data) => API.post('/auth/resend-otp', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);

// User
export const getProfile = () => API.get('/user/profile');
export const updateProfile = (data) => API.put('/user/profile', data);
export const changePassword = (data) => API.put('/user/change-password', data);

// Applications
export const submitApplication = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my');

// Courses
export const enrollCourse = (data) => API.post('/courses/enroll', data);
export const getMyEnrollments = () => API.get('/courses/my');

// Payments
export const createOrder = (data) => API.post('/payments/create-order', data);
export const verifyPayment = (data) => API.post('/payments/verify', data);

// Contact
export const submitHireRequest = (data) => API.post('/contact/hire', data);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminApplications = (params) => API.get('/admin/applications', { params });
export const updateApplicationStatus = (id, data) => API.patch(`/admin/applications/${id}`, data);
export const getAdminEnrollments = (params) => API.get('/admin/enrollments', { params });
export const getAdminHireRequests = () => API.get('/admin/hire-requests');
export const updateHireRequest = (id, data) => API.patch(`/admin/hire-requests/${id}`, data);
export const getAdminUsers = (params) => API.get('/admin/users', { params });
