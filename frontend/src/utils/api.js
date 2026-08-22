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
export const getDashboardStats = () => API.get('/user/dashboard-stats');
export const getDashboardAnalytics = () => API.get('/user/dashboard-analytics');
export const trackActivity = (data) => API.post('/user/track-activity', data);
export const initializeProgress = () => API.post('/user/initialize-progress');

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
export const getUserActivity = (userId) => API.get(`/admin/users/${userId}/activity`);

// Mentor
export const getMentorDashboard = (params) => API.get('/mentor/dashboard', { params });
export const getMentorStudents = (params) => API.get('/mentor/students', { params });
export const getMentorStudent = (studentId, params) => API.get(`/mentor/students/${studentId}`, { params });
export const getMentorClasses = (params) => API.get('/mentor/classes', { params });
export const createMentorClass = (data) => API.post('/mentor/classes', data);
export const updateMentorClassStatus = (id, status) => API.patch(`/mentor/classes/${id}/status`, { status });
export const getMentorAttendance = (params) => API.get('/mentor/attendance', { params });
export const saveMentorAttendance = (data) => API.post('/mentor/attendance/bulk', data);
export const getMentorAssignments = (params) => API.get('/mentor/assignments', { params });
export const createMentorAssignment = (data) => API.post('/mentor/assignments', data);
export const getMentorSubmissions = (params) => API.get('/mentor/submissions', { params });
export const reviewMentorSubmission = (id, data) => API.patch(`/mentor/submissions/${id}/review`, data);
export const getMentorProjects = (params) => API.get('/mentor/projects', { params });
export const updateMentorProject = (id, data) => API.patch(`/mentor/projects/${id}`, data);
export const getMentorMessages = (params) => API.get('/mentor/messages', { params });
export const sendMentorMessage = (data) => API.post('/mentor/messages', data);
export const sendMentorAnnouncement = (data) => API.post('/mentor/announcements', data);
export const getMentorNotifications = (params) => API.get('/mentor/notifications', { params });
export const markMentorNotificationRead = (id) => API.patch(`/mentor/notifications/${id}/read`);
export const getMentorReports = (params) => API.get('/mentor/reports', { params });
export const addMentorNote = (studentId, data) => API.post(`/mentor/students/${studentId}/notes`, data);
export const getMentorNotes = (studentId, params) => API.get(`/mentor/students/${studentId}/notes`, { params });
export const createMentorAccount = (data) => API.post('/mentor/admin/create', data);
export const deleteMentorAccount = (mentorId) => API.delete(`/mentor/admin/mentors/${mentorId}`);
export const assignStudentToMentor = (studentId, mentorId) => API.patch(`/mentor/admin/assign-student/${studentId}`, { mentorId });
export const assignStudentsBulk = (data) => API.post('/mentor/admin/assign-students', data);
export const getAdminStudentsWithMentors = () => API.get('/mentor/admin/students-with-mentors');
export const getAdminMentors = () => API.get('/mentor/admin/list');
export const updateAdminMentor = (id, data) => API.patch(`/mentor/admin/mentor/${id}`, data);
export const getAllMentorsOverview = () => API.get('/mentor/admin/all-mentors-overview');
export const getStudentMentorOverview = () => API.get('/mentor/student/mentor-overview');
export const getStudentMentorClasses = () => API.get('/mentor/student/classes');

export const getMentorProfile = (params) => API.get('/mentor/profile', { params });
export const updateMentorProfile = (data) => API.put('/mentor/profile', data);
export const getStudentMentorAssignments = () => API.get('/mentor/student/assignments');
export const submitStudentMentorAssignment = (id, data) => API.post(`/mentor/student/assignments/${id}/submit`, data);
export const getStudentMentorAttendance = () => API.get('/mentor/student/attendance');
export const getStudentMentorNotifications = () => API.get('/mentor/student/notifications');
export const getStudentMentorMessages = () => API.get('/mentor/student/messages');
export const sendStudentMentorMessage = (data) => API.post('/mentor/student/messages', data);

export const deleteAdminAccount = (id) => API.delete(`/admin/admins/${id}`);
export const deleteAdminEnrollment = (id) => API.delete(`/admin/enrollments/${id}`);
export const createMentorProject = (data) => API.post('/mentor/projects', data);
export const deleteMentorProject = (id) => API.delete(`/mentor/projects/${id}`);
export const getStudentProjects = () => API.get('/mentor/student/projects');
export const submitStudentProject = (id, data) => API.post(`/mentor/student/projects/${id}/submit`, data);
export const getStudentLiveClasses = () => API.get('/mentor/student/live-classes');
export const uploadMentorFile = (formData) => API.post('/mentor/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Blog
export const getBlogPosts = () => API.get('/blog');
export const getBlogPost = (slug) => API.get(`/blog/${slug}`);
export const getAdminBlogPosts = () => API.get('/blog/admin/all');
export const createBlogPost = (data) => API.post('/blog', data);
export const updateBlogPost = (id, data) => API.put(`/blog/${id}`, data);
export const deleteBlogPost = (id) => API.delete(`/blog/${id}`);

// ============================================================
// Cohort Application
// ============================================================

// Student: Submit cohort application
export const submitCohortApplication = (data) =>
  API.post('/cohort/book', data);

// Admin: Get all cohort applications
export const getAdminCohortApplications = () =>
  API.get('/cohort/admin/applications');

// Admin: Update cohort application status
export const updateCohortStatus = (id, status) =>
  API.patch(`/cohort/book/${id}/status`, { status });
