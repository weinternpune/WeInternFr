import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getAdminStats, getAdminApplications, updateApplicationStatus,
  getAdminEnrollments, getAdminHireRequests, updateHireRequest, getAdminUsers
} from '../../utils/api';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import './Admin.css';
import { useCourses } from '../../context/CoursesContext';

const statusBadge = (s) => (
  <span className={`badge-status badge-${s}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
);

const ADMIN_TABS = [
  { id: 'overview',      icon: '📊', label: 'Overview' },
  { id: 'applications',  icon: '📝', label: 'Applications' },
  { id: 'enrollments',   icon: '📚', label: 'Enrollments' },
  { id: 'hire',          icon: '🏢', label: 'Hire Requests' },
  { id: 'users',         icon: '👥', label: 'Users' },
  { id: 'courses',       icon: '🎓', label: 'Courses' },
  { id: 'projects',      icon: '🚀', label: 'Projects' },
  { id: 'admins',         icon: '🛡️', label: 'Admins' },
];

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/dashboard'); return; }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="dashboard admin-panel">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="dash-sidebar-top">
          <Link to="/" className="dash-logo-link"><img src="/welogo.png" alt="WeIntern" className="dash-logo" /></Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        <div className="admin-badge-row"><span className="admin-badge">⚙️ Admin Panel</span></div>
        <div className="dash-user-info">
          <div className="dash-avatar" style={{ background: '#dc4545' }}>{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="dash-user-name">{user.name}</div>
            <div className="dash-user-role" style={{ color: '#ff6b6b' }}>Administrator</div>
          </div>
        </div>
        <nav className="dash-nav">
          {ADMIN_TABS.map(t => (
            <button key={t.id} className={`dash-nav-item${tab === t.id ? ' active' : ''}`}
              onClick={() => { setTab(t.id); setSidebarOpen(false); }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <button onClick={() => { logout(); navigate('/'); }} className="dash-logout">🚪 Logout</button>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="dash-header-title">
            {ADMIN_TABS.find(t => t.id === tab)?.icon} {ADMIN_TABS.find(t => t.id === tab)?.label}
          </div>
          <Link to="/" className="btn btn-outline" style={{ fontSize: '.82rem', padding: '.5rem 1rem' }}>← Home</Link>
        </header>
        <div className="dash-content">
          {tab === 'overview'     && <AdminOverview />}
          {tab === 'applications' && <AdminApplications />}
          {tab === 'enrollments'  && <AdminEnrollments />}
          {tab === 'hire'         && <AdminHireRequests />}
          {tab === 'users'        && <AdminUsers />}
          {tab === 'courses'      && <AdminCourses />}
          {tab === 'projects'     && <AdminProjects />}
          {tab === 'admins'       && <AdminsTab />}
        </div>
      </main>
    </div>
  );
};

// ── Overview ──────────────────────────────────────────────
const AdminOverview = () => {
  const [data, setData] = useState(null);

  const monthlyData = [
    { month: 'Oct', applications: 12, enrollments: 5, revenue: 24995 },
    { month: 'Nov', applications: 18, enrollments: 8, revenue: 41992 },
    { month: 'Dec', applications: 24, enrollments: 12, revenue: 62988 },
    { month: 'Jan', applications: 32, enrollments: 18, revenue: 94986 },
    { month: 'Feb', applications: 28, enrollments: 15, revenue: 78990 },
    { month: 'Mar', applications: 45, enrollments: 24, revenue: 124980 },
    { month: 'Apr', applications: 52, enrollments: 30, revenue: 158940 },
    { month: 'May', applications: 38, enrollments: 22, revenue: 115490 },
  ];

  const courseData = [
    { name: 'Full Stack', students: 45, color: '#e76f51' },
    { name: 'Mobile App', students: 32, color: '#2a9d8f' },
    { name: 'AI & Auto', students: 28, color: '#6c3483' },
    { name: 'Cloud', students: 20, color: '#1a6b8a' },
    { name: 'UI/UX', students: 38, color: '#c0392b' },
    { name: 'Marketing', students: 55, color: '#e67e22' },
    { name: 'Data Sci', students: 25, color: '#1e8449' },
  ];

  const statusData = [
    { name: 'Accepted', value: 35, color: '#27ae60' },
    { name: 'Pending',  value: 28, color: '#E8A820' },
    { name: 'Reviewing',value: 20, color: '#2196C9' },
    { name: 'Rejected', value: 17, color: '#dc4545' },
  ];

  const weeklyUsers = [
    { day: 'Mon', users: 8  },
    { day: 'Tue', users: 15 },
    { day: 'Wed', users: 12 },
    { day: 'Thu', users: 22 },
    { day: 'Fri', users: 18 },
    { day: 'Sat', users: 30 },
    { day: 'Sun', users: 25 },
  ];

  useEffect(() => {
    getAdminStats()
      .then(r => setData(r.data.data))
      .catch(() => toast.error('Failed to load stats'));
  }, []);

  if (!data) return <div className="dash-loading"><div className="dash-spinner" /></div>;
  const { stats, recentApplications, recentEnrollments } = data;

  const totalRevenue = monthlyData.reduce((s, m) => s + m.revenue, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px', boxShadow:'var(--sh)', fontSize:'.82rem' }}>
          <p style={{ fontWeight:700, color:'var(--navy)', marginBottom:4 }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, margin:'2px 0' }}>
              {p.name}: <strong>{typeof p.value === 'number' && p.name === 'revenue' ? 'Rs.' + p.value.toLocaleString('en-IN') : p.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-wrapper">
      <div className="overview-welcome">
        <h2>Analytics Dashboard</h2>
        <p>Real-time platform insights and performance metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', marginBottom:'2rem' }}>
        {[
          { icon:'👥', num: stats.totalUsers,          label:'Total Students',   color:'#2196C9' },
          { icon:'📝', num: stats.totalApplications,   label:'Applications',     color:'#E8A820' },
          { icon:'⏳', num: stats.pendingApplications, label:'Pending Review',   color:'#e67e22' },
          { icon:'📚', num: stats.totalEnrollments,    label:'Enrollments',      color:'#6c3483' },
          { icon:'💰', num: stats.paidEnrollments,     label:'Paid',             color:'#27ae60' },
          { icon:'🏢', num: stats.totalHireRequests,   label:'Hire Requests',    color:'#dc4545' },
          { icon:'💵', num: '₹' + (totalRevenue/100000).toFixed(1) + 'L', label:'Est. Revenue', color:'#1e8449' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderTop: '3px solid ' + s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-num" style={{ color: s.color }}>{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Area Chart + Pie Chart */}
      <div className="charts-row">
        <div className="chart-card chart-large">
          <div className="chart-header">
            <h3>Monthly Applications vs Enrollments</h3>
            <span className="chart-sub">Last 8 months</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyData} margin={{ top:10, right:20, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196C9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2196C9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="enrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8A820" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#E8A820" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:12, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:12 }} />
              <Area type="monotone" dataKey="applications" stroke="#2196C9" strokeWidth={2.5} fill="url(#appGrad)" name="Applications" dot={{ r:4, fill:'#2196C9' }} />
              <Area type="monotone" dataKey="enrollments" stroke="#E8A820" strokeWidth={2.5} fill="url(#enrGrad)" name="Enrollments" dot={{ r:4, fill:'#E8A820' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card chart-small">
          <div className="chart-header">
            <h3>Application Status</h3>
            <span className="chart-sub">Distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value">
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v + ' applications', n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {statusData.map(s => (
              <div key={s.name} className="pie-legend-item">
                <div className="pie-dot" style={{ background: s.color }} />
                <span>{s.name}</span>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Bar Chart + Line Chart */}
      <div className="charts-row" style={{ marginTop:'1.5rem' }}>
        <div className="chart-card chart-medium">
          <div className="chart-header">
            <h3>Students per Course</h3>
            <span className="chart-sub">Total enrolled</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={courseData} margin={{ top:10, right:10, left:0, bottom:20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize:10, fill:'#5a6a82' }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill:'rgba(27,42,74,0.04)' }} content={<CustomTooltip />} />
              <Bar dataKey="students" name="Students" radius={[6,6,0,0]}>
                {courseData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card chart-medium">
          <div className="chart-header">
            <h3>Monthly Revenue</h3>
            <span className="chart-sub">Estimated (Rs.)</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData} margin={{ top:10, right:20, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#27ae60" />
                  <stop offset="100%" stopColor="#2196C9" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} tickFormatter={v => 'Rs.' + (v/1000).toFixed(0) + 'K'} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="revenue" stroke="url(#revGrad)" strokeWidth={3} dot={{ r:5, fill:'#27ae60', strokeWidth:2, stroke:'white' }} activeDot={{ r:7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Weekly signups + Recent Activity */}
      <div className="charts-row" style={{ marginTop:'1.5rem' }}>
        <div className="chart-card" style={{ flex:1 }}>
          <div className="chart-header">
            <h3>New Signups This Week</h3>
            <span className="chart-sub">Daily registrations</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyUsers} margin={{ top:10, right:10, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize:12, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill:'rgba(27,42,74,0.04)' }} />
              <Bar dataKey="users" name="New Users" fill="#1B2A4A" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card" style={{ flex:1 }}>
          <div className="chart-header"><h3>Recent Applications</h3><span className="chart-sub">Latest 5</span></div>
          <div className="recent-list">
            {recentApplications.slice(0, 5).map(a => (
              <div key={a._id} className="recent-item">
                <div className="ri-left">
                  <div className="ri-avatar">{a.name?.[0]?.toUpperCase()}</div>
                  <div><strong>{a.name}</strong><span>{a.interest} · {a.college}</span></div>
                </div>
                {statusBadge(a.status)}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};


// ── Applications ──────────────────────────────────────────
const AdminApplications = () => {
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await getAdminApplications({ search, status: statusFilter, page, limit: 15 });
      setApps(r.data.data); setTotal(r.data.total); setPages(r.data.pages);
    } catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [search, statusFilter, page]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try { await updateApplicationStatus(id, { status }); toast.success('Status updated'); load(); }
    catch { toast.error('Update failed'); } finally { setUpdating(null); }
  };

  return (
    <div>
      <div className="admin-filters">
        <input className="admin-search" placeholder="Search name, email, college..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select className="admin-select" value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          {['all','pending','reviewing','accepted','rejected'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
          ))}
        </select>
      </div>
      <div className="admin-meta">Total: <strong>{total}</strong></div>
      {loading ? <div className="dash-loading"><div className="dash-spinner" /></div> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Interest</th><th>Duration</th><th>College</th><th>Applied</th><th>Status</th><th>Change</th></tr></thead>
            <tbody>
              {apps.map(a => (
                <tr key={a._id}>
                  <td><strong>{a.name}</strong></td>
                  <td><a href={`mailto:${a.email}`} className="email-link">{a.email}</a></td>
                  <td>{a.interest}</td>
                  <td>{a.duration === '3months' ? '3M' : '6M'}</td>
                  <td>{a.college}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>{statusBadge(a.status)}</td>
                  <td>
                    <select className="status-select" value={a.status}
                      disabled={updating === a._id}
                      onChange={e => updateStatus(a._id, e.target.value)}>
                      {['pending','reviewing','accepted','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages > 1 && (
        <div className="pagination">
          <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="btn btn-outline" style={{fontSize:'.8rem',padding:'.4rem .9rem'}}>Prev</button>
          <span>Page {page} of {pages}</span>
          <button disabled={page===pages} onClick={() => setPage(p=>p+1)} className="btn btn-outline" style={{fontSize:'.8rem',padding:'.4rem .9rem'}}>Next</button>
        </div>
      )}
    </div>
  );
};

// ── Enrollments ───────────────────────────────────────────
const AdminEnrollments = () => {
  const [enrolls, setEnrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => {
    setLoading(true);
    getAdminEnrollments({ search }).then(r => setEnrolls(r.data.data))
      .catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, [search]);
  return (
    <div>
      <div className="admin-filters">
        <input className="admin-search" placeholder="Search name, course..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? <div className="dash-loading"><div className="dash-spinner" /></div> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Course</th><th>Price</th><th>College</th><th>Enrolled On</th><th>Payment</th></tr></thead>
            <tbody>
              {enrolls.map(e => (
                <tr key={e._id}>
                  <td><strong>{e.name}</strong></td>
                  <td><a href={`mailto:${e.email}`} className="email-link">{e.email}</a></td>
                  <td>{e.courseName}</td>
                  <td>Rs.{e.coursePrice?.toLocaleString('en-IN')}</td>
                  <td>{e.college}</td>
                  <td>{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>{statusBadge(e.paymentStatus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Hire Requests ─────────────────────────────────────────
const AdminHireRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const load = () => {
    setLoading(true);
    getAdminHireRequests().then(r => setRequests(r.data.data))
      .catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };
  useEffect(load, []);
  const update = async (id, status) => {
    try { await updateHireRequest(id, { status }); toast.success('Updated!'); load(); }
    catch { toast.error('Failed'); }
  };
  return (
    <div>
      {loading ? <div className="dash-loading"><div className="dash-spinner" /></div> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Company</th><th>Name</th><th>Email</th><th>Services</th><th>Budget</th><th>Date</th><th>Status</th><th>View</th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.company}</strong></td>
                  <td>{r.name}</td>
                  <td><a href={`mailto:${r.email}`} className="email-link">{r.email}</a></td>
                  <td style={{ fontSize:'.75rem', maxWidth:'140px' }}>{r.services?.join(', ')}</td>
                  <td style={{ fontSize:'.78rem' }}>{r.budget}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <select className="status-select" value={r.status} onChange={e => update(r._id, e.target.value)}>
                      {['new','contacted','in_progress','closed'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{fontSize:'.75rem',padding:'.35rem .75rem'}}
                      onClick={() => setSelected(r)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            <h3>Project Inquiry</h3>
            <div className="hire-detail">
              <p><strong>Company:</strong> {selected.company}</p>
              <p><strong>Contact:</strong> {selected.name} · {selected.email} · {selected.phone}</p>
              <p><strong>Services:</strong> {selected.services?.join(', ')}</p>
              <p><strong>Budget:</strong> {selected.budget}</p>
              <p><strong>Description:</strong></p>
              <div className="hire-desc">{selected.description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Users ─────────────────────────────────────────────────
const AdminUsers = () => {
  const [users, setUsers]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [total, setTotal]                 = useState(0);
  const [actionLoading, setActionLoading] = useState(null);
  const [resetModal, setResetModal]       = useState(null);
  const [newPass, setNewPass]             = useState('');
  const [viewUser, setViewUser]           = useState(null);

  const load = () => {
    setLoading(true);
    getAdminUsers({ search })
      .then(r => { setUsers(r.data.data); setTotal(r.data.total); })
      .catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [search]);

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setActionLoading(id + '-delete');
    try { await API.delete(`/admin/users/${id}`); toast.success('User deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
    finally { setActionLoading(null); }
  };

  const toggleBlock = async (id, isBlocked) => {
    setActionLoading(id + '-block');
    try { await API.patch(`/admin/users/${id}/block`); toast.success(isBlocked ? 'Unblocked' : 'Blocked'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setActionLoading(null); }
  };

  const changeRole = async (id, role) => {
    try { await API.patch(`/admin/users/${id}/role`, { role }); toast.success(`Role updated`); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleResetPassword = async () => {
    if (!newPass || newPass.length < 6) { toast.error('Min. 6 characters'); return; }
    try {
      await API.patch(`/admin/users/${resetModal._id}/reset-password`, { password: newPass });
      toast.success('Password reset!'); setResetModal(null); setNewPass('');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div className="admin-filters">
        <input className="admin-search" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <span className="admin-meta">Total: <strong>{total}</strong></span>
      </div>
      {loading ? <div className="dash-loading"><div className="dash-spinner" /></div> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>College</th><th>Auth</th><th>Verified</th><th>Status</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td><a href={`mailto:${u.email}`} className="email-link">{u.email}</a></td>
                  <td>{u.college || '—'}</td>
                  <td><span className="badge-status badge-enrolled" style={{ textTransform:'capitalize' }}>{u.authProvider}</span></td>
                  <td>{u.isVerified ? <span className="badge-status badge-accepted">Yes</span> : <span className="badge-status badge-rejected">No</span>}</td>
                  <td>{u.isBlocked ? <span className="badge-status badge-rejected">Blocked</span> : <span className="badge-status badge-accepted">Active</span>}</td>
                  <td>
                    <select className="status-select" value={u.role} onChange={e => changeRole(u._id, e.target.value)}>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <div className="user-actions">
                      <button className={`ua-btn ${u.isBlocked ? 'ua-btn-green' : 'ua-btn-orange'}`}
                        disabled={actionLoading === u._id + '-block'}
                        onClick={() => toggleBlock(u._id, u.isBlocked)}>
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button className="ua-btn ua-btn-blue" onClick={() => { setResetModal(u); setNewPass(''); }}>Reset</button>
                      <button className="ua-btn" style={{background:'#e8f4fd',color:'#1B2A4A',border:'1px solid #bae6fd'}} onClick={() => setViewUser(u)}>View</button>
                      <button className="ua-btn ua-btn-red"
                        disabled={actionLoading === u._id + '-delete'}
                        onClick={() => deleteUser(u._id, u.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {viewUser && <UserDetailModal user={viewUser} onClose={() => setViewUser(null)} />}
      {resetModal && (
        <div className="modal-overlay" onClick={() => setResetModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setResetModal(null)}>×</button>
            <h3>Reset Password</h3>
            <p style={{ color:'var(--muted)', marginBottom:'1.25rem', fontSize:'.9rem' }}>
              For <strong>{resetModal.name}</strong> ({resetModal.email})
            </p>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Min. 6 characters" value={newPass}
                onChange={e => setNewPass(e.target.value)} autoFocus />
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop:'1rem' }}
              onClick={handleResetPassword}>Reset Password</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Courses Management ────────────────────────────────────
const DEFAULT_COURSE_FORM = {
  emoji:'🌐', title:'', tagline:'', desc:'', price:'', duration:'',
  level:'beginner', language:'English + Hindi', about:'', tools:'', category:'beginner',
  colors:null
};

const COLOR_PRESETS = [
  {h1:'#e76f51',h2:'#f4a261',label:'Orange'},
  {h1:'#2a9d8f',h2:'#264653',label:'Teal'},
  {h1:'#6c3483',h2:'#a569bd',label:'Purple'},
  {h1:'#1a6b8a',h2:'#2196f3',label:'Blue'},
  {h1:'#c0392b',h2:'#e74c3c',label:'Red'},
  {h1:'#e67e22',h2:'#f39c12',label:'Amber'},
  {h1:'#1e8449',h2:'#27ae60',label:'Green'},
  {h1:'#2c3e50',h2:'#3498db',label:'Navy'},
];

const AdminCourses = () => {
  const { courses, addCourse, updateCourse, deleteCourse, toggleStatus } = useCourses();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_COURSE_FORM);
  const [selectedColor, setSelectedColor] = useState(0);
  const [filter, setFilter] = useState('all');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseData = {
      ...form,
      colors: COLOR_PRESETS[selectedColor],
      desc: form.desc || form.tagline || form.about,
    };
    if (editing) {
      updateCourse(editing.id, courseData);
      toast.success('Course updated!');
    } else {
      addCourse(courseData);
      toast.success('Course added! It is now live on the home page.');
    }
    setShowModal(false); setEditing(null); setForm(DEFAULT_COURSE_FORM); setSelectedColor(0);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      emoji: c.emoji, title: c.title, tagline: c.tagline||'',
      desc: c.desc || c.tagline || '', price: c.price,
      duration: c.duration, level: c.level, language: c.language||'English + Hindi',
      about: c.about||'', tools: Array.isArray(c.tools) ? c.tools.join(', ') : (c.tools||''),
      category: c.category||c.level, colors: c.colors
    });
    const idx = COLOR_PRESETS.findIndex(cp => cp.h1 === c.colors?.h1);
    setSelectedColor(idx >= 0 ? idx : 0);
    setShowModal(true);
  };

  const filtered = filter === 'all' ? courses : courses.filter(c => c.status === filter);

  return (
    <div>
      <div className="tab-header">
        <div>
          <h2>Courses Management</h2>
          <p style={{ color:'var(--muted)', fontSize:'.85rem', marginTop:'.25rem' }}>
            {courses.filter(c=>c.status==='active').length} active · {courses.filter(c=>c.status==='inactive').length} inactive · Changes reflect on home page instantly
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(DEFAULT_COURSE_FORM); setSelectedColor(0); setShowModal(true); }}>
          + Add Course
        </button>
      </div>

      <div className="admin-filters" style={{ marginBottom:'1.25rem' }}>
        {['all','active','inactive'].map(f => (
          <button key={f}
            style={{ borderRadius:'50px', padding:'.4rem 1rem', fontSize:'.82rem', border:'1.5px solid var(--border)', cursor:'pointer', background: filter===f?'var(--navy)':'white', color: filter===f?'var(--gold)':'var(--muted)', fontFamily:'DM Sans,sans-serif', fontWeight:600, transition:'all .2s', marginRight:'.4rem' }}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)} ({f==='all'?courses.length:courses.filter(c=>c.status===f).length})
          </button>
        ))}
      </div>

      <div className="admin-courses-grid">
        {filtered.map(c => (
          <div key={c.id} className={`admin-course-card${c.status==='inactive'?' inactive':''}`}>
            {/* Card Header - same style as home page */}
            <div className="acc-card-header" style={{ background:`linear-gradient(135deg,${c.colors?.h1||'#e76f51'},${c.colors?.h2||'#f4a261'})` }}>
              <span className="acc-card-emoji">{c.emoji}</span>
              <span className="acc-card-badge">{c.level?.charAt(0).toUpperCase()+c.level?.slice(1)}</span>
              {c.status === 'inactive' && <span className="acc-inactive-badge">Inactive</span>}
            </div>
            {/* Card Body */}
            <div className="acc-card-body">
              <h4>{c.title}</h4>
              <p>{c.desc || c.tagline || c.about || 'No description'}</p>
              <div className="acc-card-meta">
                <span>⏱ {c.duration}</span>
                <span>📊 {c.level?.charAt(0).toUpperCase()+c.level?.slice(1)}</span>
              </div>
              <div className="acc-card-tools">
                {(Array.isArray(c.tools) ? c.tools : (c.tools||'').split(','))
                  .slice(0,4).filter(Boolean).map(t => <span key={t} className="acc-tool">{t.trim()}</span>)}
              </div>
              <div className="acc-card-footer">
                <div className="acc-card-price">
                  <small>Starting at</small>
                  <strong>₹{Number(c.price).toLocaleString('en-IN')}</strong>
                </div>
                <div className="acc-actions-row">
                  <button className="ua-btn ua-btn-blue" onClick={() => openEdit(c)}>Edit</button>
                  <button className={`ua-btn ${c.status==='active'?'ua-btn-orange':'ua-btn-green'}`} onClick={() => { toggleStatus(c.id); toast.success(c.status==='active'?'Course deactivated':'Course activated!'); }}>
                    {c.status==='active'?'Deactivate':'Activate'}
                  </button>
                  <button className="ua-btn ua-btn-red" onClick={() => { if(window.confirm('Delete this course?')){ deleteCourse(c.id); toast.success('Deleted'); } }}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target===e.currentTarget && setShowModal(false)}>
          <div className="modal-box" style={{ maxWidth:'580px', maxHeight:'88vh', overflowY:'auto' }}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h3>{editing ? 'Edit Course' : 'Add New Course'}</h3>

            {/* Live Preview */}
            <div className="course-preview">
              <div className="cp-label">Live Preview</div>
              <div className="cp-card">
                <div className="cp-header" style={{ background:`linear-gradient(135deg,${COLOR_PRESETS[selectedColor].h1},${COLOR_PRESETS[selectedColor].h2})` }}>
                  <span style={{ fontSize:'1.8rem' }}>{form.emoji||'🎓'}</span>
                  <span className="cc-badge">{form.level?.charAt(0).toUpperCase()+form.level?.slice(1)||'Beginner'}</span>
                </div>
                <div className="cp-body">
                  <strong>{form.title||'Course Title'}</strong>
                  <p>{form.desc||form.tagline||'Course description...'}</p>
                  <div className="cp-price">₹{form.price?Number(form.price).toLocaleString('en-IN'):'0'}</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop:'1.25rem' }}>
              {/* Color Picker */}
              <div className="form-group">
                <label>Card Color Theme *</label>
                <div className="color-picker">
                  {COLOR_PRESETS.map((c, i) => (
                    <button key={i} type="button"
                      className={`color-swatch${selectedColor===i?' selected':''}`}
                      style={{ background:`linear-gradient(135deg,${c.h1},${c.h2})` }}
                      onClick={() => setSelectedColor(i)}
                      title={c.label}>
                      {selectedColor===i && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Emoji *</label>
                  <input value={form.emoji} onChange={e => set('emoji',e.target.value)} placeholder="e.g. 🌐" required />
                </div>
                <div className="form-group">
                  <label>Level *</label>
                  <select value={form.level} onChange={e => set('level',e.target.value)}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Course Title *</label>
                <input value={form.title} onChange={e => set('title',e.target.value)} placeholder="e.g. Full Stack Web Development" required />
              </div>

              <div className="form-group">
                <label>Short Description *</label>
                <textarea rows="2" value={form.desc} onChange={e => set('desc',e.target.value)} placeholder="Shown on course card..." required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => set('price',e.target.value)} placeholder="4999" required />
                </div>
                <div className="form-group">
                  <label>Duration *</label>
                  <input value={form.duration} onChange={e => set('duration',e.target.value)} placeholder="e.g. 12 Weeks" required />
                </div>
              </div>

              <div className="form-group">
                <label>Tools (comma separated) *</label>
                <input value={form.tools} onChange={e => set('tools',e.target.value)} placeholder="React, Node.js, MongoDB, Git" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Language</label>
                  <input value={form.language} onChange={e => set('language',e.target.value)} placeholder="English + Hindi" />
                </div>
                <div className="form-group">
                  <label>Tagline</label>
                  <input value={form.tagline} onChange={e => set('tagline',e.target.value)} placeholder="One-line course tagline" />
                </div>
              </div>

              <div className="form-group">
                <label>Full Description</label>
                <textarea rows="3" value={form.about} onChange={e => set('about',e.target.value)} placeholder="Detailed course description for course detail page..." />
              </div>

              <div style={{ display:'flex', gap:'.75rem', marginTop:'1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1 }}>
                  {editing ? '✓ Update Course' : '+ Add Course to Platform'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex:1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Projects Management ───────────────────────────────────
const DEFAULT_PROJECT = {
  title:'', client:'', category:'Web Development', tech:'', status:'ongoing',
  description:'', teamSize:'', duration:'', completedDate:'', liveUrl:''
};

const AdminProjects = () => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('admin_projects');
    return saved ? JSON.parse(saved) : [
      { id:1, title:'E-Commerce Platform', client:'RetailEdge Solutions', category:'Web Development', tech:'React, Node.js, MongoDB', status:'completed', description:'Full e-commerce platform with payment integration.', teamSize:'4', duration:'8 weeks', liveUrl:'', completedDate:'2024-01-15' },
      { id:2, title:'AI Customer Support Bot', client:'TechCorp India', category:'AI & Automation', tech:'Python, OpenAI, LangChain', status:'ongoing', description:'AI-powered customer support chatbot.', teamSize:'3', duration:'6 weeks', liveUrl:'', completedDate:'' },
      { id:3, title:'Mobile Delivery App', client:'QuickDeliver', category:'App Development', tech:'Flutter, Firebase', status:'completed', description:'Cross-platform food delivery app.', teamSize:'5', duration:'10 weeks', liveUrl:'', completedDate:'2024-02-20' },
    ];
  });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_PROJECT);
  const [filter, setFilter] = useState('all');

  const save = (data) => { localStorage.setItem('admin_projects', JSON.stringify(data)); setProjects(data); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      save(projects.map(p => p.id === editing.id ? { ...p, ...form } : p));
      toast.success('Project updated!');
    } else {
      save([...projects, { ...form, id: Date.now() }]);
      toast.success('Project added!');
    }
    setShowModal(false); setEditing(null); setForm(DEFAULT_PROJECT);
  };

  const deleteProject = (id) => {
    if (!window.confirm('Delete this project?')) return;
    save(projects.filter(p => p.id !== id)); toast.success('Project deleted');
  };

  const openEdit = (p) => { setEditing(p); setForm({...p}); setShowModal(true); };

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  const STATUS_COLORS = { completed:'#27ae60', ongoing:'#2196C9', paused:'#e67e22', cancelled:'#dc4545' };

  return (
    <div>
      <div className="tab-header">
        <h2>Projects Management</h2>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(DEFAULT_PROJECT); setShowModal(true); }}>
          + Add Project
        </button>
      </div>

      <div className="admin-filters" style={{ marginBottom:'1.25rem' }}>
        {['all','ongoing','completed','paused','cancelled'].map(f => (
          <button key={f} className={`cf-btn${filter===f?' active':''}`}
            style={{ borderRadius:'50px', padding:'.4rem 1rem', fontSize:'.82rem', border:'1.5px solid var(--border)', cursor:'pointer', background: filter===f?'var(--navy)':'white', color: filter===f?'var(--gold)':'var(--muted)', fontFamily:'DM Sans,sans-serif', fontWeight:600, transition:'all .2s' }}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)} ({f==='all'?projects.length:projects.filter(p=>p.status===f).length})
          </button>
        ))}
      </div>

      <div className="admin-projects-grid">
        {filtered.map(p => (
          <div key={p.id} className="admin-project-card">
            <div className="apc-top">
              <div className="apc-info">
                <h4>{p.title}</h4>
                <span className="apc-client">{p.client}</span>
              </div>
              <span className="apc-status" style={{ background: STATUS_COLORS[p.status]+'22', color: STATUS_COLORS[p.status], border:`1px solid ${STATUS_COLORS[p.status]}44` }}>
                {p.status}
              </span>
            </div>
            <div className="apc-meta">
              <span className="apc-cat">{p.category}</span>
              <span>Team: {p.teamSize || '—'}</span>
              <span>{p.duration || '—'}</span>
            </div>
            <p className="apc-desc">{p.description}</p>
            <div className="apc-tech">{p.tech.split(',').map(t => <span key={t} className="cd-tool-tag">{t.trim()}</span>)}</div>
            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="apc-link">View Live</a>}
            <div className="acc-actions" style={{ marginTop:'.85rem' }}>
              <button className="ua-btn ua-btn-blue" onClick={() => openEdit(p)}>Edit</button>
              <button className="ua-btn ua-btn-red" onClick={() => deleteProject(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box" style={{ maxWidth:'560px', maxHeight:'85vh', overflowY:'auto' }}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h3>{editing ? 'Edit Project' : 'Add New Project'}</h3>
            <form onSubmit={handleSubmit} style={{ marginTop:'1.25rem' }}>
              <div className="form-group">
                <label>Project Title *</label>
                <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. E-Commerce Platform" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Client Name *</label>
                  <input value={form.client} onChange={e => setForm(f=>({...f,client:e.target.value}))} placeholder="Client company name" required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                    {['Web Development','App Development','AI & Automation','Cloud Solutions','UI/UX Design','Digital Marketing','Data Science'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Tech Stack (comma separated) *</label>
                <input value={form.tech} onChange={e => setForm(f=>({...f,tech:e.target.value}))} placeholder="React, Node.js, MongoDB" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status *</label>
                  <select value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))}>
                    {['ongoing','completed','paused','cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Team Size</label>
                  <input type="number" value={form.teamSize} onChange={e => setForm(f=>({...f,teamSize:e.target.value}))} placeholder="e.g. 4" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input value={form.duration} onChange={e => setForm(f=>({...f,duration:e.target.value}))} placeholder="e.g. 8 weeks" />
                </div>
                <div className="form-group">
                  <label>Completed Date</label>
                  <input type="date" value={form.completedDate} onChange={e => setForm(f=>({...f,completedDate:e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label>Live URL</label>
                <input value={form.liveUrl} onChange={e => setForm(f=>({...f,liveUrl:e.target.value}))} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea rows="3" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Project description..." required />
              </div>
              <div style={{ display:'flex', gap:'.75rem', marginTop:'1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1 }}>
                  {editing ? 'Update Project' : 'Add Project'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex:1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
// ── User Detail Analytics Modal ───────────────────────────
const UserDetailModal = ({ user: u, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const activityData = [
    { week: 'Week 1', lectures: 8,  practice: 5,  sessions: 2 },
    { week: 'Week 2', lectures: 12, practice: 8,  sessions: 3 },
    { week: 'Week 3', lectures: 10, practice: 12, sessions: 2 },
    { week: 'Week 4', lectures: 15, practice: 10, sessions: 4 },
    { week: 'Week 5', lectures: 11, practice: 15, sessions: 3 },
    { week: 'Week 6', lectures: 18, practice: 18, sessions: 5 },
  ];

  const skillData = [
    { subject: 'HTML/CSS',     A: 85 },
    { subject: 'JavaScript',   A: 72 },
    { subject: 'React',        A: 68 },
    { subject: 'Node.js',      A: 60 },
    { subject: 'Database',     A: 55 },
    { subject: 'Deployment',   A: 45 },
  ];

  const dailyLogin = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.0 },
    { day: 'Fri', hours: 4.1 },
    { day: 'Sat', hours: 5.5 },
    { day: 'Sun', hours: 3.8 },
  ];

  const progressData = [
    { name: 'Completed', value: 65, color: '#27ae60' },
    { name: 'In Progress', value: 25, color: '#2196C9' },
    { name: 'Pending', value: 10, color: '#E8A820' },
  ];

  const TABS = [
    { id: 'overview',  label: 'Overview' },
    { id: 'activity',  label: 'Activity' },
    { id: 'progress',  label: 'Progress' },
    { id: 'sessions',  label: 'Sessions' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', boxShadow:'var(--sh)', fontSize:'.8rem' }}>
          <p style={{ fontWeight:700, color:'var(--navy)', marginBottom:3 }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color:p.color, margin:'2px 0' }}>{p.name}: <strong>{p.value}</strong></p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ud-modal">
        {/* Header */}
        <div className="ud-header">
          <button className="ud-close" onClick={onClose}>×</button>
          <div className="ud-profile">
            <div className="ud-avatar">{u.name?.[0]?.toUpperCase()}</div>
            <div className="ud-info">
              <h2>{u.name}</h2>
              <p>{u.email} · {u.phone || 'No phone'}</p>
              <div className="ud-tags">
                <span className={`ud-tag ${u.isVerified ? 'green' : 'red'}`}>{u.isVerified ? '✓ Verified' : '✗ Unverified'}</span>
                <span className={`ud-tag ${u.isBlocked ? 'red' : 'green'}`}>{u.isBlocked ? '🚫 Blocked' : '✓ Active'}</span>
                <span className="ud-tag blue">{u.authProvider}</span>
                {u.college && <span className="ud-tag navy">{u.college}</span>}
                {u.interest && <span className="ud-tag gold">{u.interest}</span>}
              </div>
            </div>
          </div>
          {/* Quick stats */}
          <div className="ud-quick-stats">
            {[
              { icon:<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'/><path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'/></svg>, val:'3',    label:'Courses' },
              { icon:<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>, val:'142h', label:'Hours Logged' },
              { icon:<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='12' r='10'/><circle cx='12' cy='12' r='6'/><circle cx='12' cy='12' r='2'/></svg>, val:'89%',  label:'Attendance' },
              { icon:<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6'/><path d='M18 9h1.5a2.5 2.5 0 0 0 0-5H18'/><path d='M4 22h16'/><path d='M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22'/><path d='M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22'/><path d='M18 2H6v7a6 6 0 0 0 12 0V2z'/></svg>, val:'12',   label:'Assignments' },
              { icon:<svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>, val:'4.2',  label:'Avg Score' },
              { icon:<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z'/></svg>, val:'18',   label:'Day Streak' },
            ].map(s => (
              <div key={s.label} className="ud-qs">
                <span>{s.icon}</span>
                <strong>{s.val}</strong>
                <small>{s.label}</small>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="ud-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`ud-tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* Body */}
        <div className="ud-body">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="ud-section">
              <div className="ud-charts-row">
                {/* Weekly Activity Area Chart */}
                <div className="ud-chart-card" style={{ flex: 2 }}>
                  <div className="ud-chart-title">Weekly Learning Activity</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={activityData} margin={{ top:10, right:10, left:-20, bottom:0 }}>
                      <defs>
                        <linearGradient id="lgGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2196C9" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2196C9" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E8A820" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#E8A820" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="seGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#27ae60" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#27ae60" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                      <XAxis dataKey="week" tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize:11 }} />
                      <Area type="monotone" dataKey="lectures" stroke="#2196C9" strokeWidth={2} fill="url(#lgGrad)" name="Lectures" dot={{ r:3 }} />
                      <Area type="monotone" dataKey="practice" stroke="#E8A820" strokeWidth={2} fill="url(#prGrad)" name="Practice" dot={{ r:3 }} />
                      <Area type="monotone" dataKey="sessions" stroke="#27ae60" strokeWidth={2} fill="url(#seGrad)" name="Live Sessions" dot={{ r:3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Course Progress Donut */}
                <div className="ud-chart-card" style={{ flex: 1 }}>
                  <div className="ud-chart-title">Overall Progress</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={progressData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                        paddingAngle={3} dataKey="value">
                        {progressData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [v + '%', '']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-legend">
                    {progressData.map(s => (
                      <div key={s.name} className="pie-legend-item">
                        <div className="pie-dot" style={{ background: s.color }} />
                        <span>{s.name}</span>
                        <strong>{s.value}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="ud-info-grid">
                <div className="ud-info-card">
                  <div className="ud-ic-icon">👤</div>
                  <div className="ud-ic-content">
                    <div className="ud-ic-label">Full Name</div>
                    <div className="ud-ic-value">{u.name}</div>
                  </div>
                </div>
                <div className="ud-info-card">
                  <div className="ud-ic-icon">📧</div>
                  <div className="ud-ic-content">
                    <div className="ud-ic-label">Email</div>
                    <div className="ud-ic-value">{u.email}</div>
                  </div>
                </div>
                <div className="ud-info-card">
                  <div className="ud-ic-icon">🎓</div>
                  <div className="ud-ic-content">
                    <div className="ud-ic-label">College</div>
                    <div className="ud-ic-value">{u.college || '—'}</div>
                  </div>
                </div>
                <div className="ud-info-card">
                  <div className="ud-ic-icon">📅</div>
                  <div className="ud-ic-content">
                    <div className="ud-ic-label">Year</div>
                    <div className="ud-ic-value">{u.year || '—'}</div>
                  </div>
                </div>
                <div className="ud-info-card">
                  <div className="ud-ic-icon">💡</div>
                  <div className="ud-ic-content">
                    <div className="ud-ic-label">Interest</div>
                    <div className="ud-ic-value">{u.interest || '—'}</div>
                  </div>
                </div>
                <div className="ud-info-card">
                  <div className="ud-ic-icon">🔑</div>
                  <div className="ud-ic-content">
                    <div className="ud-ic-label">Auth Provider</div>
                    <div className="ud-ic-value" style={{ textTransform:'capitalize' }}>{u.authProvider}</div>
                  </div>
                </div>
                <div className="ud-info-card">
                  <div className="ud-ic-icon">📅</div>
                  <div className="ud-ic-content">
                    <div className="ud-ic-label">Joined On</div>
                    <div className="ud-ic-value">{new Date(u.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
                  </div>
                </div>
                <div className="ud-info-card">
                  <div className="ud-ic-icon">📱</div>
                  <div className="ud-ic-content">
                    <div className="ud-ic-label">Phone</div>
                    <div className="ud-ic-value">{u.phone || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="ud-section">
              <div className="ud-charts-row">
                {/* Daily Hours Bar */}
                <div className="ud-chart-card" style={{ flex: 1 }}>
                  <div className="ud-chart-title">Daily Study Hours (This Week)</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dailyLogin} margin={{ top:10, right:10, left:-20, bottom:0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize:12, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} unit="h" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="hours" name="Hours" fill="#1B2A4A" radius={[6,6,0,0]}>
                        {dailyLogin.map((e, i) => (
                          <Cell key={i} fill={e.hours >= 4 ? '#E8A820' : e.hours >= 3 ? '#2196C9' : '#1B2A4A'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Skill Breakdown Bar */}
                <div className="ud-chart-card" style={{ flex: 1 }}>
                  <div className="ud-chart-title">Skill Proficiency (%)</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={skillData} layout="vertical" margin={{ top:5, right:20, left:20, bottom:5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" horizontal={false} />
                      <XAxis type="number" domain={[0,100]} tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} unit="%" />
                      <YAxis type="category" dataKey="subject" tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} width={75} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="A" name="Proficiency" radius={[0,6,6,0]} fill="#2196C9">
                        {skillData.map((e, i) => (
                          <Cell key={i} fill={e.A >= 75 ? '#27ae60' : e.A >= 60 ? '#2196C9' : e.A >= 45 ? '#E8A820' : '#dc4545'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="ud-chart-card" style={{ marginTop:'1.25rem' }}>
                <div className="ud-chart-title">Recent Activity Log</div>
                <div className="activity-timeline">
                  {[
                    { time:'Today, 10:30 AM',  action:'Completed React Hooks lecture',        type:'lecture',  icon:'video' },
                    { time:'Today, 9:00 AM',   action:'Submitted Assignment #8 — Todo App',   type:'assignment',icon:'file' },
                    { time:'Yesterday, 3 PM',  action:'Attended Live Session: Node.js APIs',   type:'session',  icon:'video' },
                    { time:'Yesterday, 11 AM', action:'Completed practice: JavaScript ES6',    type:'practice', icon:'code' },
                    { time:'2 days ago',       action:'Started MongoDB module',                type:'lecture',  icon:'book' },
                    { time:'3 days ago',       action:'Scored 88% in CSS quiz',                type:'quiz',     icon:'target' },
                    { time:'4 days ago',       action:'Attended Live Session: React Basics',   type:'session',  icon:'video' },
                    { time:'5 days ago',       action:'Completed HTML5 module — 100%',         type:'complete', icon:'check' },
                  ].map((a, i) => (
                    <div key={i} className="at-item">
                      <div className={`at-dot ${a.type}`} />
                      <div className="at-icon">
                        {a.icon === 'video'  && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
                        {a.icon === 'file'   && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                        {a.icon === 'code'   && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>}
                        {a.icon === 'book'   && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
                        {a.icon === 'target' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>}
                        {a.icon === 'check'  && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <div className="at-content">
                        <div className="at-action">{a.action}</div>
                        <div className="at-time">{a.time}</div>
                      </div>
                      <span className={`at-badge ${a.type}`}>{a.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="ud-section">
              <div className="ud-charts-row">
                <div className="ud-chart-card" style={{ flex:1 }}>
                  <div className="ud-chart-title">Lectures Attended vs Total</div>
                  <div className="progress-modules">
                    {[
                      { name:'HTML & CSS',    done:12, total:12, color:'#27ae60' },
                      { name:'JavaScript',    done:18, total:24, color:'#2196C9' },
                      { name:'React.js',      done:10, total:20, color:'#6c3483' },
                      { name:'Node.js',       done:6,  total:16, color:'#e67e22' },
                      { name:'MongoDB',       done:4,  total:12, color:'#1e8449' },
                      { name:'Deployment',    done:0,  total:8,  color:'#dc4545' },
                    ].map(m => (
                      <div key={m.name} className="pm-item">
                        <div className="pm-header">
                          <span className="pm-name">{m.name}</span>
                          <span className="pm-count">{m.done}/{m.total}</span>
                        </div>
                        <div className="pm-bar">
                          <div className="pm-fill" style={{ width: `${(m.done/m.total)*100}%`, background: m.color }} />
                        </div>
                        <span className="pm-pct" style={{ color: m.color }}>{Math.round((m.done/m.total)*100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ud-chart-card" style={{ flex:1 }}>
                  <div className="ud-chart-title">Assignment Scores</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={[
                      { num:'A1', score:72 },
                      { num:'A2', score:78 },
                      { num:'A3', score:85 },
                      { num:'A4', score:80 },
                      { num:'A5', score:88 },
                      { num:'A6', score:82 },
                      { num:'A7', score:91 },
                      { num:'A8', score:88 },
                    ]} margin={{ top:10, right:20, left:-20, bottom:0 }}>
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

              {/* Course Cards */}
              <div style={{ marginTop:'1.25rem' }}>
                <div className="ud-chart-title" style={{ marginBottom:'.85rem' }}>Enrolled Courses</div>
                <div className="enrolled-courses">
                  {[
                    { name:'Full Stack Web Development', progress:65, status:'active',    paid:true,  start:'Jan 2024' },
                    { name:'UI/UX Design',               progress:100, status:'completed', paid:true,  start:'Nov 2023' },
                    { name:'Digital Marketing',          progress:30,  status:'active',    paid:false, start:'Feb 2024' },
                  ].map((c, i) => (
                    <div key={i} className="ec-card">
                      <div className="ec-info">
                        <h4>{c.name}</h4>
                        <div className="ec-meta">
                          <span>Started: {c.start}</span>
                          <span className={`ec-badge ${c.status}`}>{c.status}</span>
                          <span className={`ec-badge ${c.paid ? 'paid' : 'pending'}`}>{c.paid ? 'Paid' : 'Pending Payment'}</span>
                        </div>
                      </div>
                      <div className="ec-progress">
                        <div className="ec-pct">{c.progress}%</div>
                        <div className="ec-bar"><div className="ec-fill" style={{ width:`${c.progress}%`, background: c.progress === 100 ? '#27ae60' : '#2196C9' }} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="ud-section">
              <div className="ud-charts-row">
                <div className="ud-chart-card" style={{ flex:1 }}>
                  <div className="ud-chart-title">Live Sessions Attendance</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={activityData} margin={{ top:10, right:10, left:-20, bottom:0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#5a6a82' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="sessions" name="Sessions Attended" fill="#27ae60" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="ud-chart-card" style={{ flex:1 }}>
                  <div className="ud-chart-title">Session Summary</div>
                  <div className="session-stats">
                    {[
                      { label:'Total Sessions Scheduled', val:'24',  icon:'📅', color:'#1B2A4A' },
                      { label:'Sessions Attended',        val:'19',  icon:'✅', color:'#27ae60' },
                      { label:'Sessions Missed',          val:'5',   icon:'❌', color:'#dc4545' },
                      { label:'Attendance Rate',          val:'79%', icon:'📊', color:'#2196C9' },
                      { label:'Avg Session Duration',     val:'55 min', icon:'⏱️', color:'#e67e22' },
                      { label:'Practice Hours Total',     val:'68h', icon:'💻', color:'#6c3483' },
                    ].map((s, i) => (
                      <div key={i} className="ss-item">
                        <span className="ss-icon">{s.icon}</span>
                        <span className="ss-label">{s.label}</span>
                        <strong className="ss-val" style={{ color: s.color }}>{s.val}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming / Past sessions table */}
              <div className="ud-chart-card" style={{ marginTop:'1.25rem' }}>
                <div className="ud-chart-title">Session History</div>
                <div className="table-wrap" style={{ marginTop:'.75rem' }}>
                  <table className="data-table">
                    <thead>
                      <tr><th>Session</th><th>Topic</th><th>Date</th><th>Duration</th><th>Status</th><th>Score</th></tr>
                    </thead>
                    <tbody>
                      {[
                        { name:'Live Session #19', topic:'Node.js REST APIs',    date:'01 May 2024', dur:'60 min', status:'attended', score:'92%' },
                        { name:'Live Session #18', topic:'React Hooks Deep Dive',date:'28 Apr 2024', dur:'55 min', status:'attended', score:'88%' },
                        { name:'Live Session #17', topic:'MongoDB Aggregation',  date:'25 Apr 2024', dur:'60 min', status:'missed',   score:'—'  },
                        { name:'Live Session #16', topic:'Express Middleware',   date:'22 Apr 2024', dur:'50 min', status:'attended', score:'85%' },
                        { name:'Live Session #15', topic:'JS Async/Await',       date:'19 Apr 2024', dur:'55 min', status:'attended', score:'90%' },
                        { name:'Live Session #14', topic:'CSS Grid & Flexbox',   date:'16 Apr 2024', dur:'45 min', status:'missed',   score:'—'  },
                      ].map((s, i) => (
                        <tr key={i}>
                          <td><strong>{s.name}</strong></td>
                          <td>{s.topic}</td>
                          <td>{s.date}</td>
                          <td>{s.dur}</td>
                          <td><span className={`badge-status ${s.status === 'attended' ? 'badge-accepted' : 'badge-rejected'}`}>{s.status}</span></td>
                          <td><strong style={{ color: s.score !== '—' ? '#27ae60' : '#dc4545' }}>{s.score}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ── Admins Tab ────────────────────────────────────────────
const AdminsTab = () => {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    API.get('/admin/admins')
      .then(r => setAdmins(r.data.data))
      .catch(() => toast.error('Failed to load admins'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (admin) => {
    if (admin._id === currentUser?._id) { toast.error('You cannot delete yourself'); return; }
    if (!window.confirm(`Delete admin "${admin.name}"? This cannot be undone.`)) return;
    setDeleting(admin._id);
    try {
      await API.delete(`/admin/admins/${admin._id}`);
      toast.success('Admin deleted!');
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally { setDeleting(null); }
  };

  if (loading) return <div className="dash-loading"><div className="dash-spinner" /></div>;

  return (
    <div>
      <div className="tab-header">
        <div>
          <h2>Admin Accounts</h2>
          <p style={{ color:'var(--muted)', fontSize:'.85rem', marginTop:'.2rem' }}>
            {admins.length} admin{admins.length !== 1 ? 's' : ''} have access to this panel
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem', background:'rgba(220,69,69,.1)', color:'#dc4545', border:'1px solid rgba(220,69,69,.25)', padding:'.5rem 1.25rem', borderRadius:'50px', fontWeight:700, fontSize:'.88rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          {admins.length} Admin{admins.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem', marginBottom:'1.75rem' }}>
        {[
          { color:'#dc4545', bg:'rgba(220,69,69,.1)',  num:admins.length, label:'Total Admins' },
          { color:'#27ae60', bg:'rgba(39,174,96,.1)',  num:admins.filter(a=>a.isVerified).length, label:'Verified' },
          { color:'#2196C9', bg:'rgba(33,150,201,.1)', num:admins.filter(a=>a.authProvider==='local').length, label:'Local Auth' },
          { color:'#E8A820', bg:'rgba(232,168,32,.1)', num:admins.filter(a=>a._id!==currentUser?._id).length, label:'Other Admins' },
        ].map((s,i) => (
          <div key={i} style={{ background:'white', borderRadius:'var(--r)', padding:'1.25rem', display:'flex', alignItems:'center', gap:'1rem', boxShadow:'var(--sh)', border:'1px solid var(--border)' }}>
            <div style={{ width:48, height:48, borderRadius:12, background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:900, color:s.color, lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:'.72rem', color:'var(--muted)', marginTop:2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
        {admins.map(a => (
          <div key={a._id} style={{ background:'white', borderRadius:'var(--r)', padding:'1.5rem', boxShadow:'var(--sh)', border: a._id===currentUser?._id ? '2px solid #E8A820' : '1px solid var(--border)', position:'relative' }}>
            {a._id === currentUser?._id && (
              <div style={{ position:'absolute', top:'1rem', right:'1rem', background:'#E8A820', color:'var(--navy)', fontSize:'.65rem', fontWeight:800, padding:'.2rem .65rem', borderRadius:'50px' }}>YOU</div>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
              <div style={{ width:54, height:54, borderRadius:'50%', background:'linear-gradient(135deg,#dc4545,#ff6b6b)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'1.3rem', flexShrink:0 }}>
                {a.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight:700, color:'var(--navy)', fontSize:'1rem', marginBottom:'.2rem' }}>{a.name}</div>
                <div style={{ fontSize:'.78rem', color:'var(--muted)', marginBottom:'.4rem' }}>{a.email}</div>
                <div style={{ display:'flex', gap:'.35rem' }}>
                  <span style={{ fontSize:'.65rem', fontWeight:700, padding:'.18rem .6rem', borderRadius:'50px', background:a.isVerified?'rgba(39,174,96,.1)':'rgba(220,69,69,.1)', color:a.isVerified?'#27ae60':'#dc4545', border:`1px solid ${a.isVerified?'rgba(39,174,96,.25)':'rgba(220,69,69,.25)'}` }}>{a.isVerified?'✓ Verified':'✗ Unverified'}</span>
                  <span style={{ fontSize:'.65rem', fontWeight:700, padding:'.18rem .6rem', borderRadius:'50px', background:'rgba(33,150,201,.1)', color:'#2196C9', border:'1px solid rgba(33,150,201,.25)', textTransform:'capitalize' }}>{a.authProvider}</span>
                </div>
              </div>
            </div>
            <div style={{ fontSize:'.8rem', color:'var(--muted)', marginBottom:'1rem', display:'flex', flexDirection:'column', gap:'.35rem' }}>
              <span>Joined: {new Date(a.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
              {a.phone && <span>Phone: {a.phone}</span>}
              {a.college && <span>College: {a.college}</span>}
            </div>
            <div style={{ display:'flex', gap:'.5rem' }}>
              <button onClick={() => setSelected(a)} style={{ flex:1, padding:'.6rem', background:'var(--navy)', color:'white', border:'none', borderRadius:'var(--rsm)', fontWeight:700, fontSize:'.82rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                View Details
              </button>
              {a._id !== currentUser?._id && (
                <button disabled={deleting===a._id} onClick={() => handleDelete(a)} style={{ padding:'.6rem .9rem', background:'rgba(220,69,69,.1)', color:'#dc4545', border:'1px solid rgba(220,69,69,.25)', borderRadius:'var(--rsm)', fontWeight:700, fontSize:'.82rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", opacity:deleting===a._id?.5:1 }}>
                  {deleting===a._id?'...':'Delete'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={(e) => e.target===e.currentTarget && setSelected(null)}>
          <div className="modal-box" style={{ maxWidth:'480px' }}>
            <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', paddingBottom:'1.25rem', borderBottom:'1px solid var(--border)', marginBottom:'1.5rem' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#dc4545,#ff6b6b)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'1.6rem', flexShrink:0 }}>{selected.name?.[0]?.toUpperCase()}</div>
              <div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", color:'var(--navy)', marginBottom:'.3rem' }}>{selected.name}</h3>
                <span style={{ fontSize:'.75rem', background:'rgba(220,69,69,.1)', color:'#dc4545', padding:'.2rem .65rem', borderRadius:'50px', fontWeight:700 }}>Administrator</span>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
              {[
                ['Email', selected.email],
                ['Phone', selected.phone||'—'],
                ['College', selected.college||'—'],
                ['Joined', new Date(selected.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})],
                ['Auth Provider', selected.authProvider],
                ['Verified', selected.isVerified?'Yes ✓':'No ✗'],
              ].map(([label, val], i) => (
                <div key={i} style={{ background:'var(--cream)', borderRadius:10, padding:'.85rem 1rem', border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:'.68rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'.15rem' }}>{label}</div>
                  <div style={{ fontSize:'.9rem', fontWeight:600, color:'var(--navy)', wordBreak:'break-all' }}>{val}</div>
                </div>
              ))}
            </div>
            {selected._id !== currentUser?._id && (
              <button disabled={deleting===selected._id} onClick={() => handleDelete(selected)} style={{ width:'100%', marginTop:'1.25rem', padding:'.75rem', background:'#dc4545', color:'white', border:'none', borderRadius:'var(--rsm)', fontWeight:700, fontSize:'.9rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", opacity:deleting===selected._id?.5:1 }}>
                {deleting===selected._id?'Deleting...':'Delete This Admin'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
