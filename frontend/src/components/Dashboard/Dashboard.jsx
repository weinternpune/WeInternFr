import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CoursesContext';
import { getMyApplications, getMyEnrollments, updateProfile } from '../../utils/api';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

const statusBadge = (s) => (
  <span className={`badge-status badge-${s}`}>{s?.charAt(0).toUpperCase() + s?.slice(1)}</span>
);

// SVG Icons (realistic, no emoji)
const Icons = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
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
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

const TABS = [
  { id: 'overview',     icon: Icons.home,         label: 'Overview' },
  { id: 'analytics',   icon: Icons.analytics,    label: 'Analytics' },
  { id: 'applications',icon: Icons.applications, label: 'My Applications' },
  { id: 'mycourses',   icon: Icons.mycourses,    label: 'My Courses' },
  { id: 'allcourses',  icon: Icons.allcourses,   label: 'Browse Courses' },
  { id: 'sessions',    icon: Icons.sessions,     label: 'Live Sessions' },
  { id: 'practice',    icon: Icons.practice,     label: 'Practice' },
  { id: 'certificates',icon: Icons.certificate,  label: 'Certificates' },
  { id: 'profile',     icon: Icons.profile,      label: 'Profile' },
];

const Dashboard = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([getMyApplications(), getMyEnrollments()])
      .then(([appsRes, enrollRes]) => {
        setApplications(appsRes.data.data);
        setEnrollments(enrollRes.data.data);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

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

  return (
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

        <div className="dash-nav-section">
          <div className="dns-label">Main</div>
          {TABS.slice(0,2).map(t => (
            <button key={t.id} className={`dash-nav-item${tab === t.id ? ' active' : ''}`}
              onClick={() => { setTab(t.id); setSidebarOpen(false); }}>
              <span className="dni-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="dash-nav-section">
          <div className="dns-label">Learning</div>
          {TABS.slice(2,8).map(t => (
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
          {TABS.slice(8).map(t => (
            <button key={t.id} className={`dash-nav-item${tab === t.id ? ' active' : ''}`}
              onClick={() => { setTab(t.id); setSidebarOpen(false); }}>
              <span className="dni-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className="dash-logout">
          <span className="dni-icon">{Icons.logout}</span>
          Logout
        </button>
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
          {tab === 'overview'      && <OverviewTab user={user} applications={applications} enrollments={enrollments} setTab={setTab} />}
          {tab === 'analytics'     && <AnalyticsTab enrollments={enrollments} applications={applications} />}
          {tab === 'applications'  && <ApplicationsTab applications={applications} />}
          {tab === 'mycourses'     && <MyCoursesTab enrollments={enrollments} refresh={refreshEnrollments} />}
          {tab === 'allcourses'    && <AllCoursesTab />}
          {tab === 'sessions'      && <LiveSessionsTab />}
          {tab === 'practice'      && <PracticeTab />}
          {tab === 'certificates'  && <CertificatesTab enrollments={enrollments} />}
          {tab === 'profile'       && <ProfileTab user={user} setUser={setUser} />}
        </div>
      </main>
    </div>
  );
};

// ── Overview ────────────────────────────────────────────
const OverviewTab = ({ user, applications, enrollments, setTab }) => {
  const accepted = applications.filter(a => a.status === 'accepted').length;


  const STATS = [
    { icon: Icons.book,    val: enrollments.length, label: 'Enrolled',      color: '#2196C9', bg: '#e3f2fd' },
    { icon: Icons.trophy,  val: accepted,            label: 'Accepted',      color: '#27ae60', bg: '#e8f5e9' },
    { icon: Icons.clock,   val: '142h',              label: 'Hours Logged',  color: '#E8A820', bg: '#fff8e1' },
    { icon: Icons.target,  val: '89%',               label: 'Attendance',    color: '#6c3483', bg: '#f3e5f5' },
    { icon: Icons.flame,   val: '18',                label: 'Day Streak',    color: '#e67e22', bg: '#fff3e0' },
    { icon: Icons.video,   val: '19',                label: 'Sessions Done', color: '#1e8449', bg: '#e8f5e9' },
  ];

  return (
    <div className="overview-wrap">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="wb-left">
          <div className="wb-greeting">Good day, {user.name?.split(' ')[0]}! 👋</div>
          <h2 className="wb-title">Ready to build your future today?</h2>
          <p className="wb-sub">You have {applications.filter(a=>a.status==='pending').length} pending application{applications.filter(a=>a.status==='pending').length !== 1 ? 's' : ''} and {enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled.</p>
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
                strokeDasharray={`${(65/100)*314} 314`} strokeLinecap="round"
                transform="rotate(-90 60 60)" />
            </svg>
            <div className="wb-ring-text"><strong>65%</strong><small>Overall Progress</small></div>
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

      {/* Recent Activity + Quick Links */}
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
          <div className="oc-header"><h3>My Courses</h3>
            <button className="oc-link" onClick={() => setTab('mycourses')}>View All</button>
          </div>
          {enrollments.length === 0 ? (
            <div className="oc-empty">
              <div className="oc-empty-icon">{Icons.book}</div>
              <p>No courses enrolled yet</p>
              <button onClick={() => setTab('allcourses')} className="wb-btn-primary" style={{ fontSize:'.82rem', padding:'.5rem 1.2rem' }}>Browse Courses</button>
            </div>
          ) : enrollments.slice(0,4).map(e => (
            <div key={e._id} className="oc-row">
              <div className="oc-row-icon" style={{ background:'#e8f5e9', color:'#27ae60' }}>{Icons.book}</div>
              <div className="oc-row-info"><strong>{e.courseName}</strong><span>{e.college}</span></div>
              {statusBadge(e.paymentStatus)}
            </div>
          ))}
        </div>

        <div className="overview-card">
          <div className="oc-header"><h3>Quick Actions</h3></div>
          <div className="quick-actions">
            {[
              { icon: Icons.allcourses, label:'Browse Courses', sub:'Explore new courses', color:'rgb(215 237 247)', bg:'rgb(29 96 145)', tab:'allcourses' },
              { icon: Icons.sessions,   label:'Live Sessions',  sub:'Join upcoming sessions', color:'#f1f7f3', bg:'rgb(17 132 26)', tab:'sessions' },
              { icon: Icons.practice,   label:'Practice Now',   sub:'Coding challenges', color:'#6c3483', bg:'#d03ae7', tab:'practice' },
              { icon: Icons.certificate,label:'Certificates',   sub:'View achievements', color:'#fffefb', bg:'#074bba', tab:'certificates' },
            ].map(q => (
              <button key={q.label} className="qa-item" onClick={() => setTab(q.tab)}>
                <div className="qa-icon" style={{ background: q.bg, color: q.color }}>{q.icon}</div>
                <div><div className="qa-label">{q.label}</div><div className="qa-sub">{q.sub}</div></div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}
          </div>
        </div>

        <div className="overview-card">
          <div className="oc-header"><h3>Upcoming Sessions</h3></div>
          {[
            { topic:'React Hooks Deep Dive', date:'Today 4:00 PM', instructor:'Ashwin Sir', status:'live' },
            { topic:'Node.js REST APIs',      date:'Tomorrow 3:00 PM', instructor:'Priya Ma\'am', status:'upcoming' },
            { topic:'MongoDB Aggregation',    date:'Wed 5:00 PM', instructor:'Rahul Sir', status:'upcoming' },
          ].map((s, i) => (
            <div key={i} className="session-row">
              <div className="sr-dot" style={{ background: s.status === 'live' ? '#27ae60' : '#E8A820' }} />
              <div className="sr-info"><strong>{s.topic}</strong><span>{s.date} · {s.instructor}</span></div>
              {s.status === 'live'
                ? <span className="sr-live">● LIVE</span>
                : <span className="sr-upcoming">Soon</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Analytics ────────────────────────────────────────────
const AnalyticsTab = ({ enrollments, applications }) => {
  const weeklyActivity = [
    { week:'W1', lectures:8,  practice:5,  sessions:2 },
    { week:'W2', lectures:12, practice:8,  sessions:3 },
    { week:'W3', lectures:10, practice:12, sessions:2 },
    { week:'W4', lectures:15, practice:10, sessions:4 },
    { week:'W5', lectures:11, practice:15, sessions:3 },
    { week:'W6', lectures:18, practice:18, sessions:5 },
    { week:'W7', lectures:20, practice:14, sessions:6 },
    { week:'W8', lectures:16, practice:20, sessions:4 },
  ];

  const scoreData = [
    { num:'A1', score:72 },{ num:'A2', score:78 },{ num:'A3', score:85 },
    { num:'A4', score:80 },{ num:'A5', score:88 },{ num:'A6', score:82 },
    { num:'A7', score:91 },{ num:'A8', score:88 },
  ];

  const progressData = [
    { name:'Completed', value:65, color:'#27ae60' },
    { name:'In Progress', value:25, color:'#2196C9' },
    { name:'Pending', value:10, color:'#E8A820' },
  ];

  const dailyHours = [
    { day:'Mon', hours:2.5 },{ day:'Tue', hours:1.8 },{ day:'Wed', hours:3.2 },
    { day:'Thu', hours:2.0 },{ day:'Fri', hours:4.1 },{ day:'Sat', hours:5.5 },{ day:'Sun', hours:3.8 },
  ];

  const moduleProgress = [
    { name:'HTML & CSS',   done:12, total:12, color:'#27ae60' },
    { name:'JavaScript',   done:18, total:24, color:'#2196C9' },
    { name:'React.js',     done:10, total:20, color:'#6c3483' },
    { name:'Node.js',      done:6,  total:16, color:'#e67e22' },
    { name:'MongoDB',      done:4,  total:12, color:'#1e8449' },
    { name:'Deployment',   done:0,  total:8,  color:'#dc4545' },
  ];

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
          { label:'Total Study Hours', val:'142h',   icon: Icons.clock,   color:'#E8A820', bg:'#fff8e1', trend:'+12h this week' },
          { label:'Avg Score',         val:'84.5%',  icon: Icons.target,  color:'#2196C9', bg:'#e3f2fd', trend:'+3.2% vs last month' },
          { label:'Attendance Rate',   val:'89%',    icon: Icons.video,   color:'#27ae60', bg:'#e8f5e9', trend:'19/22 sessions' },
          { label:'Current Streak',    val:'18 days',icon: Icons.flame,   color:'#e67e22', bg:'#fff3e0', trend:'Personal best!' },
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
              <Pie data={progressData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {progressData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [v + '%', '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {progressData.map(s => (
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
            <LineChart data={scoreData} margin={{ top:10, right:20, left:-20, bottom:0 }}>
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
          {moduleProgress.map(m => (
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
const MyCoursesTab = ({ enrollments, refresh }) => {
  const deleteEnrollment = async (id, paymentStatus) => {
    if (paymentStatus === 'paid') { toast.error('Cannot delete a paid enrollment. Contact support.'); return; }
    if (!window.confirm('Delete this pending enrollment?')) return;
    try {
      await API.delete(`/courses/enroll/${id}`);
      toast.success('Enrollment deleted');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="tab-hdr">
        <div><h2>My Courses</h2><p>{enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled</p></div>
        <button onClick={() => window.location.href='/#courses'} className="btn btn-primary" style={{ fontSize:'.85rem' }}>Browse More</button>
      </div>
      {enrollments.length === 0 ? (
        <div className="empty-state-card">
          <div className="esc-icon">{Icons.book}</div>
          <h3>No Courses Enrolled</h3>
          <p>Browse our courses and enroll to start learning.</p>
          <a href="/#courses" className="wb-btn-primary">Browse Courses</a>
        </div>
      ) : (
        <div className="my-course-cards">
          {enrollments.map(e => (
            <div key={e._id} className="my-course-card">
              <div className="mcc-header">
                <div className="mcc-icon">{Icons.book}</div>
                <div className="mcc-badges">
                  {statusBadge(e.paymentStatus)}
                  {statusBadge(e.status || 'enrolled')}
                </div>
              </div>
              <h4>{e.courseName}</h4>
              <div className="mcc-meta">
                <span>{e.college}</span>
                <span>{e.degree} · {e.year}</span>
                <span>Rs.{Number(e.coursePrice).toLocaleString('en-IN')}</span>
              </div>
              <div className="mcc-progress">
                <div className="mcc-prog-label">
                  <span>Course Progress</span>
                  <span>{e.paymentStatus === 'paid' ? '45%' : '0%'}</span>
                </div>
                <div className="mcc-prog-bar">
                  <div className="mcc-prog-fill" style={{ width: e.paymentStatus === 'paid' ? '45%' : '0%' }} />
                </div>
              </div>
              <div className="mcc-footer">
                <span className="mcc-date">Enrolled: {new Date(e.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                <div className="mcc-actions">
                  {e.paymentStatus === 'paid' ? (
                    <button className="mcc-btn-continue">Continue Learning</button>
                  ) : (
                    <>
                      <button className="mcc-btn-pay">Complete Payment</button>
                      <button className="mcc-btn-delete" onClick={() => deleteEnrollment(e._id, e.paymentStatus)}>
                        {Icons.trash}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
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
              <span className="dcf-emoji">{c.emoji}</span>
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
const LiveSessionsTab = () => {
  const UPCOMING = [
    { topic:'React Hooks & Context API', instructor:'Ashwin Kumar', date:'Today', time:'4:00 PM', duration:'60 min', status:'live', attendees:42 },
    { topic:'Node.js REST API Design', instructor:'Priya Sharma', date:'Tomorrow', time:'3:00 PM', duration:'55 min', status:'upcoming', attendees:38 },
    { topic:'MongoDB Aggregation Pipeline', instructor:'Rahul Mehta', date:'Wed, 8 May', time:'5:00 PM', duration:'60 min', status:'upcoming', attendees:29 },
    { topic:'Docker & Container Basics', instructor:'Sneha Patel', date:'Thu, 9 May', time:'4:30 PM', duration:'50 min', status:'upcoming', attendees:33 },
  ];

  const PAST = [
    { topic:'JavaScript ES6+ Features', date:'30 Apr 2024', duration:'55 min', attended:true,  score:'92%' },
    { topic:'CSS Grid & Flexbox Mastery', date:'28 Apr 2024', duration:'45 min', attended:false, score:'—'   },
    { topic:'React Component Patterns', date:'26 Apr 2024', duration:'60 min', attended:true,  score:'88%' },
    { topic:'Express Middleware Deep Dive', date:'24 Apr 2024', duration:'50 min', attended:true, score:'85%' },
    { topic:'Git & GitHub Workflow', date:'22 Apr 2024', duration:'45 min', attended:true,  score:'90%' },
    { topic:'HTML5 Semantic Elements', date:'20 Apr 2024', duration:'40 min', attended:true,  score:'95%' },
  ];

  return (
    <div>
      <div className="tab-hdr">
        <div><h2>Live Sessions</h2><p>Interactive sessions with expert mentors</p></div>
        <div className="session-stats-mini">
          <span><strong>19</strong> attended</span>
          <span><strong>5</strong> missed</span>
          <span><strong>79%</strong> attendance</span>
        </div>
      </div>

      <h3 className="section-sub-title">Upcoming & Live Sessions</h3>
      <div className="sessions-grid">
        {UPCOMING.map((s, i) => (
          <div key={i} className={`session-card${s.status === 'live' ? ' live' : ''}`}>
            {s.status === 'live' && <div className="sc-live-badge"><span className="sc-live-dot"/>LIVE NOW</div>}
            <div className="sc-header">
              <div className="sc-icon">{Icons.video}</div>
              <div>
                <h4>{s.topic}</h4>
                <span>{s.instructor}</span>
              </div>
            </div>
            <div className="sc-meta">
              <div className="sc-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {s.date} · {s.time}
              </div>
              <div className="sc-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {s.duration}
              </div>
              <div className="sc-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {s.attendees} attending
              </div>
            </div>
            <button className={`sc-join-btn${s.status === 'live' ? ' live' : ''}`}>
              {s.status === 'live' ? 'Join Now →' : 'Set Reminder'}
            </button>
          </div>
        ))}
      </div>

      <h3 className="section-sub-title" style={{ marginTop:'2rem' }}>Session History</h3>
      <div className="sessions-history">
        {PAST.map((s, i) => (
          <div key={i} className="sh-row">
            <div className="sh-icon" style={{ background: s.attended ? '#e8f5e9' : '#fdecea', color: s.attended ? '#27ae60' : '#dc4545' }}>
              {s.attended ? Icons.check : Icons.trash}
            </div>
            <div className="sh-info"><strong>{s.topic}</strong><span>{s.date} · {s.duration}</span></div>
            <span className={`sh-status ${s.attended ? 'attended' : 'missed'}`}>{s.attended ? 'Attended' : 'Missed'}</span>
            <strong className="sh-score" style={{ color: s.attended ? '#27ae60' : '#dc4545' }}>{s.score}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Practice ──────────────────────────────────────────────
const PracticeTab = () => {
  const CHALLENGES = [
    { title:'Reverse a String',        difficulty:'Easy',   topic:'JavaScript', time:'15 min', solved:true,  score:'100%' },
    { title:'Fibonacci Sequence',      difficulty:'Easy',   topic:'JavaScript', time:'20 min', solved:true,  score:'90%'  },
    { title:'Binary Search',           difficulty:'Medium', topic:'Algorithms', time:'30 min', solved:true,  score:'85%'  },
    { title:'Build a REST API',        difficulty:'Medium', topic:'Node.js',    time:'45 min', solved:false, score:'—'    },
    { title:'React Todo App',          difficulty:'Medium', topic:'React',      time:'60 min', solved:false, score:'—'    },
    { title:'Database Schema Design',  difficulty:'Hard',   topic:'MongoDB',    time:'45 min', solved:false, score:'—'    },
  ];

  const DIFF_COLOR = { Easy:'#27ae60', Medium:'#e67e22', Hard:'#dc4545' };

  return (
    <div>
      <div className="tab-hdr">
        <div><h2>Practice Sessions</h2><p>Sharpen your skills with coding challenges</p></div>
        <div className="practice-stats-mini">
          <span><strong>3</strong> solved</span>
          <span><strong>3</strong> pending</span>
          <span><strong>50%</strong> completion</span>
        </div>
      </div>

      <div className="practice-summary">
        {[
          { label:'Problems Solved', val:'3/6', color:'#27ae60', w:'50%' },
          { label:'Avg Score',       val:'91%', color:'#2196C9', w:'91%' },
          { label:'Practice Hours',  val:'8h',  color:'#E8A820', w:'40%' },
        ].map(s => (
          <div key={s.label} className="ps-card">
            <div className="ps-val" style={{ color: s.color }}>{s.val}</div>
            <div className="ps-label">{s.label}</div>
            <div className="ps-bar"><div className="ps-fill" style={{ width: s.w, background: s.color }}/></div>
          </div>
        ))}
      </div>

      <div className="challenges-list">
        {CHALLENGES.map((c, i) => (
          <div key={i} className={`challenge-card${c.solved ? ' solved' : ''}`}>
            <div className="cc-num">{String(i+1).padStart(2,'0')}</div>
            <div className="cc-icon" style={{ background: c.solved ? '#e8f5e9' : '#f4f6fb', color: c.solved ? '#27ae60' : '#1B2A4A' }}>
              {Icons.code}
            </div>
            <div className="cc-info">
              <h4>{c.title}</h4>
              <span>{c.topic} · {c.time}</span>
            </div>
            <div className="cc-right">
              <span className="cc-diff" style={{ color: DIFF_COLOR[c.difficulty], background: DIFF_COLOR[c.difficulty]+'18', border:`1px solid ${DIFF_COLOR[c.difficulty]}33` }}>
                {c.difficulty}
              </span>
              {c.solved
                ? <span className="cc-score">{c.score}</span>
                : <button className="cc-solve-btn">Solve Now</button>
              }
            </div>
          </div>
        ))}
      </div>
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

export default Dashboard;
