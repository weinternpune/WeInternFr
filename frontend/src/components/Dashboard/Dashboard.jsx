import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CoursesContext';
import {
  getMyApplications, getMyEnrollments, updateProfile, getDashboardStats,
  getDashboardAnalytics, trackActivity, getStudentMentorClasses,
  getStudentLiveClasses, getStudentMentorAssignments, submitStudentMentorAssignment,
  getStudentProjects, submitStudentProject
} from '../../utils/api';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';
import AssignmentsTab from './AssignmentsTab';
import MyMentorTab from './MyMentorTab';
import AttendanceTab from './AttendanceTab';

const statusBadge = (s) => (
  <span className={`badge-status badge-${s}`}>{s?.charAt(0).toUpperCase() + s?.slice(1)}</span>
);

// SVG Icons (realistic, no emoji)
const Icons = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  mentor: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  attendance: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>,
  applications: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  mycourses: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  allcourses: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  sessions: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  practice: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  certificate: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  profile: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  star: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  trophy: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
  clock: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  target: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  flame: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>,
  book: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  video: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  code: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  award: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  assignments: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>,
  projects: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

const TABS = [
  { id: 'overview',     icon: Icons.home,         label: 'Overview', section: 'main' },
  { id: 'analytics',    icon: Icons.analytics,    label: 'Analytics', section: 'main' },
  { id: 'mentor',       icon: Icons.mentor,       label: 'My Mentor', section: 'learning' },
  { id: 'assignments',  icon: Icons.assignments,  label: 'Assignments', section: 'learning' },
  { id: 'projects',     icon: Icons.projects,     label: 'Capstone Projects', section: 'learning' },
  { id: 'attendance',   icon: Icons.attendance,   label: 'Attendance', section: 'learning' },
  { id: 'applications', icon: Icons.applications, label: 'My Applications', section: 'learning' },
  { id: 'mycourses',    icon: Icons.mycourses,    label: 'My Courses', section: 'learning' },
  { id: 'allcourses',   icon: Icons.allcourses,   label: 'Browse Courses', section: 'learning' },
  { id: 'sessions',     icon: Icons.sessions,     label: 'Live Sessions', section: 'learning' },
  { id: 'practice',     icon: Icons.practice,     label: 'Practice', section: 'learning' },
  { id: 'certificates', icon: Icons.certificate,  label: 'Certificates', section: 'account' },
  { id: 'profile',      icon: Icons.profile,      label: 'Profile', section: 'account' },
];

const Dashboard = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [mentorClasses, setMentorClasses] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalStudyHours: 0,
    currentStreak: 0,
    sessionsAttended: 0,
    attendanceRate: 0,
    assignmentsCompleted: 0,
    averageScore: 0,
    practiceProblems: { solved: 0, total: 6 }
  });
  const [analyticsData, setAnalyticsData] = useState({
  weeklyActivity: [],
  dailyHours: [],
  assignmentScores: [],
  practiceResults: [],
  courseProgress: [],
  overallProgress: [],
  recentActivities: [],
  sessionHistory: []
});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

 useEffect(() => {
  if (!user) {
    navigate('/login');
    return;
  }

  const loadDashboard = async () => {
    try {
      const results = await Promise.allSettled([
        getMyApplications(),
        getMyEnrollments(),
        getDashboardStats(),
        getDashboardAnalytics(),
        getStudentMentorClasses()
      ]);

      const [
        appsResult,
        enrollmentsResult,
        statsResult,
        analyticsResult,
        mentorClassesResult
      ] = results;

      if (appsResult.status === 'fulfilled') {
        setApplications(
          appsResult.value.data.data || []
        );
      } else {
        console.error(
          'Applications failed:',
          appsResult.reason
        );
      }

      if (enrollmentsResult.status === 'fulfilled') {
        setEnrollments(
          enrollmentsResult.value.data.data || []
        );
      } else {
        console.error(
          'Enrollments failed:',
          enrollmentsResult.reason
        );
      }

      if (statsResult.status === 'fulfilled') {
        setDashboardStats(
          statsResult.value.data.data
        );
      } else {
        console.error(
          'Dashboard stats failed:',
          statsResult.reason
        );
      }

      if (analyticsResult.status === 'fulfilled') {
        setAnalyticsData(
          analyticsResult.value.data.data
        );
      } else {
        console.error(
          'Analytics failed:',
          analyticsResult.reason
        );
      }

      if (mentorClassesResult.status === 'fulfilled') {
        setMentorClasses(mentorClassesResult.value.data.data || []);
      }

    } catch (error) {
      console.error(
        'Dashboard loading error:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, [user, navigate]);

  useEffect(() => {

  if (!user) return;

  const refreshDashboard = async () => {
  try {
    const results = await Promise.allSettled([
      getMyApplications(),
      getMyEnrollments(),
      getDashboardStats(),
      getDashboardAnalytics(),
      getStudentMentorClasses()
    ]);

    const [
      appsResult,
      enrollmentsResult,
      statsResult,
      analyticsResult,
      mentorClassesResult
    ] = results;

    if (appsResult.status === 'fulfilled') {
      setApplications(
        appsResult.value.data.data || []
      );
    }

    if (enrollmentsResult.status === 'fulfilled') {
      setEnrollments(
        enrollmentsResult.value.data.data || []
      );
    }

    if (statsResult.status === 'fulfilled') {
      setDashboardStats(
        statsResult.value.data.data
      );
    }

    if (analyticsResult.status === 'fulfilled') {
      setAnalyticsData(
        analyticsResult.value.data.data
      );
    }

    if (mentorClassesResult.status === 'fulfilled') {
      setMentorClasses(mentorClassesResult.value.data.data || []);
    }

  } catch (error) {
    console.error(
      'Dashboard refresh failed:',
      error
    );
  }
};

}, [user]);

  const handleLogout = () => { logout(); navigate('/'); };

  const refreshEnrollments = () => {
    getMyEnrollments().then(r => setEnrollments(r.data.data)).catch(() => {});
  };

  if (!user) return null;
  if (loading) return (
    <div className="dash-loading">
      <div className="dash-spinner-large" />
      <p>Loading your dashboard...</p>
    </div>
  );

  const currentTab = TABS.find(t => t.id === tab);

  const dashboardContent = (
    <div className="dashboard">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="dash-sidebar-top">
          <Link to="/" className="dash-logo-link">
            <img src="/welogo.png" alt="WeIntern" className="dash-logo" />
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>×</button>
        </div>

        <div className="dash-user-card">
          <div className="dash-avatar-lg">
            {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name?.[0]?.toUpperCase()}
          </div>
          <div className="dash-user-details">
            <div className="dash-user-name">{user.name}</div>
            <div className="dash-user-email">{user.email}</div>
            <div className="dash-user-badge">
              <span className="dub-dot" />
              Student
            </div>
          </div>
        </div>

        <div className="dash-sidebar-content">
          <div>
            <div className="dash-nav-section">
              <div className="dns-label">Main</div>
              {TABS.filter(t => t.section === 'main').map(t => (
                <button key={t.id} className={`dash-nav-item${tab === t.id ? ' active' : ''}`}
                  onClick={() => { setTab(t.id); setSidebarOpen(false); }}>
                  <span className="dni-icon">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div className="dash-nav-section">
              <div className="dns-label">Mentorship & Learning</div>
              {TABS.filter(t => t.section === 'learning').map(t => (
                <button key={t.id} className={`dash-nav-item${tab === t.id ? ' active' : ''}`}
                  onClick={() => { setTab(t.id); setSidebarOpen(false); }}>
                  <span className="dni-icon">{t.icon}</span>
                  <span>{t.label}</span>
                  {t.id === 'mycourses' && enrollments.length > 0 && (
                    <span className="dns-badge">{enrollments.length}</span>
                  )}
                  {t.id === 'applications' && applications.length > 0 && (
                    <span className="dns-badge">{applications.length}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="dash-nav-section">
              <div className="dns-label">Account</div>
              {TABS.filter(t => t.section === 'account').map(t => (
                <button key={t.id} className={`dash-nav-item${tab === t.id ? ' active' : ''}`}
                  onClick={() => { setTab(t.id); setSidebarOpen(false); }}>
                  <span className="dni-icon">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleLogout} className="dash-logout">
            <span className="dni-icon">{Icons.logout}</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="dash-header-left">
            <div className="dash-header-icon">{currentTab?.icon}</div>
            <div>
              <div className="dash-header-title">{currentTab?.label}</div>
              <div className="dash-header-sub">Welcome back, {user.name?.split(' ')[0]}</div>
            </div>
          </div>
          <div className="dash-header-right">
            <Link to="/" className="dash-home-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              Home
            </Link>
          </div>
        </header>

        <div className="dash-content">
          {tab === 'overview'      && <OverviewTab user={user} applications={applications} enrollments={enrollments} dashboardStats={dashboardStats} analyticsData={analyticsData} mentorClasses={mentorClasses} setTab={setTab} />}
          {tab === 'analytics'     && <AnalyticsTab enrollments={enrollments} applications={applications} dashboardStats={dashboardStats} analyticsData={analyticsData} />}
          {tab === 'mentor'        && <MyMentorTab user={user} setTab={setTab} />}
          {tab === 'assignments'   && <AssignmentsTab />}
          {tab === 'projects'      && <StudentProjectsTab />}
          {tab === 'attendance'    && <AttendanceTab setTab={setTab} />}
          {tab === 'applications'  && <ApplicationsTab applications={applications} />}
          {tab === 'mycourses'     && <MyCoursesTab enrollments={enrollments} analyticsData={analyticsData} refresh={refreshEnrollments} />}
          {tab === 'allcourses'    && <AllCoursesTab />}
          {tab === 'sessions'      && <LiveSessionsTab dashboardStats={dashboardStats} />}
          {tab === 'practice'      && <PracticeTab dashboardStats={dashboardStats} analyticsData={analyticsData} />}
          {tab === 'certificates'  && <CertificatesTab enrollments={enrollments} />}
          {tab === 'profile'       && <ProfileTab user={user} setUser={setUser} />}
        </div>
      </main>
    </div>
  );

  return dashboardContent;
};

// ── Overview ────────────────────────────────────────────
const OverviewTab = ({ user, applications, enrollments, dashboardStats, analyticsData, mentorClasses, setTab }) => {
  const accepted = applications.filter(a => a.status === 'accepted').length;
  const activeEnrollments = enrollments.filter(
    e => e.paymentStatus === 'paid' || e.paymentStatus?.startsWith('emi') || e.amountPaid > 0
  );

  const STATS = [
    { icon: Icons.book,    val: activeEnrollments.length, label: 'Enrolled',      color: '#2196C9', bg: '#e3f2fd' },
    { icon: Icons.trophy,  val: accepted,            label: 'Accepted',      color: '#27ae60', bg: '#e8f5e9' },
    { icon: Icons.clock,   val: `${dashboardStats.totalStudyHours}h`,              label: 'Hours Logged',  color: '#E8A820', bg: '#fff8e1' },
    { icon: Icons.target,  val: `${dashboardStats.attendanceRate}%`,               label: 'Attendance',    color: '#6c3483', bg: '#f3e5f5' },
    { icon: Icons.flame,   val: dashboardStats.currentStreak,                label: 'Day Streak',    color: '#e67e22', bg: '#fff3e0' },
    { icon: Icons.video,   val: dashboardStats.sessionsAttended,                label: 'Sessions Done', color: '#1e8449', bg: '#e8f5e9' },
  ];

  return (
    <div className="overview-wrap">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="wb-left">
          <div className="wb-greeting">Good day, {user.name?.split(' ')[0]}! 👋</div>
          <h2 className="wb-title">Ready to build your future today?</h2>
          <p className="wb-sub">You have {activeEnrollments.length} confirmed enrollment{activeEnrollments.length !== 1 ? 's' : ''} and {accepted} accepted application{accepted !== 1 ? 's' : ''}.</p>
          <div className="wb-btns">
            <button onClick={() => setTab('allcourses')} className="wb-btn-primary">Browse Courses</button>
            <button onClick={() => setTab('sessions')} className="wb-btn-outline">Join Live Session</button>
          </div>
        </div>
        <div className="wb-right">
          <div className="wb-stat-ring">
            <svg viewBox="0 0 120 120" width="120" height="120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="white" strokeWidth="10"
                strokeDasharray={`${(Math.min(dashboardStats.totalStudyHours, 100)/100)*314} 314`} strokeLinecap="round"
                transform="rotate(-90 60 60)" />
            </svg>
            <div className="wb-ring-text"><strong>{Math.min(Math.round(dashboardStats.totalStudyHours), 100)}%</strong><small>Study Progress</small></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="ud-stats-grid">
        {STATS.map(s => (
          <div key={s.label} className="ud-stat-card" style={{ '--accent': s.color, '--bg': s.bg }}>
            <div className="ud-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="ud-stat-body">
              <div className="ud-stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="ud-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="overview-grid">
        <div className="overview-card">
          <div className="oc-header"><h3>Recent Applications</h3>
            <button className="oc-link" onClick={() => setTab('applications')}>View All</button>
          </div>
          {applications.length === 0 ? (
            <div className="oc-empty">
              <div className="oc-empty-icon">{Icons.applications}</div>
              <p>No applications yet</p>
              <a href="/#apply" className="wb-btn-primary" style={{ fontSize:'.82rem', padding:'.5rem 1.2rem' }}>Apply Now</a>
            </div>
          ) : applications.slice(0,4).map(a => (
            <div key={a._id} className="oc-row">
              <div className="oc-row-icon" style={{ background:'#e3f2fd', color:'#2196C9' }}>{Icons.applications}</div>
              <div className="oc-row-info"><strong>{a.interest}</strong><span>{a.duration === '3months' ? '3-Month' : '6-Month'} · {a.college}</span></div>
              {statusBadge(a.status)}
            </div>
          ))}
        </div>

        <div className="overview-card">
          <div className="oc-header"><h3>My Confirmed Courses</h3>
            <button className="oc-link" onClick={() => setTab('mycourses')}>View All</button>
          </div>
          {activeEnrollments.length === 0 ? (
            <div className="oc-empty">
              <div className="oc-empty-icon">{Icons.book}</div>
              <p>No confirmed courses yet</p>
              <button onClick={() => setTab('allcourses')} className="wb-btn-primary" style={{ fontSize:'.82rem', padding:'.5rem 1.2rem' }}>Browse Courses</button>
            </div>
          ) : activeEnrollments.slice(0,4).map(e => (
            <div key={e._id} className="oc-row">
              <div className="oc-row-icon" style={{ background:'#e8f5e9', color:'#27ae60' }}>{Icons.book}</div>
              <div className="oc-row-info"><strong>{e.courseName}</strong><span>{e.college}</span></div>
              {statusBadge(e.paymentStatus)}
            </div>
          ))}
        </div>

        <div className="overview-card">
          <div className="oc-header"><h3>My Mentor Classes</h3><span className="oc-link" onClick={() => setTab('sessions')} style={{cursor:'pointer'}}>View Schedule →</span></div>
          {mentorClasses?.length ? mentorClasses.slice(0,4).map((s) => (
            <div key={s._id} className="session-row">
              <div className="sr-dot" style={{ background: s.status === 'live' ? '#27ae60' : '#E8A820' }} />
              <div className="sr-info"><strong>{s.title}</strong><span>{new Date(s.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})} · {s.startTime}–{s.endTime} · {s.mentor?.name || 'Mentor'}</span></div>
              {s.status === 'live'
                ? <a href={s.meetingLink || '#'} target="_blank" rel="noreferrer" className="sr-live">● JOIN LIVE</a>
                : s.meetingLink ? <a href={s.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: '.75rem', color: '#1d4ed8', fontWeight: 600, textDecoration: 'none' }}>Link ↗</a> : <span className="sr-upcoming">{s.status === 'completed' ? 'Done' : 'Scheduled'}</span>}
            </div>
          )) : (
            <div className="oc-empty"><div className="oc-empty-icon">{Icons.sessions}</div><p>No mentor classes scheduled yet.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Analytics ────────────────────────────────────────────
const AnalyticsTab = ({ enrollments, applications, dashboardStats, analyticsData }) => {
  const {
    weeklyActivity = [],
    assignmentScores = [],
    overallProgress = [],
    dailyHours = [],
    courseProgress = []
  } = analyticsData || {};

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
      <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', boxShadow:'var(--sh)', fontSize:'.8rem' }}>
        <p style={{ fontWeight:700, color:'var(--navy)', marginBottom:3 }}>{label}</p>
        {payload.map((p, i) => <p key={i} style={{ color:p.color, margin:'2px 0' }}>{p.name}: <strong>{p.value}</strong></p>)}
      </div>
    );
    return null;
  };

  return (
    <div className="analytics-wrap">
      <div className="an-kpi-row">
        {[
          { label:'Total Study Hours', val:`${dashboardStats.totalStudyHours}h`,   icon: Icons.clock,   color:'#E8A820', bg:'#fff8e1', trend:'+0h this week' },
          { label:'Avg Score',         val:`${dashboardStats.averageScore}%`,  icon: Icons.target,  color:'#2196C9', bg:'#e3f2fd', trend:`${dashboardStats.assignmentsCompleted} assignments` },
          { label:'Attendance Rate',   val:`${dashboardStats.attendanceRate}%`,    icon: Icons.video,   color:'#27ae60', bg:'#e8f5e9', trend:`${dashboardStats.sessionsAttended} sessions attended` },
          { label:'Current Streak',    val:`${dashboardStats.currentStreak} days`,icon: Icons.flame,   color:'#e67e22', bg:'#fff3e0', trend:dashboardStats.currentStreak > 0 ? 'Keep going!' : 'Start your streak!' },
        ].map(k => (
          <div key={k.label} className="an-kpi-card" style={{ '--kc': k.color, '--kb': k.bg }}>
            <div className="an-kpi-icon" style={{ background: k.bg, color: k.color }}>{k.icon}</div>
            <div>
              <div className="an-kpi-val" style={{ color: k.color }}>{k.val}</div>
              <div className="an-kpi-label">{k.label}</div>
              <div className="an-kpi-trend">{k.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="an-row">
        <div className="an-chart-card an-large">
          <div className="an-chart-header"><h3>Weekly Learning Activity</h3><span>Last 8 weeks</span></div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyActivity} margin={{ top:10, right:10, left:-20, bottom:0 }}>
              <defs>
                {[['lg','#2196C9'],['pr','#E8A820'],['se','#27ae60']].map(([id,c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
              <XAxis dataKey="week" tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <Area type="monotone" dataKey="lectures" stroke="#2196C9" strokeWidth={2} fill="url(#lg)" name="Lectures" dot={{ r:3 }} />
              <Area type="monotone" dataKey="practice" stroke="#E8A820" strokeWidth={2} fill="url(#pr)" name="Practice" dot={{ r:3 }} />
              <Area type="monotone" dataKey="sessions" stroke="#27ae60" strokeWidth={2} fill="url(#se)" name="Sessions" dot={{ r:3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="an-chart-card an-small">
          <div className="an-chart-header"><h3>Overall Progress</h3></div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={overallProgress} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {overallProgress.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [v + '%', '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {overallProgress.map(s => (
              <div key={s.name} className="pie-legend-item">
                <div className="pie-dot" style={{ background: s.color }} />
                <span>{s.name}</span><strong>{s.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="an-row">
        <div className="an-chart-card" style={{ flex:1 }}>
          <div className="an-chart-header"><h3>Daily Study Hours (This Week)</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyHours} margin={{ top:10, right:10, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" name="Hours" radius={[6,6,0,0]}>
                {dailyHours.map((e, i) => <Cell key={i} fill={e.hours >= 4 ? '#E8A820' : e.hours >= 3 ? '#2196C9' : '#1B2A4A'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="an-chart-card" style={{ flex:1 }}>
          <div className="an-chart-header"><h3>Assignment Scores</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={assignmentScores} margin={{ top:10, right:20, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
              <XAxis dataKey="num" tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60,100]} tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" name="Score" stroke="#E8A820" strokeWidth={2.5}
                dot={{ r:5, fill:'#E8A820', strokeWidth:2, stroke:'white' }} activeDot={{ r:7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="an-chart-card" style={{ marginTop:'1.25rem' }}>
        <div className="an-chart-header"><h3>Module Completion Progress</h3></div>
        <div className="module-progress-grid">
          {courseProgress.map(m => (
            <div key={m.name} className="mp-item">
              <div className="mp-header">
                <span className="mp-name">{m.name}</span>
                <span className="mp-count" style={{ color: m.color }}>{m.done}/{m.total} lectures</span>
              </div>
              <div className="mp-bar"><div className="mp-fill" style={{ width:`${(m.done/m.total)*100}%`, background: m.color }} /></div>
              <span className="mp-pct" style={{ color: m.color }}>{Math.round((m.done/m.total)*100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Applications ─────────────────────────────────────────
const ApplicationsTab = ({ applications }) => (
  <div>
    <div className="tab-hdr">
      <div><h2>My Applications</h2><p>Track all your internship applications</p></div>
      <a href="/#apply" className="btn btn-primary" style={{ fontSize:'.85rem' }}>Apply Again</a>
    </div>
    {applications.length === 0 ? (
      <div className="empty-state-card">
        <div className="esc-icon">{Icons.applications}</div>
        <h3>No Applications Yet</h3>
        <p>Start your journey by applying for an internship.</p>
        <a href="/#apply" className="wb-btn-primary">Apply Now</a>
      </div>
    ) : (
      <div className="app-cards">
        {applications.map(a => (
          <div key={a._id} className="app-card">
            <div className="appc-left">
              <div className="appc-icon">{Icons.applications}</div>
              <div>
                <h4>{a.interest}</h4>
                <span>{a.duration === '3months' ? '3-Month' : '6-Month'} Internship</span>
                <span className="appc-college">{a.college} · {a.year}</span>
              </div>
            </div>
            <div className="appc-right">
              {statusBadge(a.status)}
              <span className="appc-date">{new Date(a.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ── My Courses ────────────────────────────────────────────
const MyCoursesTab = ({
  enrollments,
  analyticsData,
  refresh
}) => {
  const [activeCourseId, setActiveCourseId] =
    useState(null);
  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);
  const reportedSecondsRef = useRef(0);

  // Real study timer. Nothing is randomly generated.
  useEffect(() => {
    if (!activeCourseId) return undefined;

    const interval = setInterval(() => {
      setElapsedSeconds(seconds => {
        const next = seconds + 1;

        // Save real elapsed time every 15 seconds.
        if (
          next - reportedSecondsRef.current >=
          15
        ) {
          const secondsToSave =
            next -
            reportedSecondsRef.current;

          reportedSecondsRef.current = next;

          const enrollment =
            enrollments.find(
              item =>
                String(item._id) ===
                String(activeCourseId)
            );

          if (enrollment) {
            trackActivity({
              activityType:
                'course_progress',
              details: {
                duration:
                  secondsToSave / 60,
                courseName:
                  enrollment.courseName,
                enrollmentId:
                  enrollment._id
              }
            }).catch(error =>
              console.error(
                'Study time save failed:',
                error
              )
            );
          }
        }

        return next;
      });
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [activeCourseId, enrollments]);

  const startLearning = enrollment => {
    if (
      enrollment.paymentStatus !== 'paid'
    ) {
      toast.error(
        'Complete payment before starting the course.'
      );
      return;
    }

    reportedSecondsRef.current = 0;
    setElapsedSeconds(0);
    setActiveCourseId(enrollment._id);

    toast.success(
      `Study timer started for ${enrollment.courseName}`
    );
  };

  const stopLearning = async () => {
    if (!activeCourseId) return;

    const enrollment =
      enrollments.find(
        item =>
          String(item._id) ===
          String(activeCourseId)
      );

    const unsavedSeconds =
      elapsedSeconds -
      reportedSecondsRef.current;

    if (
      enrollment &&
      unsavedSeconds > 0
    ) {
      try {
        await trackActivity({
          activityType:
            'course_progress',
          details: {
            duration:
              unsavedSeconds / 60,
            courseName:
              enrollment.courseName,
            enrollmentId:
              enrollment._id
          }
        });
      } catch (error) {
        toast.error(
          'Could not save the final study time.'
        );
        return;
      }
    }

    setActiveCourseId(null);
    setElapsedSeconds(0);
    reportedSecondsRef.current = 0;

    toast.success(
      'Study time saved successfully.'
    );
  };

  const deleteEnrollment = async (
    id,
    paymentStatus
  ) => {
    if (paymentStatus === 'paid') {
      toast.error(
        'Cannot delete a paid enrollment. Contact support.'
      );
      return;
    }

    if (
      !window.confirm(
        'Delete this pending enrollment?'
      )
    ) {
      return;
    }

    try {
      await API.delete(
        `/courses/enroll/${id}`
      );

      toast.success(
        'Enrollment deleted'
      );

      refresh();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to delete'
      );
    }
  };

  const courseProgressMap = new Map(
    (analyticsData?.courseProgress || []).map(
      course => [
        String(course.id),
        Number(course.progress || 0)
      ]
    )
  );

  const formatTimer = seconds => {
    const hours = Math.floor(
      seconds / 3600
    );

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    return [
      hours
        .toString()
        .padStart(2, '0'),
      minutes
        .toString()
        .padStart(2, '0'),
      secs
        .toString()
        .padStart(2, '0')
    ].join(':');
  };

  return (
    <div>
      <div className="tab-hdr">
        <div>
          <h2>My Courses</h2>
          <p>
            {enrollments.length} course
            {enrollments.length !== 1
              ? 's'
              : ''}{' '}
            enrolled
          </p>
        </div>

        <button
          onClick={() =>
            (window.location.href =
              '/#courses')
          }
          className="btn btn-primary"
          style={{
            fontSize: '.85rem'
          }}
        >
          Browse More
        </button>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state-card">
          <div className="esc-icon">
            {Icons.book}
          </div>

          <h3>
            No Courses Enrolled
          </h3>

          <p>
            Browse our courses and enroll
            to start learning.
          </p>

          <a
            href="/#courses"
            className="wb-btn-primary"
          >
            Browse Courses
          </a>
        </div>
      ) : (
        <div className="my-course-cards">
          {enrollments.map(e => {
            const progress =
              courseProgressMap.get(
                String(e._id)
              ) || 0;

            const isActive =
              String(activeCourseId) ===
              String(e._id);

            return (
              <div
                key={e._id}
                className="my-course-card"
              >
                <div className="mcc-header">
                  <div className="mcc-icon">
                    {Icons.book}
                  </div>

                  <div className="mcc-badges">
                    {statusBadge(
                      e.paymentStatus
                    )}
                    {statusBadge(
                      e.status || 'enrolled'
                    )}
                  </div>
                </div>

                <h4>{e.courseName}</h4>

                <div className="mcc-meta">
                  <span>{e.college}</span>

                  <span>
                    {e.degree} · {e.year}
                  </span>

                  <span>
                    ₹
                    {Number(
                      e.coursePrice
                    ).toLocaleString(
                      'en-IN'
                    )}
                  </span>
                </div>

                <div className="mcc-progress">
                  <div className="mcc-prog-label">
                    <span>
                      Course Progress
                    </span>

                    <span>
                      {progress}%
                    </span>
                  </div>

                  <div className="mcc-prog-bar">
                    <div
                      className="mcc-prog-fill"
                      style={{
                        width: `${progress}%`
                      }}
                    />
                  </div>
                </div>

                <div className="mcc-footer">
                  <span className="mcc-date">
                    Enrolled:{' '}
                    {new Date(
                      e.createdAt
                    ).toLocaleDateString(
                      'en-IN',
                      {
                        day: 'numeric',
                        month: 'short'
                      }
                    )}
                  </span>

                  <div className="mcc-actions">
                    {e.paymentStatus ===
                    'paid' ? (
                      isActive ? (
                        <div
                          style={{
                            display:
                              'flex',
                            alignItems:
                              'center',
                            gap: '.5rem'
                          }}
                        >
                          <strong
                            style={{
                              color:
                                '#27ae60',
                              fontVariantNumeric:
                                'tabular-nums'
                            }}
                          >
                            {formatTimer(
                              elapsedSeconds
                            )}
                          </strong>

                          <button
                            className="mcc-btn-continue"
                            onClick={
                              stopLearning
                            }
                          >
                            Stop & Save
                          </button>
                        </div>
                      ) : (
                        <button
                          className="mcc-btn-continue"
                          onClick={() =>
                            startLearning(
                              e
                            )
                          }
                        >
                          Start Learning
                        </button>
                      )
                    ) : (
                      <>
                        <button className="mcc-btn-pay">
                          Complete Payment
                        </button>

                        <button
                          className="mcc-btn-delete"
                          onClick={() =>
                            deleteEnrollment(
                              e._id,
                              e.paymentStatus
                            )
                          }
                        >
                          {Icons.trash}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── All Courses (Browse) ──────────────────────────────────
const AllCoursesTab = () => {
  const { activeCourses } = useCourses();
  const [filter, setFilter] = useState('all');
  const [detailCourse, setDetailCourse] = useState(null);


  const navigate = useNavigate();

  const filtered = activeCourses.filter(c => filter === 'all' || c.level === filter);

  const getTools = (tools) => {
    if (Array.isArray(tools)) return tools;
    return (tools||'').split(',').map(t=>t.trim()).filter(Boolean);
  };

  const handleEnrollClick = (c) => {
    setDetailCourse(null);
    navigate('/');
    setTimeout(() => document.getElementById('courses')?.scrollIntoView({ behavior:'smooth' }), 300);
  };

  return (
    <div>
      <div className="tab-hdr">
        <div><h2>Browse All Courses</h2><p>{activeCourses.length} courses available</p></div>
        <div className="dash-course-filters">
          {['all','beginner','intermediate'].map(f => (
            <button key={f} className={`dcf-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>
              {f==='all'?'All':f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="dash-courses-grid">
        {filtered.map(c => (
          <div key={c.id||c.title} className="dash-course-card-full" onClick={() => setDetailCourse(c)} style={{cursor:'pointer'}}>
            <div className="dcf-header" style={{ background:`linear-gradient(135deg,${c.colors?.h1||'#e76f51'},${c.colors?.h2||'#f4a261'})` }}>
              <span className="dcf-emoji">{c.emoji || '📚'}</span>
              <span className="dcf-badge">{(c.level||'').charAt(0).toUpperCase()+(c.level||'').slice(1)}</span>
            </div>
            <div className="dcf-body">
              <h4>{c.title}</h4>
              <p>{c.desc||c.tagline}</p>
              <div className="dcf-meta"><span>⏱ {c.duration}</span><span>₹{Number(c.price).toLocaleString('en-IN')}</span></div>
              <div className="dcf-tools">
                {getTools(c.tools).slice(0,4).map(t=><span key={t}>{t}</span>)}
              </div>
              <div className="dcf-stipend-row">💰 Stipend opportunity after completion</div>
              <div className="dcf-footer">
                <strong className="dcf-price">₹{Number(c.price).toLocaleString('en-IN')}</strong>
                <div className="dcf-btn-row">
                  <button
                    className="dcf-details-btn"
                    onClick={(e) => { e.stopPropagation(); setDetailCourse(c); }}>
                    Details
                  </button>
                  <button
                    className="dcf-enroll-btn"
                    onClick={(e) => { e.stopPropagation(); handleEnrollClick(c); }}>
                    Enroll →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {detailCourse && (() => {
        const CourseDetailModal = require('../Sections/CourseDetail').default;
        return (
          <CourseDetailModal
            course={detailCourse}
            onClose={() => setDetailCourse(null)}
            onEnroll={() => { setDetailCourse(null); handleEnrollClick(detailCourse); }}
          />
        );
      })()}
    </div>
  );
};

// ── Live Sessions ─────────────────────────────────────────
const LiveSessionsTab = ({ dashboardStats }) => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const res = await getStudentLiveClasses().catch(() => getStudentMentorClasses());
      setLiveClasses(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load live sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSessionJoin = async (session) => {
    try {
      await trackActivity({ 
        activityType: 'session_attended',
        details: { 
          duration: 60,
          sessionTopic: session.title,
          instructor: session.mentor?.name || 'Mentor'
        }
      });
      toast.success(`Joining ${session.title}...`);
      if (session.meetingLink) {
        window.open(session.meetingLink, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      toast.error('Failed to track session attendance');
    }
  };

  const upcomingClasses = liveClasses.filter(c => c.status !== 'completed');
  const pastClasses = liveClasses.filter(c => c.status === 'completed');

  return (
    <div>
      <div className="tab-hdr">
        <div>
          <h2>Live Sessions & Classes</h2>
          <p>Real-time interactive live sessions and lectures with your allocated mentor</p>
        </div>
        <div className="session-stats-mini">
          <span><strong>{dashboardStats?.sessionsAttended || 0}</strong> attended</span>
          <span><strong>{dashboardStats?.attendanceRate || 0}%</strong> attendance</span>
        </div>
      </div>

      <h3 className="section-sub-title">Live & Scheduled Classes ({upcomingClasses.length})</h3>
      
      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
          Loading live class schedule from database...
        </div>
      ) : upcomingClasses.length === 0 ? (
        <div className="empty-sessions-history" style={{ padding: '40px 20px' }}>
          <div className="empty-sessions-icon" style={{ opacity: 0.6 }}>{Icons.sessions}</div>
          <h4>No Live Sessions Scheduled Right Now</h4>
          <p>Your mentor has not scheduled upcoming live classes yet. Check back soon!</p>
        </div>
      ) : (
        <div className="sessions-grid">
          {upcomingClasses.map((s) => {
            const classDate = s.date ? new Date(s.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Upcoming';
            const isLive = s.status === 'live';

            return (
              <div key={s._id} className={`session-card${isLive ? ' live' : ''}`}>
                {isLive && <div className="sc-live-badge"><span className="sc-live-dot"/>LIVE NOW</div>}
                <div className="sc-header">
                  <div className="sc-icon">{Icons.video}</div>
                  <div>
                    <h4>{s.title}</h4>
                    <span>👨‍🏫 {s.mentor?.name || 'Assigned Mentor'}</span>
                  </div>
                </div>
                <div className="sc-meta">
                  <div className="sc-meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {classDate} · {s.startTime}–{s.endTime}
                  </div>
                  <div className="sc-meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {s.classType || 'Interactive Lecture'}
                  </div>
                  {s.batch && (
                    <div className="sc-meta-item">
                      🏷️ {s.batch}
                    </div>
                  )}
                </div>
                {s.meetingLink ? (
                  <button
                    className={`sc-join-btn${isLive ? ' live' : ''}`}
                    onClick={() => handleSessionJoin(s)}
                  >
                    {isLive ? '🚀 Join Live Meeting →' : '🔗 Open Meeting Link'}
                  </button>
                ) : (
                  <button className="sc-join-btn" disabled style={{ opacity: 0.6, cursor: 'default' }}>
                    Scheduled · Link Coming Soon
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {pastClasses.length > 0 && (
        <>
          <h3 className="section-sub-title" style={{ marginTop: '2rem' }}>Past Completed Sessions</h3>
          <div className="sessions-history">
            {pastClasses.map((s) => (
              <div key={s._id} className="sh-row">
                <div className="sh-icon" style={{ background: '#e8f5e9', color: '#27ae60' }}>
                  {Icons.check}
                </div>
                <div className="sh-info">
                  <strong>{s.title}</strong>
                  <span>{new Date(s.date).toLocaleDateString('en-IN')} · {s.startTime}–{s.endTime} · {s.mentor?.name || 'Mentor'}</span>
                </div>
                <span className="sh-status attended">Completed</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Practice ──────────────────────────────────────────────
const PracticeTab = ({ dashboardStats, analyticsData }) => {
  const [mentorAssignments, setMentorAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [solutionAnswer, setSolutionAnswer] = useState('');
  const [solutionGithub, setSolutionGithub] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const res = await getStudentMentorAssignments();
      setMentorAssignments(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load mentor assignments:', err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handlePracticeComplete = async challenge => {
    try {
      const duration = parseInt(challenge.time.split(" ")[0], 10) || 20;
      await trackActivity({
        activityType: 'practice_completed',
        details: {
          duration,
          challengeName: challenge.title,
          difficulty: challenge.difficulty
        }
      });
      toast.success(`Completed challenge: ${challenge.title}!`);
      setTimeout(() => window.location.reload(), 600);
    } catch (error) {
      toast.error('Failed to track challenge completion');
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!submittingAssignment) return;
    if (!solutionAnswer.trim() && !solutionGithub.trim()) {
      return toast.error('Please enter your solution explanation or GitHub URL.');
    }
    setIsSubmitting(true);
    try {
      await submitStudentMentorAssignment(submittingAssignment._id, {
        answer: solutionAnswer.trim(),
        githubUrl: solutionGithub.trim()
      });
      toast.success(`Assignment "${submittingAssignment.title}" submitted successfully!`);
      setSubmittingAssignment(null);
      setSolutionAnswer('');
      setSolutionGithub('');
      loadAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CHALLENGES = [
    { title: 'Reverse a String', difficulty: 'Easy', topic: 'JavaScript', time: '15 min' },
    { title: 'Fibonacci Sequence', difficulty: 'Easy', topic: 'JavaScript', time: '20 min' },
    { title: 'Binary Search', difficulty: 'Medium', topic: 'Algorithms', time: '30 min' },
    { title: 'Build a REST API', difficulty: 'Medium', topic: 'Node.js', time: '45 min' },
    { title: 'React Todo App', difficulty: 'Medium', topic: 'React', time: '60 min' },
    { title: 'Database Schema Design', difficulty: 'Hard', topic: 'MongoDB', time: '45 min' }
  ];

  const DIFF_COLOR = {
    Easy: '#27ae60',
    Medium: '#e67e22',
    Hard: '#dc4545'
  };

  const solvedCount = dashboardStats.practiceProblems?.solved || 0;
  const totalProblems = dashboardStats.practiceProblems?.total || CHALLENGES.length;
  const completion = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  return (
    <div>
      <div className="tab-hdr">
        <div>
          <h2>Practice & Mentor Assignments</h2>
          <p>Complete mentor tasks, practical problem sets and coding challenges</p>
        </div>

        <div className="practice-stats-mini">
          <span><strong>{mentorAssignments.length}</strong> mentor tasks</span>
          <span><strong>{solvedCount}</strong> challenges solved</span>
          <span><strong>{dashboardStats.averageScore || 0}%</strong> avg score</span>
        </div>
      </div>

      {/* Mentor Assigned Tasks Section */}
      <h3 className="section-sub-title">👨‍🏫 Mentor-Allocated Tasks & Assignments ({mentorAssignments.length})</h3>
      {loadingAssignments ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading assignments given by your mentor...</div>
      ) : mentorAssignments.length === 0 ? (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px', textAlign: 'center', marginBottom: '25px', color: '#64748b' }}>
          <p style={{ margin: 0, fontSize: '.88rem' }}>No assignments have been assigned by your mentor yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '14px', marginBottom: '30px' }}>
          {mentorAssignments.map((a) => {
            const isCompleted = a.submission?.status === 'reviewed' || a.submission?.status === 'submitted' || a.submission?.status === 'approved';
            const score = a.submission?.score;

            return (
              <div key={a._id} style={{
                background: '#ffffff',
                border: isCompleted ? '1.5px solid #bbf7d0' : '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '.92rem', color: '#1e293b', fontWeight: 800 }}>{a.title}</h4>
                    <span style={{ fontSize: '.72rem', color: '#64748b' }}>
                      Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString('en-IN') : 'No deadline'} · Max: {a.maxScore || 100} pts
                    </span>
                  </div>
                  <span style={{
                    fontSize: '.68rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '20px',
                    background: isCompleted ? '#ecfdf5' : '#fffbeb',
                    color: isCompleted ? '#166534' : '#b45309',
                    whiteSpace: 'nowrap'
                  }}>
                    {score !== undefined ? `Scored: ${score}/${a.maxScore || 100}` : isCompleted ? 'Submitted' : 'Pending'}
                  </span>
                </div>

                <p style={{ fontSize: '.78rem', color: '#475569', margin: '0', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {a.description || 'Complete this task assigned by your mentor.'}
                </p>

                {a.attachmentUrl && (
                  <a
                    href={a.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '.72rem', color: '#1d4ed8', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    📄 Download Assignment Brief (PDF) ↗
                  </a>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  {isCompleted ? (
                    <button
                      onClick={() => setSubmittingAssignment(a)}
                      style={{
                        width: '100%',
                        background: '#f0fdf4',
                        color: '#166534',
                        border: '1px solid #bbf7d0',
                        borderRadius: '7px',
                        padding: '7px 12px',
                        fontSize: '.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      ✓ Completed — Update Solution
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSubmittingAssignment(a);
                        setSolutionAnswer(a.submission?.answer || '');
                        setSolutionGithub(a.submission?.githubUrl || '');
                      }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #e8a820, #f5c453)',
                        color: '#12233f',
                        border: 'none',
                        borderRadius: '7px',
                        padding: '8px 12px',
                        fontSize: '.78rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      🚀 Complete & Submit Solution
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Code Challenges Section */}
      <h3 className="section-sub-title">💻 General Practice Challenges ({CHALLENGES.length})</h3>
      <div className="challenges-list">
        {CHALLENGES.map((challenge, index) => {
          return (
            <div key={challenge.title} className="challenge-card">
              <div className="cc-num">{String(index + 1).padStart(2, '0')}</div>
              <div className="cc-icon" style={{ background: '#f4f6fb', color: '#1B2A4A' }}>
                {Icons.code}
              </div>
              <div className="cc-info">
                <h4>{challenge.title}</h4>
                <span>{challenge.topic} · {challenge.time}</span>
              </div>
              <div className="cc-right">
                <span
                  className="cc-diff"
                  style={{
                    color: DIFF_COLOR[challenge.difficulty],
                    background: DIFF_COLOR[challenge.difficulty] + '18',
                    border: `1px solid ${DIFF_COLOR[challenge.difficulty]}33`
                  }}
                >
                  {challenge.difficulty}
                </span>
                <button
                  className="cc-solve-btn"
                  onClick={() => handlePracticeComplete(challenge)}
                >
                  Complete Challenge
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Solution Submission Modal */}
      {submittingAssignment && (
        <div className="modal-overlay" onClick={() => setSubmittingAssignment(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <button className="modal-close" onClick={() => setSubmittingAssignment(null)}>×</button>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--navy)', marginBottom: '8px' }}>
              Submit: {submittingAssignment.title}
            </h3>
            <p style={{ fontSize: '.78rem', color: '#64748b', marginBottom: '16px' }}>
              Due: {submittingAssignment.dueDate ? new Date(submittingAssignment.dueDate).toLocaleDateString('en-IN') : 'No deadline'} · Max: {submittingAssignment.maxScore || 100} points
            </p>

            <form onSubmit={handleAssignmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                  Solution / Explanation / Output *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain your approach, paste solution summary or key findings..."
                  value={solutionAnswer}
                  onChange={e => setSolutionAnswer(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '7px', border: '1px solid var(--border)', fontFamily: "'DM Sans',sans-serif", fontSize: '.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                  GitHub Repository / Code Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={solutionGithub}
                  onChange={e => setSolutionGithub(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid var(--border)', fontFamily: "'DM Sans',sans-serif", fontSize: '.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '7px', padding: '8px 16px', fontSize: '.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ background: 'linear-gradient(135deg, #e8a820, #f5c453)', color: '#12233f', border: 'none', borderRadius: '7px', padding: '8px 18px', fontSize: '.8rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Submitting...' : '✓ Submit Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
// ── Certificates ──────────────────────────────────────────
const CertificatesTab = ({ enrollments }) => {
  const ACHIEVEMENTS = [
    { title:'First Login',        desc:'Joined the WeIntern platform',    date:'30 Apr 2024', earned:true },
    { title:'First Application',  desc:'Submitted first internship application', date:'30 Apr 2024', earned:true },
    { title:'Course Enrolled',    desc:'Enrolled in first course',        date:'30 Apr 2024', earned:true },
    { title:'7-Day Streak',       desc:'Logged in for 7 consecutive days', date:'—',          earned:false },
    { title:'First Assignment',   desc:'Completed first assignment',      date:'—',           earned:false },
    { title:'Module Complete',    desc:'Completed a full module',         date:'—',           earned:false },
  ];

  const CERTS = enrollments.filter(e => e.paymentStatus === 'paid');

  return (
    <div>
      <div className="tab-hdr">
        <div><h2>Certificates & Achievements</h2><p>Your earned rewards and milestones</p></div>
      </div>

      {/* Certificates */}
      <h3 className="section-sub-title">My Certificates</h3>
      {CERTS.length === 0 ? (
        <div className="empty-state-card" style={{ marginBottom:'2rem' }}>
          <div className="esc-icon">{Icons.award}</div>
          <h3>No Certificates Yet</h3>
          <p>Complete a paid course to earn your certificate.</p>
          <a href="/#courses" className="wb-btn-primary">Enroll in a Course</a>
        </div>
      ) : (
        <div className="certs-grid">
          {CERTS.map(e => (
            <div key={e._id} className="cert-card">
              <div className="cert-watermark">{Icons.award}</div>
              <div className="cert-body">
                <div className="cert-logo">WeIntern</div>
                <div className="cert-title">Certificate of Completion</div>
                <div className="cert-course">{e.courseName}</div>
                <div className="cert-name">{e.name}</div>
                <div className="cert-date">Issued: {new Date(e.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
              </div>
              <button className="cert-download-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      <h3 className="section-sub-title" style={{ marginTop:'2rem' }}>Achievements</h3>
      <div className="achievements-grid">
        {ACHIEVEMENTS.map((a, i) => (
          <div key={i} className={`achievement-card${a.earned ? ' earned' : ''}`}>
            <div className="ac-icon-wrap">
              <div className="ac-icon" style={{ color: a.earned ? '#E8A820' : '#c0c8d8' }}>
                {Icons.trophy}
              </div>
              {a.earned && <div className="ac-check">{Icons.check}</div>}
            </div>
            <div className="ac-info">
              <h4>{a.title}</h4>
              <p>{a.desc}</p>
              {a.earned && <span className="ac-date">{a.date}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Profile ───────────────────────────────────────────────
const ProfileTab = ({ user, setUser }) => {
  const [form, setForm] = useState({
    name: user?.name||'', phone: user?.phone||'',
    college: user?.college||'', year: user?.year||'', interest: user?.interest||''
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data.data);
      localStorage.setItem('wi_user', JSON.stringify(res.data.data));
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="tab-hdr"><div><h2>My Profile</h2><p>Update your personal information</p></div></div>
      <div className="profile-wrap">
        <div className="profile-sidebar-card">
          <div className="psc-avatar">{user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name?.[0]?.toUpperCase()}</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <div className="psc-badges">
            <span className="psc-badge green">Verified</span>
            <span className="psc-badge blue">{user.authProvider}</span>
            {user.interest && <span className="psc-badge navy">{user.interest}</span>}
          </div>
          <div className="psc-stats">
            <div className="psc-stat"><strong>{user.college || '—'}</strong><small>College</small></div>
            <div className="psc-stat"><strong>{user.year || '—'}</strong><small>Year</small></div>
          </div>
          <p className="psc-joined">Member since {new Date(user.createdAt||Date.now()).toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</p>
        </div>

        <form className="profile-form-card" onSubmit={handleSave}>
          <h3>Edit Information</h3>
          <div className="form-row">
            <div className="form-group"><label>Full Name</label><input name="name" value={form.name} onChange={handleChange} /></div>
            <div className="form-group"><label>Phone</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>College</label><input name="college" value={form.college} onChange={handleChange} placeholder="Your college" /></div>
            <div className="form-group">
              <label>Current Year</label>
              <select name="year" value={form.year} onChange={handleChange}>
                <option value="">Select year</option>
                {['1st Year','2nd Year','3rd Year','4th Year','Recent Graduate'].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Area of Interest</label>
            <select name="interest" value={form.interest} onChange={handleChange}>
              <option value="">Select domain</option>
              {['Web Development','App Development','AI & Automation','Cloud Solutions','UI/UX Design','Digital Marketing','Data Science'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <button type="submit" className="profile-save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const StudentProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingProject, setSubmittingProject] = useState(null);
  const [submitForm, setSubmitForm] = useState({ githubUrl: '', liveDemoUrl: '', studentNotes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await getStudentProjects();
      setProjects(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load capstone projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openSubmitModal = (proj) => {
    setSubmittingProject(proj);
    setSubmitForm({
      githubUrl: proj.githubUrl || '',
      liveDemoUrl: proj.liveDemoUrl || '',
      studentNotes: proj.studentNotes || ''
    });
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!submitForm.githubUrl.trim() && !submitForm.liveDemoUrl.trim()) {
      return toast.error('Please provide at least a GitHub repository or Live Demo URL');
    }
    setIsSubmitting(true);
    try {
      await submitStudentProject(submittingProject._id, submitForm);
      toast.success('Project submitted for mentor review! 🎉');
      setSubmittingProject(null);
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dash-loading-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="dash-loading-spinner" />
        <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>Loading capstone projects...</p>
      </div>
    );
  }

  return (
    <div className="student-projects-tab">
      <div className="dash-card-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
            Capstone & Internship Projects
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '.85rem', margin: '4px 0 0' }}>
            Work on live industry projects allocated by your mentor, submit code & live demos, and track evaluation.
          </p>
        </div>
        <button
          type="button"
          onClick={loadProjects}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#e8a820',
            color: '#12233f',
            border: 'none',
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(232,168,32,0.25)'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', borderRadius: '12px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>🚀</div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--navy)', margin: '0 0 .35rem' }}>
            No Capstone Projects Allocated Yet
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem', maxWidth: '440px', margin: '0 auto' }}>
            Your assigned mentor will allocate your capstone project with requirements, starter code repositories, and milestone deliverables.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {projects.map((proj) => (
            <div key={proj._id} className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.15rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span className={`badge-status badge-${proj.status || 'assigned'}`} style={{ textTransform: 'capitalize', fontWeight: 700, fontSize: '.72rem', padding: '3px 8px' }}>
                    {proj.status === 'submitted' ? '⏳ Submitted for Review' : proj.status === 'completed' ? '✅ Completed' : proj.status === 'changes_requested' ? '⚠️ Changes Requested' : proj.status || 'Assigned'}
                  </span>
                  {proj.score !== undefined && proj.score !== null && (
                    <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '12px', fontWeight: 800, fontSize: '.7rem' }}>
                      Grade: {proj.score}/100
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 4px' }}>
                  {proj.title}
                </h3>
                
                {proj.mentor && (
                  <p style={{ fontSize: '.75rem', color: 'var(--muted)', margin: '0 0 10px' }}>
                    Mentor: <strong style={{ color: 'var(--navy)' }}>{proj.mentor.name}</strong>
                  </p>
                )}

                {proj.description && (
                  <p style={{ fontSize: '.78rem', color: '#475569', lineHeight: 1.45, background: '#f8fafc', padding: '8px 10px', borderRadius: '7px', border: '1px solid #e2e8f0', margin: '0 0 10px' }}>
                    {proj.description}
                  </p>
                )}

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                    <span>Progress</span>
                    <span>{proj.progress || 0}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${proj.progress || 0}%`, background: 'linear-gradient(90deg, #3b82f6, #10b981)', borderRadius: '10px', transition: 'width .3s' }} />
                  </div>
                </div>

                {proj.mentorComments && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '7px', padding: '8px 10px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '.7rem', fontWeight: 800, color: '#b45309', marginBottom: '2px' }}>
                      👨‍🏫 Mentor Feedback:
                    </div>
                    <div style={{ fontSize: '.75rem', color: '#92400e' }}>{proj.mentorComments}</div>
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#0f172a',
                        color: '#ffffff',
                        border: '1px solid #0f172a',
                        borderRadius: '6px',
                        padding: '5px 11px',
                        fontSize: '.74rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      <span>📂</span> GitHub Repo
                    </a>
                  )}
                  {proj.liveDemoUrl && (
                    <a
                      href={proj.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#0284c7',
                        color: '#ffffff',
                        border: '1px solid #0284c7',
                        borderRadius: '6px',
                        padding: '5px 11px',
                        fontSize: '.74rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 1px 3px rgba(2,132,199,0.2)'
                      }}
                    >
                      <span>🌐</span> Live Demo
                    </a>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '6px', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    fontSize: '.76rem',
                    fontWeight: 700,
                    borderRadius: '7px',
                    background: '#e8a820',
                    color: '#12233f',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(232,168,32,0.25)'
                  }}
                  onClick={() => openSubmitModal(proj)}
                >
                  {proj.status === 'submitted' || proj.status === 'completed' ? '📝 Update Submission' : '🚀 Submit Project'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {submittingProject && (
        <div className="dash-modal-overlay" onClick={() => setSubmittingProject(null)}>
          <div className="dash-modal-card" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3 style={{ margin: 0 }}>Submit Project: {submittingProject.title}</h3>
              <button className="dash-modal-close" onClick={() => setSubmittingProject(null)}>×</button>
            </div>
            <form onSubmit={handleSubmitSolution} className="dash-modal-body" style={{ padding: '1.25rem' }}>
              <div className="dash-form-group" style={{ marginBottom: '1rem' }}>
                <label className="dash-form-label" style={{ display: 'block', marginBottom: '5px', fontSize: '.8rem', fontWeight: 700 }}>
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  className="dash-input"
                  placeholder="https://github.com/yourusername/project-repo"
                  value={submitForm.githubUrl}
                  onChange={e => setSubmitForm({ ...submitForm, githubUrl: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="dash-form-group" style={{ marginBottom: '1rem' }}>
                <label className="dash-form-label" style={{ display: 'block', marginBottom: '5px', fontSize: '.8rem', fontWeight: 700 }}>
                  Live Demo / Deployed Link (Optional)
                </label>
                <input
                  type="url"
                  className="dash-input"
                  placeholder="https://my-app.vercel.app"
                  value={submitForm.liveDemoUrl}
                  onChange={e => setSubmitForm({ ...submitForm, liveDemoUrl: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="dash-form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="dash-form-label" style={{ display: 'block', marginBottom: '5px', fontSize: '.8rem', fontWeight: 700 }}>
                  Project Summary & Implementation Notes
                </label>
                <textarea
                  rows="4"
                  className="dash-input"
                  placeholder="Describe your tech stack, key features implemented, instructions to run..."
                  value={submitForm.studentNotes}
                  onChange={e => setSubmitForm({ ...submitForm, studentNotes: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                />
              </div>

              <div className="dash-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setSubmittingProject(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : '🚀 Submit Project for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
