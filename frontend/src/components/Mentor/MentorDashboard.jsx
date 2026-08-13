import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard, CalendarDays, Users, BarChart3, ClipboardList, CheckSquare,
  FolderKanban, MessageSquare, Megaphone, Bell, FileText, UserCircle, Settings,
  LogOut, Menu, X, Plus, Search, ChevronRight, Clock3, Video, MapPin,
  AlertTriangle, CheckCircle2, Circle, Send, Star, ExternalLink, Save,
  PlayCircle, MoreHorizontal, UserPlus, BookOpen, TrendingUp, Activity,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  getMentorDashboard, getMentorStudents, getMentorStudent, getMentorClasses,
  createMentorClass, updateMentorClassStatus, saveMentorAttendance,
  getMentorAssignments, createMentorAssignment, getMentorSubmissions,
  reviewMentorSubmission, getMentorProjects, updateMentorProject,
  getMentorMessages, sendMentorMessage, sendMentorAnnouncement,
  getMentorNotifications, markMentorNotificationRead, getMentorReports,
  addMentorNote, updateMentorProfile, changePassword
} from '../../utils/api';

const fmtDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric'
}) : '—';

const fmtTime = (value) => value || '—';

const initials = (name = '') => name.split(' ').map(x => x[0]).join('').slice(0,2).toUpperCase() || 'M';

const StatCard = ({ icon, label, value, hint, danger }) => (
  <div className={`mentor-stat-card ${danger ? 'danger' : ''}`}>
    <div className="mentor-stat-icon">{icon}</div>
    <div>
      <div className="mentor-stat-value">{value}</div>
      <div className="mentor-stat-label">{label}</div>
      {hint && <div className="mentor-stat-hint">{hint}</div>}
    </div>
  </div>
);

const ProgressBar = ({ value = 0 }) => (
  <div className="mentor-progress">
    <div style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

function MentorDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const loadDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const res = await getMentorDashboard();
      setData(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load mentor dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadStudents = async () => {
    const res = await getMentorStudents();
    setStudents(res.data.data || []);
  };

  const loadClasses = async () => {
    const res = await getMentorClasses();
    setClasses(res.data.data || []);
  };

  const loadAssignments = async () => {
    const [a, s] = await Promise.all([getMentorAssignments(), getMentorSubmissions()]);
    setAssignments(a.data.data || []);
    setSubmissions(s.data.data || []);
  };

  const loadProjects = async () => {
    const res = await getMentorProjects();
    setProjects(res.data.data || []);
  };

  const loadMessages = async () => {
    const res = await getMentorMessages();
    setMessages(res.data.data || []);
  };

  const loadNotifications = async () => {
    const res = await getMentorNotifications();
    setNotifications(res.data.data || []);
  };

  const loadReports = async () => {
    const res = await getMentorReports();
    setReports(res.data.data);
  };

  const loadAll = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [d, s, c, a, p, m, n, r] = await Promise.all([
        getMentorDashboard(), getMentorStudents(), getMentorClasses(),
        getMentorAssignments(), getMentorProjects(), getMentorMessages(),
        getMentorNotifications(), getMentorReports()
      ]);
      setData(d.data.data);
      setStudents(s.data.data || []);
      setClasses(c.data.data || []);
      setAssignments(a.data.data || []);
      setSubmissions((await getMentorSubmissions()).data.data || []);
      setProjects(p.data.data || []);
      setMessages(m.data.data || []);
      setNotifications(n.data.data || []);
      setReports(r.data.data || null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load mentor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const timer = setInterval(() => loadDashboard(true), 10000);
    return () => clearInterval(timer);
  }, []);

  const openStudent = async (student) => {
    try {
      setSelectedStudent(student);
      setStudentDetail(null);
      const res = await getMentorStudent(student.id);
      setStudentDetail(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load student');
    }
  };

  const nav = [
    ['dashboard', 'Dashboard', LayoutDashboard],
    ['schedule', 'My Schedule', CalendarDays],
    ['students', 'My Students', Users],
    ['progress', 'Student Progress', BarChart3],
    ['assignments', 'Assignments', ClipboardList],
    ['attendance', 'Attendance', CheckSquare],
    ['projects', 'Projects', FolderKanban],
    ['messages', 'Messages', MessageSquare],
    ['announcements', 'Announcements', Megaphone],
    ['notifications', 'Notifications', Bell],
    ['reports', 'Reports', FileText],
    ['profile', 'Profile', UserCircle],
    ['settings', 'Settings', Settings]
  ];

  const changePage = (page) => {
    setActive(page);
    setMobileOpen(false);
    if (page === 'students') loadStudents();
    if (page === 'schedule') loadClasses();
    if (page === 'assignments') loadAssignments();
    if (page === 'projects') loadProjects();
    if (page === 'messages') loadMessages();
    if (page === 'notifications') loadNotifications();
    if (page === 'reports') loadReports();
  };

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(s => [s.name, s.email, s.batch, s.course, s.status].join(' ').toLowerCase().includes(q));
  }, [students, search]);

  if (loading && !data) {
    return <div className="mentor-loading"><div className="mentor-spinner" /><p>Loading mentor dashboard…</p></div>;
  }

  const mentor = data?.mentor || user || {};
  const stats = data?.stats || {};
  const todayClasses = data?.todaysClasses || [];
  const atRisk = (data?.students || []).filter(s => s.status === 'At Risk');

  return (
    <div className="mentor-app">
      {mobileOpen && <div className="mentor-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={`mentor-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="mentor-brand">
          <img src="/welogo.png" alt="WeIntern" />
          <span>Mentor Portal</span>
          <button className="mentor-close" onClick={() => setMobileOpen(false)}><X size={20}/></button>
        </div>
        <div className="mentor-profile-mini">
          <div className="mentor-avatar">{initials(mentor.name)}</div>
          <div><strong>{mentor.name}</strong><small>Mentor</small></div>
        </div>
        <nav className="mentor-nav">
          {nav.map(([key, label, Icon]) => (
            <button key={key} className={active === key ? 'active' : ''} onClick={() => changePage(key)}>
              <Icon size={18}/><span>{label}</span>
              {key === 'notifications' && stats.unreadNotifications > 0 && <b>{stats.unreadNotifications}</b>}
            </button>
          ))}
        </nav>
        <button className="mentor-logout" onClick={logout}><LogOut size={18}/> Logout</button>
      </aside>

      <main className="mentor-main">
        <header className="mentor-header">
          <div className="mentor-header-left">
            <button className="mentor-menu" onClick={() => setMobileOpen(true)}><Menu size={22}/></button>
            <div>
              <div className="mentor-breadcrumb">Mentor Portal / {nav.find(n => n[0] === active)?.[1]}</div>
              <h1>{active === 'dashboard' ? `Welcome, ${mentor.name?.split(' ')[0] || 'Mentor'} 👋` : nav.find(n => n[0] === active)?.[1]}</h1>
            </div>
          </div>
          <div className="mentor-header-actions">
            <button className="mentor-icon-btn" onClick={() => loadAll(true)} title="Refresh"><RefreshCw size={18} className={refreshing ? 'spin' : ''}/></button>
            <button className="mentor-icon-btn" onClick={() => changePage('notifications')}><Bell size={18}/>{stats.unreadNotifications > 0 && <i>{stats.unreadNotifications}</i>}</button>
            <div className="mentor-header-user" onClick={() => changePage('profile')}>
              <div className="mentor-avatar small">{initials(mentor.name)}</div>
              <span>{mentor.name}</span>
            </div>
          </div>
        </header>

        <section className="mentor-content">
          {active === 'dashboard' && <DashboardHome data={data} onPage={changePage} onRefresh={() => loadAll(true)} openStudent={openStudent} />}
          {active === 'schedule' && <SchedulePage classes={classes} students={students} onCreate={() => setModal('class')} onReload={loadClasses} />}
          {active === 'students' && <StudentsPage students={filteredStudents} search={search} setSearch={setSearch} openStudent={openStudent} />}
          {active === 'progress' && <ProgressPage students={students} openStudent={openStudent} />}
          {active === 'assignments' && <AssignmentsPage assignments={assignments} submissions={submissions} students={students} onCreate={() => setModal('assignment')} onReload={loadAssignments} />}
          {active === 'attendance' && <AttendancePage classes={classes} students={students} onReload={loadAll} />}
          {active === 'projects' && <ProjectsPage projects={projects} onReload={loadProjects} />}
          {active === 'messages' && <MessagesPage students={students} messages={messages} onReload={loadMessages} />}
          {active === 'announcements' && <AnnouncementsPage students={students} />}
          {active === 'notifications' && <NotificationsPage notifications={notifications} onReload={loadNotifications} />}
          {active === 'reports' && <ReportsPage reports={reports} students={students} />}
          {active === 'profile' && <ProfilePage mentor={mentor} />}
          {active === 'settings' && <SettingsPage logout={logout} />}
        </section>
      </main>

      {modal === 'class' && <ClassModal students={students} onClose={() => setModal(null)} onSaved={() => {setModal(null); loadAll(true);}} />}
      {modal === 'assignment' && <AssignmentModal students={students} onClose={() => setModal(null)} onSaved={() => {setModal(null); loadAll(true);}} />}
      {selectedStudent && <StudentModal student={selectedStudent} detail={studentDetail} onClose={() => {setSelectedStudent(null); setStudentDetail(null);}} onRefresh={() => openStudent(selectedStudent)} />}
    </div>
  );
}

function DashboardHome({ data, onPage, openStudent }) {
  const stats = data?.stats || {};
  const classes = data?.todaysClasses || [];
  const risk = (data?.students || []).filter(s => s.status === 'At Risk');
  const activity = data?.activity || [];
  return (
    <>
      <div className="mentor-welcome">
        <div><span className="eyebrow">TODAY'S OVERVIEW</span><h2>Make every student count.</h2><p>Here is what needs your attention today.</p></div>
        <div className="mentor-date"><CalendarDays size={18}/> {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
      </div>

      <div className="mentor-stats-grid">
        <StatCard icon={<Users/>} label="Total Students" value={stats.totalStudents || 0} hint={`${stats.activeStudents || 0} active this week`} />
        <StatCard icon={<Activity/>} label="Active Students" value={stats.activeStudents || 0} hint="Activity in last 7 days" />
        <StatCard icon={<CalendarDays/>} label="Today's Classes" value={stats.todaysClasses || 0} hint="Scheduled for today" />
        <StatCard icon={<ClipboardList/>} label="Pending Reviews" value={stats.pendingAssignments || 0} hint="Submissions awaiting review" />
        <StatCard icon={<TrendingUp/>} label="Average Progress" value={`${stats.averageProgress || 0}%`} hint="Across assigned students" />
        <StatCard icon={<AlertTriangle/>} label="Students At Risk" value={stats.atRiskStudents || 0} hint="Needs attention" danger={stats.atRiskStudents > 0} />
      </div>

      <div className="mentor-grid two">
        <section className="mentor-card">
          <div className="mentor-card-head"><div><h3>Today's Schedule</h3><p>Your classes and mentoring sessions</p></div><button onClick={() => onPage('schedule')} className="text-btn">View calendar <ChevronRight size={16}/></button></div>
          {classes.length === 0 ? <Empty text="No classes scheduled for today." /> : <div className="class-list">
            {classes.map(c => <div className="class-row" key={c._id}>
              <div className="class-time"><strong>{fmtTime(c.startTime)}</strong><span>{fmtTime(c.endTime)}</span></div>
              <div className="class-dot" />
              <div className="class-info"><strong>{c.title}</strong><span>{c.batch || 'Batch'} · {c.students?.length || 0} students</span></div>
              <span className={`status-pill ${c.status}`}>{c.status}</span>
              {c.meetingLink && <a href={c.meetingLink} target="_blank" rel="noreferrer" className="join-btn"><Video size={14}/> Join</a>}
            </div>)}
          </div>}
        </section>

        <section className="mentor-card">
          <div className="mentor-card-head"><div><h3>Students At Risk</h3><p>Intervene before progress slips</p></div><button onClick={() => onPage('students')} className="text-btn">All students <ChevronRight size={16}/></button></div>
          {risk.length === 0 ? <Empty text="Great! No students are currently at risk." /> : <div className="risk-list">
            {risk.slice(0,5).map(s => <button className="risk-row" key={s.id} onClick={() => openStudent(s)}>
              <div className="mentor-avatar tiny">{initials(s.name)}</div>
              <div><strong>{s.name}</strong><span>{s.attendance}% attendance · {s.progress}% progress</span></div>
              <AlertTriangle size={17}/>
            </button>)}
          </div>}
        </section>
      </div>

      <div className="mentor-grid two">
        <section className="mentor-card">
          <div className="mentor-card-head"><div><h3>Learning Activity</h3><p>Study activity recorded this month</p></div></div>
          <MiniActivityChart data={activity} />
        </section>
        <section className="mentor-card">
          <div className="mentor-card-head"><div><h3>Quick Actions</h3><p>Common mentor tasks</p></div></div>
          <div className="quick-actions">
            <button onClick={() => onPage('schedule')}><CalendarDays/><span>Schedule Class</span><ChevronRight/></button>
            <button onClick={() => onPage('attendance')}><CheckSquare/><span>Take Attendance</span><ChevronRight/></button>
            <button onClick={() => onPage('assignments')}><ClipboardList/><span>Review Assignments</span><ChevronRight/></button>
            <button onClick={() => onPage('students')}><Users/><span>View My Students</span><ChevronRight/></button>
          </div>
        </section>
      </div>
    </>
  );
}

function MiniActivityChart({ data }) {
  const max = Math.max(1, ...data.map(x => Number(x.minutes || 0)));
  return <div className="mini-chart">
    {data.slice(-14).map((x, i) => <div className="mini-bar-wrap" key={x._id || i} title={`${x._id}: ${x.minutes} min`}>
      <div className="mini-bar" style={{height: `${Math.max(6, Number(x.minutes||0)/max*100)}%`}} />
      <span>{String(x._id || '').slice(8,10)}</span>
    </div>)}
    {!data.length && <Empty text="No activity recorded yet." />}
  </div>;
}

function SchedulePage({ classes, students, onCreate, onReload }) {
  const [view, setView] = useState('week');
  return <div>
    <PageActions title="Schedule & Calendar" subtitle="Manage lectures, workshops, project reviews and one-to-one sessions." action="Schedule Class" onAction={onCreate} />
    <div className="schedule-toolbar"><div className="segmented">{['day','week','month'].map(v=><button className={view===v?'active':''} onClick={()=>setView(v)} key={v}>{v[0].toUpperCase()+v.slice(1)}</button>)}</div><button className="outline-btn" onClick={onReload}><RefreshCw size={15}/> Refresh</button></div>
    <div className="mentor-card">
      <div className="calendar-heading"><h3>{view === 'day' ? 'Daily Schedule' : view === 'week' ? 'Weekly Schedule' : 'Monthly Schedule'}</h3><span>{classes.length} classes</span></div>
      <div className="calendar-grid">
        {classes.map(c => <div className="calendar-event" key={c._id}>
          <div className="event-date">{fmtDate(c.date)}</div>
          <strong>{c.title}</strong>
          <span>{c.startTime} – {c.endTime}</span>
          <span>{c.batch || 'All assigned students'} · {c.students?.length || 0} students</span>
          <div className="event-actions">
            <span className={`status-pill ${c.status}`}>{c.status}</span>
            {c.meetingLink && <a href={c.meetingLink} target="_blank" rel="noreferrer"><Video size={14}/> Join</a>}
          </div>
          <div style={{display:'flex',gap:6,marginTop:4}}>
            {['live','completed','cancelled'].map(status => <button key={status} className="mini-action" onClick={async()=>{try{await updateMentorClassStatus(c._id,status);toast.success(`Class marked ${status}`);onReload();}catch(e){toast.error(e.response?.data?.message||'Unable to update class');}}}>{status}</button>)}
          </div>
        </div>)}
        {!classes.length && <Empty text="No classes yet. Schedule your first class." />}
      </div>
    </div>
  </div>;
}

function StudentsPage({ students, search, setSearch, openStudent }) {
  return <div>
    <PageActions title="My Students" subtitle="Only students assigned to you are shown here." />
    <div className="mentor-card">
      <div className="filter-bar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, batch or course..." /></div><span>{students.length} students</span></div>
      <div className="table-wrap"><table className="mentor-table"><thead><tr><th>Student</th><th>Batch</th><th>Attendance</th><th>Progress</th><th>Assignments</th><th>Last Activity</th><th>Status</th><th /></tr></thead>
      <tbody>{students.map(s=><tr key={s.id}><td><button className="person-cell" onClick={()=>openStudent(s)}><div className="mentor-avatar tiny">{initials(s.name)}</div><span><strong>{s.name}</strong><small>{s.email}</small></span></button></td><td>{s.batch}</td><td><strong>{s.attendance}%</strong></td><td><div className="table-progress"><ProgressBar value={s.progress}/><span>{s.progress}%</span></div></td><td>{s.assignments || 0}</td><td>{s.lastActivity ? fmtDate(s.lastActivity) : 'No activity'}</td><td><span className={`risk-badge ${s.status.toLowerCase().replace(' ','-')}`}>{s.status}</span></td><td><button className="icon-link" onClick={()=>openStudent(s)}><ChevronRight size={17}/></button></td></tr>)}</tbody></table>{!students.length && <Empty text="No students are assigned to you yet." />}</div>
    </div>
  </div>;
}

function ProgressPage({ students, openStudent }) {
  return <div><PageActions title="Student Progress" subtitle="Compare progress, attendance and engagement across your assigned students." />
    <div className="mentor-progress-cards">{students.map(s=><button className="progress-student" key={s.id} onClick={()=>openStudent(s)}>
      <div className="person-cell"><div className="mentor-avatar tiny">{initials(s.name)}</div><span><strong>{s.name}</strong><small>{s.course} · {s.batch}</small></span></div>
      <div className="metric-line"><span>Overall Progress</span><b>{s.progress}%</b></div><ProgressBar value={s.progress}/>
      <div className="progress-meta"><span>Attendance {s.attendance}%</span><span>{s.studyMinutes || 0} min study</span></div>
      <div className="metric-line"><span>Status</span><span className={`risk-badge ${s.status.toLowerCase().replace(' ','-')}`}>{s.status}</span></div>
    </button>)}</div>
  </div>;
}

function AssignmentsPage({ assignments, submissions, students, onCreate, onReload }) {
  const [review, setReview] = useState(null);
  return <div><PageActions title="Assignments & Reviews" subtitle="Create assignments and review student submissions." action="Create Assignment" onAction={onCreate} />
    <div className="mentor-grid two">
      <section className="mentor-card"><div className="mentor-card-head"><div><h3>Assignments</h3><p>Deadlines and submission status</p></div><button className="outline-btn" onClick={onReload}><RefreshCw size={15}/></button></div>
        <div className="assignment-list">{assignments.map(a=><div className="assignment-row" key={a._id}><div className="assignment-icon"><ClipboardList/></div><div><strong>{a.title}</strong><span>{a.batch || 'Assigned students'} · Due {fmtDate(a.dueDate)}</span></div><div className="assignment-stats"><b>{a.submitted}</b><small>submitted</small><b>{a.pending}</b><small>pending</small><b>{a.averageScore}%</b><small>avg</small></div></div>)}{!assignments.length&&<Empty text="No assignments created yet."/>}</div>
      </section>
      <section className="mentor-card"><div className="mentor-card-head"><div><h3>Submission Queue</h3><p>Review work submitted by your students</p></div></div>
        <div className="submission-list">{submissions.map(s=><button className="submission-row" key={s._id} onClick={()=>setReview(s)}><div className="mentor-avatar tiny">{initials(s.student?.name)}</div><div><strong>{s.student?.name}</strong><span>{s.assignment?.title}</span></div><span className={`status-pill ${s.status}`}>{s.status}</span><ChevronRight size={16}/></button>)}{!submissions.length&&<Empty text="No submissions waiting for review."/>}</div>
      </section>
    </div>
    {review && <ReviewModal submission={review} onClose={()=>setReview(null)} onSaved={()=>{setReview(null);onReload();}}/>}
  </div>;
}

function AttendancePage({ classes, students, onReload }) {
  const [classId, setClassId] = useState('');
  const [records, setRecords] = useState({});
  const selected = classes.find(c => c._id === classId);
  useEffect(() => {
    if (classes.length && !classId) setClassId(classes[0]._id);
  }, [classes, classId]);
  useEffect(() => {
    if (selected) {
      const next={}; (selected.students||[]).forEach(s=>{next[s._id]='present';}); setRecords(next);
    }
  }, [classId]);
  const save = async () => {
    if (!selected) return toast.error('Select a class');
    try {
      await saveMentorAttendance({classId, records:Object.entries(records).map(([studentId,status])=>({studentId,status}))});
      toast.success('Attendance saved');
      onReload(true);
    } catch(err){toast.error(err.response?.data?.message || 'Unable to save attendance');}
  };
  return <div><PageActions title="Attendance Management" subtitle="Mark Present, Absent, Late or Excused. Attendance is saved to the database." />
    <div className="mentor-card"><div className="attendance-toolbar"><select value={classId} onChange={e=>setClassId(e.target.value)}><option value="">Select class</option>{classes.map(c=><option value={c._id} key={c._id}>{fmtDate(c.date)} · {c.title}</option>)}</select><button className="outline-btn" onClick={()=>{if(selected){const n={};selected.students.forEach(s=>n[s._id]='present');setRecords(n);}}}>Mark All Present</button><button className="primary-btn" onClick={save}><Save size={15}/> Save Attendance</button></div>
      {!selected ? <Empty text="Select a class to take attendance."/> : <div className="table-wrap"><table className="mentor-table"><thead><tr><th>Student</th><th>Present</th><th>Late</th><th>Absent</th><th>Excused</th></tr></thead><tbody>{selected.students.map(s=><tr key={s._id}><td><div className="person-cell"><div className="mentor-avatar tiny">{initials(s.name)}</div><span><strong>{s.name}</strong><small>{s.email}</small></span></div></td>{['present','late','absent','excused'].map(status=><td key={status}><button className={`attendance-radio ${records[s._id]===status?'selected':''}`} onClick={()=>setRecords(r=>({...r,[s._id]:status}))}><span/></button></td>)}</tr>)}</tbody></table></div>}
    </div>
  </div>;
}

function ProjectsPage({ projects, onReload }) {
  const [editing,setEditing]=useState(null);
  return <div><PageActions title="Internship & Projects" subtitle="Track each student's project stage and provide mentor feedback." />
    <div className="project-grid">{projects.map(p=><div className="project-card" key={p._id}><div className="project-head"><div className="mentor-avatar tiny">{initials(p.student?.name)}</div><div><strong>{p.student?.name}</strong><small>{p.title}</small></div><span className="status-pill">{p.status}</span></div><ProgressBar value={p.progress}/><div className="project-meta"><span>{p.progress}% complete</span><span>{fmtDate(p.lastUpdate)}</span></div>{p.githubUrl&&<a href={p.githubUrl} target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14}/> Repository</a>}<button className="outline-btn full" onClick={()=>setEditing(p)}>Update Project</button></div>)}{!projects.length&&<Empty text="No projects assigned yet."/>}</div>
    {editing&&<ProjectModal project={editing} onClose={()=>setEditing(null)} onSaved={()=>{setEditing(null);onReload();}}/>}
  </div>;
}

function MessagesPage({ students, messages, onReload }) {
  const [recipient,setRecipient]=useState('');
  const [message,setMessage]=useState('');
  const [subject,setSubject]=useState('');
  const [attachmentUrl,setAttachmentUrl]=useState('');
  const send=async()=>{if(!recipient||!message.trim())return toast.error('Select a student and enter a message');try{await sendMentorMessage({recipientId:recipient,subject,message,attachmentUrl});setMessage('');setSubject('');setAttachmentUrl('');toast.success('Message sent');onReload();}catch(e){toast.error(e.response?.data?.message||'Unable to send message');}};
  return <div><PageActions title="Messages" subtitle="Message an individual assigned student."/>
    <div className="mentor-grid two"><section className="mentor-card"><h3>New Message</h3><div className="form-grid"><label>Student<select value={recipient} onChange={e=>setRecipient(e.target.value)}><option value="">Select student</option>{students.map(s=><option value={s.id} key={s.id}>{s.name} · {s.email}</option>)}</select></label><label>Subject<input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject"/></label><label className="span-2">Attachment Link<input value={attachmentUrl} onChange={e=>setAttachmentUrl(e.target.value)} placeholder="Drive / GitHub / file URL"/></label><label className="span-2">Message<textarea rows="6" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write your message..."/></label></div><button className="primary-btn" onClick={send}><Send size={15}/> Send Message</button></section>
      <section className="mentor-card"><div className="mentor-card-head"><h3>Recent Messages</h3><button className="outline-btn" onClick={onReload}><RefreshCw size={15}/></button></div><div className="message-list">{messages.map(m=><div className="message-row" key={m._id}><div className="mentor-avatar tiny">{initials(m.sender?.name)}</div><div><strong>{m.sender?.name} → {m.recipient?.name}</strong><span>{m.subject || 'Message'}</span><p>{m.message}</p></div></div>)}{!messages.length&&<Empty text="No messages yet."/>}</div></section></div>
  </div>;
}

function AnnouncementsPage({ students }) {
  const [ids,setIds]=useState([]);
  const [title,setTitle]=useState('');
  const [message,setMessage]=useState('');
  const send=async()=>{if(!ids.length||!message.trim())return toast.error('Select at least one student and enter a message');try{await sendMentorAnnouncement({studentIds:ids,title,message});toast.success(`Announcement sent to ${ids.length} students`);setMessage('');}catch(e){toast.error(e.response?.data?.message||'Unable to send announcement');}};
  return <div><PageActions title="Announcements" subtitle="Send a class or batch announcement to selected assigned students."/>
    <section className="mentor-card"><div className="select-all-row"><button className="outline-btn" onClick={()=>setIds(ids.length===students.length?[]:students.map(s=>s.id))}>{ids.length===students.length?'Clear All':'Select All'}</button><span>{ids.length} selected</span></div><div className="student-select-grid">{students.map(s=><label key={s.id} className={ids.includes(s.id)?'selected':''}><input type="checkbox" checked={ids.includes(s.id)} onChange={e=>setIds(e.target.checked?[...ids,s.id]:ids.filter(x=>x!==s.id))}/><div className="mentor-avatar tiny">{initials(s.name)}</div><span>{s.name}<small>{s.batch}</small></span></label>)}</div><div className="form-grid announcement-form"><label>Title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Important announcement"/></label><label className="span-2">Message<textarea rows="5" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write the announcement..."/></label></div><button className="primary-btn" onClick={send}><Megaphone size={15}/> Send Announcement</button></section>
  </div>;
}

function NotificationsPage({ notifications, onReload }) {
  const mark=async n=>{try{await markMentorNotificationRead(n._id);onReload();}catch(e){}};
  return <div><PageActions title="Notifications" subtitle="Assignment submissions, classes, student activity and important alerts."/><section className="mentor-card"><div className="notification-list">{notifications.map(n=><button key={n._id} className={`notification-row ${!n.readAt?'unread':''}`} onClick={()=>mark(n)}><div className="notification-icon"><Bell size={16}/></div><div><strong>{n.title}</strong><p>{n.message}</p><small>{fmtDate(n.createdAt)}</small></div>{!n.readAt&&<span className="unread-dot"/>}</button>)}{!notifications.length&&<Empty text="No notifications."/>}</div></section></div>;
}

function ReportsPage({ reports, students }) {
  const exportCsv = () => {
    const rows = [
      ['Metric','Value'],
      ['Total Students', reports?.totalStudents || 0],
      ['Attendance Rate', `${reports?.attendanceRate || 0}%`],
      ['Average Score', `${reports?.averageScore || 0}%`],
      ['Study Hours', reports?.totalStudyHours || 0],
      ['Projects', reports?.projects || 0],
      ['Completed Projects', reports?.completedProjects || 0],
      ['Assignments Reviewed', reports?.assignmentsReviewed || 0]
    ];
    const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='weintern-mentor-report.csv'; a.click();
    URL.revokeObjectURL(url);
  };
  return <div>
    <div className="mentor-page-title">
      <div><span className="eyebrow">MENTOR WORKSPACE</span><h2>Mentor Reports</h2><p>High-level internship, attendance, assignment and project performance.</p></div>
      <div style={{display:'flex',gap:8}}><button className="outline-btn" onClick={exportCsv}><FileText size={15}/> Export CSV</button><button className="primary-btn" onClick={()=>window.print()}><FileText size={15}/> Print / Save PDF</button></div>
    </div>
    <div className="report-grid">{[
      ['Total Students',reports?.totalStudents||0],['Attendance Rate',`${reports?.attendanceRate||0}%`],['Average Score',`${reports?.averageScore||0}%`],['Study Hours',reports?.totalStudyHours||0],['Projects',reports?.projects||0],['Completed Projects',reports?.completedProjects||0],['Assignments Reviewed',reports?.assignmentsReviewed||0]
    ].map(([l,v])=><div className="report-card" key={l}><span>{l}</span><strong>{v}</strong></div>)}</div>
    <section className="mentor-card report-note"><FileText/><div><h3>Student report dataset</h3><p>Use Print → Save as PDF for a PDF report. CSV contains the current mentor-level metrics and can be opened in Excel.</p></div></section>
  </div>;
}

function ProfilePage({ mentor }) {
  const [form, setForm] = useState({
    name: mentor.name || '',
    phone: mentor.phone || '',
    experience: mentor.experience || '',
    bio: mentor.bio || '',
    expertise: (mentor.expertise || []).join(', '),
    skills: (mentor.skills || []).join(', '),
    assignedCourses: (mentor.assignedCourses || []).join(', '),
    assignedBatches: (mentor.assignedBatches || []).join(', ')
  });
  const [saving, setSaving] = useState(false);
  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const save = async () => {
    setSaving(true);
    try {
      const res = await updateMentorProfile({
        ...form,
        expertise: form.expertise.split(',').map(x => x.trim()).filter(Boolean),
        skills: form.skills.split(',').map(x => x.trim()).filter(Boolean),
        assignedCourses: form.assignedCourses.split(',').map(x => x.trim()).filter(Boolean),
        assignedBatches: form.assignedBatches.split(',').map(x => x.trim()).filter(Boolean)
      });
      localStorage.setItem('wi_user', JSON.stringify(res.data.data));
      toast.success('Mentor profile updated');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to update profile');
    } finally { setSaving(false); }
  };
  return <div>
    <PageActions title="Mentor Profile" subtitle="Maintain your professional information, expertise and assigned programs."/>
    <section className="mentor-card profile-card">
      <div className="profile-hero">
        <div className="mentor-avatar large">{initials(mentor.name)}</div>
        <div><h2>{mentor.name}</h2><p>{mentor.email}</p><span className="role-chip">Mentor</span></div>
      </div>
      <div className="profile-edit-grid">
        <label>Full Name<input value={form.name} onChange={e=>update('name',e.target.value)}/></label>
        <label>Phone<input value={form.phone} onChange={e=>update('phone',e.target.value)}/></label>
        <label>Experience<input value={form.experience} onChange={e=>update('experience',e.target.value)} placeholder="5 years"/></label>
        <label>Expertise<input value={form.expertise} onChange={e=>update('expertise',e.target.value)} placeholder="MERN, Data Science"/></label>
        <label className="span-2">Skills<input value={form.skills} onChange={e=>update('skills',e.target.value)} placeholder="React, Node.js, MongoDB"/></label>
        <label>Assigned Courses<input value={form.assignedCourses} onChange={e=>update('assignedCourses',e.target.value)} /></label>
        <label>Assigned Batches<input value={form.assignedBatches} onChange={e=>update('assignedBatches',e.target.value)} /></label>
        <label className="span-2">Bio<textarea rows="4" value={form.bio} onChange={e=>update('bio',e.target.value)} placeholder="Short professional bio"/></label>
      </div>
      <div className="modal-actions"><button className="primary-btn" onClick={save} disabled={saving}><Save size={15}/>{saving?'Saving...':'Save Profile'}</button></div>
    </section>
  </div>;
}

function Info({label,value}){return <div className="info-box"><small>{label}</small><strong>{value||'Not added'}</strong></div>}

function SettingsPage({ logout }) {
  const [passwords, setPasswords] = useState({ currentPassword:'', newPassword:'', confirm:'' });
  const savePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) return toast.error('Enter current and new password');
    if (passwords.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword:'', newPassword:'', confirm:'' });
      toast.success('Password changed successfully');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to change password');
    }
  };
  return <div>
    <PageActions title="Settings" subtitle="Account security and notification preferences."/>
    <section className="mentor-card settings-list">
      <div><strong>Email notifications</strong><span>Receive important student, class and assignment alerts.</span></div>
      <label className="switch"><input type="checkbox" defaultChecked/><i/></label>
      <div><strong>Class reminders</strong><span>Receive reminders before scheduled classes.</span></div>
      <label className="switch"><input type="checkbox" defaultChecked/><i/></label>
      <div><strong>Student risk alerts</strong><span>Notify you when activity, progress or attendance drops.</span></div>
      <label className="switch"><input type="checkbox" defaultChecked/><i/></label>
    </section>
    <section className="mentor-card password-card">
      <h3>Change Password</h3>
      <p>Use your current password to create a new secure password.</p>
      <div className="form-grid">
        <label>Current Password<input type="password" value={passwords.currentPassword} onChange={e=>setPasswords(p=>({...p,currentPassword:e.target.value}))}/></label>
        <label>New Password<input type="password" value={passwords.newPassword} onChange={e=>setPasswords(p=>({...p,newPassword:e.target.value}))}/></label>
        <label>Confirm Password<input type="password" value={passwords.confirm} onChange={e=>setPasswords(p=>({...p,confirm:e.target.value}))}/></label>
      </div>
      <button className="primary-btn" onClick={savePassword}><Save size={15}/> Change Password</button>
    </section>
    <button className="danger-btn" onClick={logout}><LogOut size={16}/> Logout</button>
  </div>;
}

function StudentModal({ student, detail, onClose, onRefresh }) {
  const [note,setNote]=useState('');
  const addNote=async()=>{if(!note.trim())return;try{await addMentorNote(student.id,{note});setNote('');toast.success('Private note saved');onRefresh();}catch(e){toast.error(e.response?.data?.message||'Unable to save note');}};
  return <Modal title={student.name} onClose={onClose}><div className="student-profile-head"><div className="mentor-avatar large">{initials(student.name)}</div><div><h2>{student.name}</h2><p>{student.email} · {student.batch} · {student.course}</p><div className="student-dates"><span>Start: {fmtDate(detail?.student?.startDate)}</span><span>Expected completion: {fmtDate(detail?.student?.expectedCompletionDate)}</span></div><span className={`risk-badge ${student.status.toLowerCase().replace(' ','-')}`}>{student.status}</span></div></div>{!detail?<div className="mentor-loading small"><div className="mentor-spinner"/></div>:<><div className="student-metrics">{[['Progress',detail.metrics.overallProgress+'%'],['Attendance',detail.metrics.attendance+'%'],['Assignments',detail.metrics.assignmentCompletion+'%'],['Project',detail.metrics.projectCompletion+'%'],['Avg Score',detail.metrics.assessmentPerformance+'%'],['Study',Math.round(detail.metrics.totalStudyMinutes/60*10)/10+'h']].map(([l,v])=><div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div><div className="detail-section"><h3>Learning Progress</h3>{detail.learningProgress.map(x=><div className="learning-row" key={x.module}><span>{x.module}</span><ProgressBar value={x.progress}/><b>{x.progress}%</b></div>)}</div><div className="detail-section"><h3>Progress Over Time</h3><MiniActivityChart data={(detail.activity || []).map(x => ({ _id:x.date, minutes:x.minutes }))}/></div><div className="detail-section"><h3>Attendance Overview</h3><div className="attendance-summary"><div className="attendance-ring" style={{'--p':`${detail.metrics.attendance}%`}}><strong>{detail.metrics.attendance}%</strong><span>Attendance</span></div><div className="attendance-box"><b>{detail.metrics.classesAttended}</b><span>Present/Late</span><b>{detail.metrics.classesMissed}</b><span>Absent</span><b>{detail.metrics.classesTotal}</b><span>Total Classes</span></div></div></div><div className="detail-section"><h3>Attendance History</h3><div className="history-list">{detail.attendance.slice(0,8).map(a=><div key={a._id}><span>{a.classId?.title||'Class'}</span><span>{fmtDate(a.markedAt)}</span><span className={`status-pill ${a.status}`}>{a.status}</span></div>)}</div></div><div className="detail-section"><h3>Assignments</h3><div className="history-list">{detail.submissions.slice(0,8).map(s=><div key={s._id}><span>{s.assignment?.title||'Assignment'}</span><span>{s.score ?? '—'}</span><span>{s.status}</span></div>)}</div></div><div className="detail-section"><h3>Project</h3>{detail.projects.map(p=><div className="project-inline" key={p._id}><strong>{p.title}</strong><ProgressBar value={p.progress}/><span>{p.status} · {p.progress}%</span>{p.githubUrl&&<a href={p.githubUrl} target="_blank" rel="noreferrer">Repository</a>}</div>)}{!detail.projects.length&&<Empty text="No project added."/>}</div><div className="detail-section"><h3>Private Mentor Note</h3><textarea rows="3" value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a private note about this student's progress..."/><button className="primary-btn" onClick={addNote}><Save size={15}/> Save Note</button>{detail.notes?.slice(0,5).map(n=><div className="note-item" key={n._id}>{n.note}<small>{fmtDate(n.createdAt)}</small></div>)}</div></>}</Modal>;
}

function ClassModal({ students, onClose, onSaved }) {
  const [form,setForm]=useState({title:'',description:'',batch:'',course:'',date:new Date().toISOString().slice(0,10),startTime:'10:00',endTime:'11:00',classType:'lecture',mode:'online',meetingLink:'',learningMaterialUrl:'',notes:'',studentIds:[]});
  const update=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=async()=>{if(!form.title||!form.date)return toast.error('Title and date are required');try{await createMentorClass(form);toast.success('Class scheduled');onSaved();}catch(e){toast.error(e.response?.data?.message||'Unable to schedule class');}};
  return <Modal title="Schedule a Class" onClose={onClose}><div className="form-grid"><label>Class Title<input value={form.title} onChange={e=>update('title',e.target.value)} placeholder="React Fundamentals"/></label><label>Batch<input value={form.batch} onChange={e=>update('batch',e.target.value)} placeholder="MERN-2026-A"/></label><label>Course<input value={form.course} onChange={e=>update('course',e.target.value)} placeholder="MERN Stack"/></label><label>Date<input type="date" value={form.date} onChange={e=>update('date',e.target.value)}/></label><label>Start Time<input type="time" value={form.startTime} onChange={e=>update('startTime',e.target.value)}/></label><label>End Time<input type="time" value={form.endTime} onChange={e=>update('endTime',e.target.value)}/></label><label>Class Type<select value={form.classType} onChange={e=>update('classType',e.target.value)}>{['lecture','practical','workshop','doubt_session','project_review','one_to_one','assessment'].map(x=><option key={x}>{x}</option>)}</select></label><label>Mode<select value={form.mode} onChange={e=>update('mode',e.target.value)}><option value="online">Online</option><option value="offline">Offline</option></select></label><label className="span-2">Meeting Link<input value={form.meetingLink} onChange={e=>update('meetingLink',e.target.value)} placeholder="https://meet.google.com/..."/></label><label className="span-2">Learning Material Link<input value={form.learningMaterialUrl} onChange={e=>update('learningMaterialUrl',e.target.value)} placeholder="https://drive.google.com/..."/></label><label className="span-2">Notes<textarea value={form.notes} onChange={e=>update('notes',e.target.value)} rows="3"/></label><div className="span-2"><strong className="form-heading">Students</strong><div className="checkbox-grid">{students.map(s=><label key={s.id}><input type="checkbox" checked={form.studentIds.includes(s.id)} onChange={e=>update('studentIds',e.target.checked?[...form.studentIds,s.id]:form.studentIds.filter(x=>x!==s.id))}/>{s.name}</label>)}</div></div></div><div className="modal-actions"><button className="outline-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={submit}><CalendarDays size={15}/> Schedule Class</button></div></Modal>;
}

function AssignmentModal({ students, onClose, onSaved }) {
  const [form,setForm]=useState({title:'',description:'',batch:'',course:'',dueDate:'',maxScore:100,studentIds:[]});
  const update=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=async()=>{if(!form.title||!form.dueDate)return toast.error('Title and due date are required');try{await createMentorAssignment(form);toast.success('Assignment created');onSaved();}catch(e){toast.error(e.response?.data?.message||'Unable to create assignment');}};
  return <Modal title="Create Assignment" onClose={onClose}><div className="form-grid"><label>Assignment Title<input value={form.title} onChange={e=>update('title',e.target.value)} placeholder="Build REST API"/></label><label>Due Date<input type="date" value={form.dueDate} onChange={e=>update('dueDate',e.target.value)}/></label><label>Batch<input value={form.batch} onChange={e=>update('batch',e.target.value)}/></label><label>Course<input value={form.course} onChange={e=>update('course',e.target.value)}/></label><label>Max Score<input type="number" value={form.maxScore} onChange={e=>update('maxScore',Number(e.target.value))}/></label><label className="span-2">Description<textarea rows="4" value={form.description} onChange={e=>update('description',e.target.value)}/></label><div className="span-2"><strong className="form-heading">Students</strong><div className="checkbox-grid">{students.map(s=><label key={s.id}><input type="checkbox" checked={form.studentIds.includes(s.id)} onChange={e=>update('studentIds',e.target.checked?[...form.studentIds,s.id]:form.studentIds.filter(x=>x!==s.id))}/>{s.name}</label>)}</div></div></div><div className="modal-actions"><button className="outline-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={submit}><ClipboardList size={15}/> Create Assignment</button></div></Modal>;
}

function ReviewModal({ submission, onClose, onSaved }) {
  const [score,setScore]=useState(submission.score ?? '');
  const [feedback,setFeedback]=useState(submission.feedback || '');
  const [status,setStatus]=useState('reviewed');
  const save=async()=>{try{await reviewMentorSubmission(submission._id,{score:Number(score),feedback,status});toast.success('Review saved');onSaved();}catch(e){toast.error(e.response?.data?.message||'Unable to review');}};
  return <Modal title={`Review — ${submission.assignment?.title || 'Submission'}`} onClose={onClose}><div className="submission-detail"><div className="person-cell"><div className="mentor-avatar">{initials(submission.student?.name)}</div><span><strong>{submission.student?.name}</strong><small>{submission.student?.email}</small></span></div>{submission.githubUrl&&<a href={submission.githubUrl} target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={15}/> Open GitHub</a>}{submission.fileUrl&&<a href={submission.fileUrl} target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={15}/> Open File</a>}<label>Score<input type="number" min="0" max="100" value={score} onChange={e=>setScore(e.target.value)}/></label><label>Feedback<textarea rows="5" value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Give clear feedback..."/></label><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option value="reviewed">Reviewed</option><option value="approved">Approved</option><option value="changes_requested">Request Changes</option></select></label></div><div className="modal-actions"><button className="outline-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={save}><CheckCircle2 size={15}/> Save Review</button></div></Modal>;
}

function ProjectModal({ project, onClose, onSaved }) {
  const [progress,setProgress]=useState(project.progress||0);
  const [status,setStatus]=useState(project.status);
  const [comments,setComments]=useState(project.mentorComments||'');
  const save=async()=>{try{await updateMentorProject(project._id,{progress:Number(progress),status,mentorComments:comments});toast.success('Project updated');onSaved();}catch(e){toast.error(e.response?.data?.message||'Unable to update project');}};
  return <Modal title="Update Project" onClose={onClose}><label>Progress<input type="number" min="0" max="100" value={progress} onChange={e=>setProgress(e.target.value)}/></label><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}>{['onboarding','training','assignments','project','evaluation','completed'].map(x=><option key={x}>{x}</option>)}</select></label><label>Mentor Comments<textarea rows="5" value={comments} onChange={e=>setComments(e.target.value)}/></label><div className="modal-actions"><button className="outline-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={save}><Save size={15}/> Save Project</button></div></Modal>;
}

function PageActions({title,subtitle,action,onAction}){return <div className="mentor-page-title"><div><span className="eyebrow">MENTOR WORKSPACE</span><h2>{title}</h2><p>{subtitle}</p></div>{action&&<button className="primary-btn" onClick={onAction}><Plus size={16}/>{action}</button>}</div>}
function Empty({text}){return <div className="mentor-empty"><Circle size={18}/><span>{text}</span></div>}
function Modal({title,onClose,children}){return <div className="mentor-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="mentor-modal"><div className="modal-head"><div><h2>{title}</h2></div><button onClick={onClose}><X size={20}/></button></div><div className="modal-body">{children}</div></div></div>}

export default MentorDashboard;
