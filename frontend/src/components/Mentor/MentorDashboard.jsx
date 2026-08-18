import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Users, BarChart3, ClipboardList, CheckSquare,
  FolderKanban, MessageSquare, Megaphone, Bell, FileText, UserCircle, Settings,
  LogOut, Menu, X, Plus, Search, ChevronRight, Clock3, Video, MapPin,
  AlertTriangle, CheckCircle2, Circle, Send, Star, ExternalLink, Save,
  PlayCircle, MoreHorizontal, UserPlus, BookOpen, TrendingUp, Activity,
  RefreshCw, Shield, ArrowLeft, Layers
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
  addMentorNote, updateMentorProfile, changePassword, getAdminMentors,
  getAllMentorsOverview, createMentorAccount, assignStudentsBulk, getAdminStudentsWithMentors
} from '../../utils/api';

const fmtDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric'
}) : '—';

const fmtTime = (value) => value || '—';

const initials = (name = '') => name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase() || 'M';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';
  const mentorIdFromUrl = searchParams.get('mentorId');

  const [active, setActive] = useState(isAdmin && !mentorIdFromUrl ? 'all-mentors' : 'dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Admin supervision state
  const [allMentors, setAllMentors] = useState([]);
  const [selectedMentorId, setSelectedMentorId] = useState(mentorIdFromUrl || '');
  const [allOverview, setAllOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Mentor dashboard datasets
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

  // Helper query param builder
  const getParams = () => (isAdmin && selectedMentorId ? { mentorId: selectedMentorId } : {});

  // Load mentors list if user is admin, or load mentor dashboard for regular mentors
  useEffect(() => {
    if (isAdmin) {
      getAdminMentors()
        .then(res => {
          const list = res.data?.data || [];
          setAllMentors(list);
          const initId = mentorIdFromUrl || (list.length > 0 ? list[0]._id : '');
          if (initId) {
            setSelectedMentorId(initId);
          }
        })
        .catch(err => console.error('Failed to load mentors list:', err));

      loadOverview();
    } else {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadOverview = async () => {
    if (!isAdmin) return;
    setOverviewLoading(true);
    try {
      const res = await getAllMentorsOverview();
      setAllOverview(res.data?.data || null);
    } catch (err) {
      console.error('Failed to load mentors overview:', err);
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const res = await getMentorDashboard(getParams());
      setData(res.data?.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load mentor dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await getMentorStudents(getParams());
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadClasses = async () => {
    try {
      const res = await getMentorClasses(getParams());
      setClasses(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAssignments = async () => {
    try {
      const [a, s] = await Promise.all([
        getMentorAssignments(getParams()),
        getMentorSubmissions(getParams())
      ]);
      setAssignments(a.data?.data || []);
      setSubmissions(s.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await getMentorProjects(getParams());
      setProjects(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await getMentorMessages(getParams());
      setMessages(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await getMentorNotifications(getParams());
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadReports = async () => {
    try {
      const res = await getMentorReports(getParams());
      setReports(res.data?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDashboardData = async (silent = false, customMentorId) => {
    const targetId = customMentorId || selectedMentorId;
    const targetParams = (isAdmin && targetId)
      ? { mentorId: targetId }
      : {};

    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const [d, s] = await Promise.all([
        getMentorDashboard(targetParams),
        getMentorStudents(targetParams)
      ]);
      const dashData = d.data?.data;
      setData(dashData || null);
      setStudents(s.data?.data || []);
      if (isAdmin && !selectedMentorId && dashData?.mentor?.id) {
        setSelectedMentorId(dashData.mentor.id);
      }
    } catch (err) {
      console.error('Failed to load mentor dashboard data:', err);
      toast.error(err.response?.data?.message || 'Unable to load mentor data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadAll = (silent = false, customId) => loadDashboardData(silent, customId);

  // Re-load when selected mentor or active tab changes
  useEffect(() => {
    if (active === 'all-mentors') {
      loadOverview();
    } else {
      loadDashboardData(false, selectedMentorId);
      if (active === 'schedule' || active === 'attendance') loadClasses();
      if (active === 'assignments') loadAssignments();
      if (active === 'projects') loadProjects();
      if (active === 'messages') loadMessages();
      if (active === 'notifications') loadNotifications();
      if (active === 'reports') loadReports();
    }
  }, [selectedMentorId, active]);

  // Handle mentor switch by Admin
  const handleSwitchMentor = (newMentorId) => {
    setSelectedMentorId(newMentorId);
    setSearchParams({ mentorId: newMentorId });
    if (active === 'all-mentors') {
      setActive('dashboard');
    }
  };

  const openStudent = async (student) => {
    try {
      setSelectedStudent(student);
      setStudentDetail(null);
      const res = await getMentorStudent(student.id, getParams());
      setStudentDetail(res.data?.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load student');
    }
  };

  const baseNav = [
    ...(isAdmin ? [['all-mentors', 'All Mentors & Activity', Layers]] : []),
    ['dashboard', 'Dashboard', LayoutDashboard],
    ['schedule', 'Schedule & Calendar', CalendarDays],
    ['students', 'Assigned Students', Users],
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
    if (page === 'all-mentors') loadOverview();
    if (page === 'students') loadStudents();
    if (page === 'schedule') loadClasses();
    if (page === 'assignments') loadAssignments();
    if (page === 'projects') loadProjects();
    if (page === 'messages') loadMessages();
    if (page === 'announcements') loadStudents();
    if (page === 'notifications') loadNotifications();
    if (page === 'reports') loadReports();
  };

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(s => [s.name, s.email, s.batch, s.course, s.status].join(' ').toLowerCase().includes(q));
  }, [students, search]);

  const activeMentor = !isAdmin
    ? user
    : (allMentors.find(m => m._id === selectedMentorId) || data?.mentor || (allMentors[0] || null));

  const mentor = !isAdmin
    ? (data?.mentor || user || {})
    : (activeMentor || data?.mentor || {});

  const mentorDisplayName = !isAdmin
    ? (user?.name || 'Mentor')
    : (mentor?.name || (allMentors.length === 0 ? 'No Mentors Registered' : 'Select a Mentor'));

  const stats = data?.stats || {};
  const todayClasses = data?.todaysClasses || [];
  const atRisk = (data?.students || []).filter(s => s.status === 'At Risk');



  return (
    <div className="mentor-app">
      {mobileOpen && <div className="mentor-overlay" onClick={() => setMobileOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`mentor-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="mentor-brand">
          <img src="/welogo.png" alt="WeIntern" />
          <span>{isAdmin ? 'Admin · Mentor Portal' : 'Mentor Portal'}</span>
          <button className="mentor-close" onClick={() => setMobileOpen(false)}><X size={20}/></button>
        </div>

        <div className="mentor-profile-mini">
          <div className="mentor-avatar">{initials(mentorDisplayName)}</div>
          <div>
            <strong>{mentorDisplayName}</strong>
            <small>{isAdmin ? (mentor?.email ? `👑 ${mentor.email}` : '👑 Supervised by Admin') : (user?.email || 'Mentor')}</small>
          </div>
        </div>

        <nav className="mentor-nav">
          {baseNav.map(([key, label, Icon]) => (
            <button
              key={key}
              className={active === key ? 'active' : ''}
              onClick={() => changePage(key)}
            >
              <Icon size={18}/>
              <span>{label}</span>
              {key === 'notifications' && stats.unreadNotifications > 0 && <b>{stats.unreadNotifications}</b>}
            </button>
          ))}
        </nav>

        {isAdmin ? (
          <Link to="/admin" className="mentor-logout" style={{ textDecoration: 'none', background: 'rgba(232,168,32,0.15)', color: '#fbd24e', borderColor: '#e8a820' }}>
            <ArrowLeft size={18}/> Return to Admin Panel
          </Link>
        ) : (
          <button className="mentor-logout" onClick={logout}><LogOut size={18}/> Logout</button>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="mentor-main">
        {/* Admin Supervision Topbar Banner */}
        {isAdmin && (
          <div className="admin-mentor-topbar">
            <div className="admin-mentor-topbar-left">
              <span className="admin-badge"><Shield size={13}/> ADMIN SUPERVISION</span>
              <span className="admin-viewing-text">
                Active Mentor: <strong>{mentor?.name || (allMentors.length === 0 ? 'No Mentors Created Yet' : 'None Selected')}</strong>
              </span>
              {mentor?.email && <span className="admin-mentor-email">({mentor.email})</span>}
            </div>

            <div className="admin-mentor-topbar-right">
              {allMentors.length > 0 ? (
                <>
                  <label className="admin-select-label">Switch Mentor:</label>
                  <select
                    className="admin-mentor-dropdown"
                    value={selectedMentorId || ''}
                    onChange={(e) => handleSwitchMentor(e.target.value)}
                  >
                    <option value="">-- Choose Mentor --</option>
                    {allMentors.map(m => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.studentCount || 0} students) — {(m.expertise || []).join(', ') || m.email}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <Link to="/admin" className="admin-exit-btn" style={{ background: '#e8a820', color: '#12233f', fontWeight: 800 }}>
                  + Create Mentor in Admin Panel
                </Link>
              )}

              <button
                className="admin-exit-btn"
                onClick={() => changePage('all-mentors')}
                style={{ cursor: 'pointer', background: active === 'all-mentors' ? '#e8a820' : undefined, color: active === 'all-mentors' ? '#12233f' : undefined }}
              >
                <Layers size={14}/> All Mentors Overview
              </button>

              <Link to="/admin" className="admin-exit-btn">
                <ArrowLeft size={14}/> Admin Panel
              </Link>
            </div>
          </div>
        )}

        {/* Regular Header */}
        <header className="mentor-header">
          <div className="mentor-header-left">
            <button className="mentor-menu" onClick={() => setMobileOpen(true)}><Menu size={22}/></button>
            <div>
              <div className="mentor-breadcrumb">
                {isAdmin ? `Admin Mode / Mentors / ${mentor?.name || 'Overview'}` : 'Mentor Portal'} / {baseNav.find(n => n[0] === active)?.[1]}
              </div>
              <h1>
                {active === 'dashboard'
                  ? (isAdmin
                      ? (mentor?.name ? `Dashboard of ${mentor.name}` : 'Mentor Dashboard')
                      : `Welcome, ${user?.name?.split(' ')[0] || user?.name || 'Mentor'} 👋`)
                  : active === 'all-mentors'
                  ? 'All Mentors & Activity Overview'
                  : baseNav.find(n => n[0] === active)?.[1]}
              </h1>
            </div>
          </div>

          <div className="mentor-header-actions">
            <button
              className="mentor-icon-btn"
              onClick={() => {
                if (active === 'all-mentors') loadOverview();
                else loadAll(true, selectedMentorId);
              }}
              title="Refresh"
            >
              <RefreshCw size={18} className={refreshing ? 'spin' : ''}/>
            </button>
            
            <button className="mentor-icon-btn" onClick={() => changePage('notifications')}>
              <Bell size={18}/>
              {stats.unreadNotifications > 0 && <i>{stats.unreadNotifications}</i>}
            </button>

            <div className="mentor-header-user" onClick={() => changePage('profile')}>
              <div className="mentor-avatar small">{initials(isAdmin ? user?.name : mentorDisplayName)}</div>
              <span>{isAdmin ? `${user?.name} (Admin)` : mentorDisplayName}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <section className="mentor-content">
          {active === 'all-mentors' && isAdmin && (
            <AllMentorsHub
              overview={allOverview}
              loading={overviewLoading}
              onSelectMentor={handleSwitchMentor}
              selectedMentorId={selectedMentorId}
              onReload={loadOverview}
            />
          )}

          {active === 'dashboard' && (
            loading && !data ? (
              <div className="mentor-loading small">
                <div className="mentor-spinner" />
                <p>Loading mentor dashboard…</p>
              </div>
            ) : (
              <DashboardHome
                data={data}
                onPage={changePage}
                onRefresh={() => loadAll(true, selectedMentorId)}
                openStudent={openStudent}
                isAdmin={isAdmin}
                mentorName={mentor.name}
              />
            )
          )}

          {active === 'schedule' && (
            <SchedulePage
              classes={classes}
              students={students}
              onCreate={() => setModal('class')}
              onReload={loadClasses}
              isAdmin={isAdmin}
              mentorName={mentor.name}
            />
          )}

          {active === 'students' && (
            <StudentsPage
              students={filteredStudents}
              search={search}
              setSearch={setSearch}
              openStudent={openStudent}
              mentorName={mentor.name}
              isAdmin={isAdmin}
            />
          )}

          {active === 'progress' && (
            <ProgressPage
              students={students}
              openStudent={openStudent}
              mentorName={mentor.name}
            />
          )}

          {active === 'assignments' && (
            <AssignmentsPage
              assignments={assignments}
              submissions={submissions}
              students={students}
              onCreate={() => setModal('assignment')}
              onReload={loadAssignments}
              mentorName={mentor.name}
            />
          )}

          {active === 'attendance' && (
            <AttendancePage
              classes={classes}
              students={students}
              onReload={() => loadAll(true, selectedMentorId)}
              mentorName={mentor.name}
            />
          )}

          {active === 'projects' && (
            <ProjectsPage
              projects={projects}
              onReload={loadProjects}
              mentorName={mentor.name}
            />
          )}

          {active === 'messages' && (
            <MessagesPage
              students={students}
              messages={messages}
              onReload={loadMessages}
              mentorName={mentor.name}
              selectedMentorId={selectedMentorId}
              isAdmin={isAdmin}
            />
          )}

          {active === 'announcements' && (
            <AnnouncementsPage
              students={students}
              mentorName={mentor.name}
              selectedMentorId={selectedMentorId}
              isAdmin={isAdmin}
            />
          )}

          {active === 'notifications' && (
            <NotificationsPage
              notifications={notifications}
              onReload={loadNotifications}
            />
          )}

          {active === 'reports' && (
            <ReportsPage
              reports={reports}
              students={students}
              mentorName={mentor.name}
            />
          )}

          {active === 'profile' && (
            <ProfilePage
              mentor={mentor}
              selectedMentorId={selectedMentorId}
              isAdmin={isAdmin}
              onReload={() => loadAll(true, selectedMentorId)}
            />
          )}

          {active === 'settings' && (
            <SettingsPage logout={logout} isAdmin={isAdmin} />
          )}
        </section>
      </main>

      {/* Modals */}
      {modal === 'class' && (
        <ClassModal
          students={students}
          selectedMentorId={selectedMentorId}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); loadAll(true, selectedMentorId); }}
        />
      )}

      {modal === 'assignment' && (
        <AssignmentModal
          students={students}
          selectedMentorId={selectedMentorId}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); loadAll(true, selectedMentorId); }}
        />
      )}

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          detail={studentDetail}
          onClose={() => { setSelectedStudent(null); setStudentDetail(null); }}
          onRefresh={() => openStudent(selectedStudent)}
        />
      )}
    </div>
  );
}

// ── All Mentors Hub (Admin Overview) ────────────────────────
function AllMentorsHub({ overview, loading, onSelectMentor, selectedMentorId, onReload }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [allocatingMentor, setAllocatingMentor] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Mentor Creation Form State
  const [createForm, setCreateForm] = useState({
    name: '', email: '', password: '', phone: '',
    expertise: '', skills: '', assignedCourses: '', assignedBatches: '',
    bio: '', experience: ''
  });
  const [createSelectedStudents, setCreateSelectedStudents] = useState([]);
  const [createStudentSearch, setCreateStudentSearch] = useState('');
  const [createDomainFilter, setCreateDomainFilter] = useState('all');
  const [creating, setCreating] = useState(false);

  // Allocation Modal State
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [allocationSearch, setAllocationSearch] = useState('');
  const [allocDomainFilter, setAllocDomainFilter] = useState('all');
  const [allocating, setAllocating] = useState(false);

  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await getAdminStudentsWithMentors();
      setAllStudents(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Compute list of unique enrolled domains/courses across students
  const availableDomains = useMemo(() => {
    const set = new Set();
    allStudents.forEach(s => {
      if (s.domain && s.domain !== 'General Internship') set.add(s.domain);
      (s.allDomains || []).forEach(d => {
        if (d && d !== 'General Internship') set.add(d);
      });
      (s.enrolledCourses || []).forEach(c => {
        if (c) set.add(c);
      });
    });
    return Array.from(set).sort();
  }, [allStudents]);

  const openAllocateModal = (mentor) => {
    setAllocatingMentor(mentor);
    const currentAssigned = allStudents
      .filter(s => s.mentor?._id === mentor._id || s.mentor === mentor._id)
      .map(s => s._id);
    setSelectedStudentIds(currentAssigned);
    setAllocationSearch('');
    setAllocDomainFilter('all');
  };

  const handleSaveAllocation = async () => {
    if (!allocatingMentor) return;
    setAllocating(true);
    try {
      const currentAssignedIds = allStudents
        .filter(s => s.mentor?._id === allocatingMentor._id || s.mentor === allocatingMentor._id)
        .map(s => s._id);

      const toAssign = selectedStudentIds.filter(id => !currentAssignedIds.includes(id));
      const toUnassign = currentAssignedIds.filter(id => !selectedStudentIds.includes(id));

      if (toAssign.length > 0) {
        await assignStudentsBulk({ mentorId: allocatingMentor._id, studentIds: toAssign, action: 'assign' });
      }
      if (toUnassign.length > 0) {
        await assignStudentsBulk({ mentorId: allocatingMentor._id, studentIds: toUnassign, action: 'unassign' });
      }

      toast.success(`Allocated students updated for ${allocatingMentor.name}`);
      setAllocatingMentor(null);
      await loadStudents();
      onReload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to allocate students');
    } finally {
      setAllocating(false);
    }
  };

  const handleCreateMentor = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.password) {
      return toast.error('Name, email and password are required');
    }
    if (createForm.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setCreating(true);
    try {
      await createMentorAccount({
        ...createForm,
        studentIds: createSelectedStudents
      });
      toast.success(`Mentor "${createForm.name}" created successfully!`);
      setCreateForm({
        name: '', email: '', password: '', phone: '',
        expertise: '', skills: '', assignedCourses: '', assignedBatches: '',
        bio: '', experience: ''
      });
      setCreateSelectedStudents([]);
      setShowCreateModal(false);
      await loadStudents();
      onReload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to create mentor');
    } finally {
      setCreating(false);
    }
  };

  const filteredAllocStudents = allStudents.filter(s => {
    const q = allocationSearch.trim().toLowerCase();
    const matchesSearch = !q || [s.name, s.email, s.college, s.year, s.domain, ...(s.allDomains || []), ...(s.enrolledCourses || [])].join(' ').toLowerCase().includes(q);
    const matchesDomain = allocDomainFilter === 'all' || s.domain === allocDomainFilter || (s.allDomains || []).includes(allocDomainFilter) || (s.enrolledCourses || []).includes(allocDomainFilter);
    return matchesSearch && matchesDomain;
  });

  const filteredCreateStudents = allStudents.filter(s => {
    const q = createStudentSearch.trim().toLowerCase();
    const matchesSearch = !q || [s.name, s.email, s.college, s.year, s.domain, ...(s.allDomains || []), ...(s.enrolledCourses || [])].join(' ').toLowerCase().includes(q);
    const matchesDomain = createDomainFilter === 'all' || s.domain === createDomainFilter || (s.allDomains || []).includes(createDomainFilter) || (s.enrolledCourses || []).includes(createDomainFilter);
    return matchesSearch && matchesDomain;
  });

  if (loading) {
    return (
      <div className="mentor-loading small">
        <div className="mentor-spinner" />
        <p>Loading all mentors activity…</p>
      </div>
    );
  }

  const stats = overview?.stats || {};
  const mentors = overview?.mentors || [];
  const recentAnnouncements = overview?.recentAnnouncements || [];
  const recentClasses = overview?.recentClasses || [];
  const recentAssignments = overview?.recentAssignments || [];

  return (
    <div>
      <div className="mentor-welcome">
        <div>
          <span className="eyebrow">ADMIN SUPERVISION HUB</span>
          <h2>All Mentors & Platform Activity</h2>
          <p>Monitor all mentor operations, active batches, live classes, and announcements.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="primary-btn"
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'linear-gradient(135deg, #e8a820, #f5c453)',
              color: '#12233f',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(232, 168, 32, 0.3)'
            }}
          >
            <Plus size={16}/> Add New Mentor
          </button>
          <button className="btn btn-outline" onClick={onReload} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={15}/> Refresh Overview
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="mentor-stats-grid">
        <StatCard icon={<Users/>} label="Total Mentors" value={stats.totalMentors || 0} hint="Active mentor accounts" />
        <StatCard icon={<BookOpen/>} label="Students Mentored" value={stats.totalStudentsMentored || 0} hint="Assigned to mentors" />
        <StatCard icon={<CalendarDays/>} label="Total Classes" value={stats.totalClasses || 0} hint="Scheduled sessions" />
        <StatCard icon={<ClipboardList/>} label="Total Assignments" value={stats.totalAssignments || 0} hint="Across all programs" />
        <StatCard icon={<CheckSquare/>} label="Pending Reviews" value={stats.totalPendingSubmissions || 0} hint="Submissions to grade" danger={stats.totalPendingSubmissions > 0} />
      </div>

      {/* Mentors Grid Cards */}
      <div className="mentor-page-title" style={{ marginTop: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="eyebrow">ALL MENTOR ROSTER</span>
          <h3>Active Mentors ({mentors.length})</h3>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => setShowCreateModal(true)}
          style={{ fontSize: '.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5 }}
        >
          <UserPlus size={14}/> Create Another Mentor
        </button>
      </div>

      <div className="all-mentors-grid">
        {mentors.map(m => (
          <div
            key={m._id}
            className={`all-mentor-card ${m._id === selectedMentorId ? 'active-mentor' : ''}`}
          >
            <div className="all-mentor-card-head">
              <div className="mentor-avatar">{initials(m.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: '.92rem', display: 'block', color: '#172642' }}>{m.name}</strong>
                <span style={{ fontSize: '.72rem', color: '#7a889b', display: 'block' }}>{m.email}</span>
                <span style={{ fontSize: '.68rem', color: '#e8a820', fontWeight: 700, marginTop: 2, display: 'block' }}>
                  {(m.expertise || []).join(', ') || 'Mentor'}
                </span>
              </div>
              <span className={`status-pill ${m.isBlocked ? 'absent' : 'present'}`}>
                {m.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </div>

            <div className="all-mentor-card-stats">
              <div>
                <strong>{m.studentCount || 0}</strong>
                <span>Students</span>
              </div>
              <div>
                <strong>{m.classCount || 0}</strong>
                <span>Classes</span>
              </div>
              <div>
                <strong>{m.assignmentCount || 0}</strong>
                <span>Assignments</span>
              </div>
              <div>
                <strong style={{ color: m.pendingCount > 0 ? '#dc4545' : '#172642' }}>{m.pendingCount || 0}</strong>
                <span>Pending</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 4 }}>
              <button
                className="primary-btn"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => onSelectMentor(m._id)}
              >
                <ExternalLink size={14}/> {m._id === selectedMentorId ? 'Viewing Dashboard ✓' : 'Open Dashboard'}
              </button>
              <button
                className="btn btn-outline"
                style={{
                  fontSize: '.75rem',
                  padding: '7px 11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontWeight: 700,
                  borderColor: '#cbd5e1',
                  background: '#f8fafc',
                  color: '#1e293b'
                }}
                onClick={() => openAllocateModal(m)}
                title="Allocate Students to this Mentor"
              >
                <Users size={14}/> Allocate ({m.studentCount || 0})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE MENTOR MODAL ── */}
      {showCreateModal && (
        <div className="mentor-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="mentor-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 740 }}>
            <div className="modal-head">
              <h2>Add New Mentor Account</h2>
              <button onClick={() => setShowCreateModal(false)}><X size={18}/></button>
            </div>
            <form onSubmit={handleCreateMentor} className="modal-body">
              <div className="form-grid">
                <label>
                  Full Name *
                  <input
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={createForm.name}
                    onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                  />
                </label>
                <label>
                  Email Address *
                  <input
                    required
                    type="email"
                    placeholder="e.g. rajesh.kumar@weintern.in"
                    value={createForm.email}
                    onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                  />
                </label>
                <label>
                  Temporary Password * (Min 6 chars)
                  <input
                    required
                    type="password"
                    minLength="6"
                    placeholder="Set secure password"
                    value={createForm.password}
                    onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                  />
                </label>
                <label>
                  Phone Number
                  <input
                    placeholder="+91 98765 43210"
                    value={createForm.phone}
                    onChange={e => setCreateForm({ ...createForm, phone: e.target.value })}
                  />
                </label>
                <label className="span-2">
                  Expertise & Specialization (comma separated)
                  <input
                    placeholder="e.g. FullStack and MERN stack developer, Data Analytics, Python"
                    value={createForm.expertise}
                    onChange={e => setCreateForm({ ...createForm, expertise: e.target.value })}
                  />
                </label>
                <label>
                  Key Skills (comma separated)
                  <input
                    placeholder="React, Node.js, Express.js, MongoDB"
                    value={createForm.skills}
                    onChange={e => setCreateForm({ ...createForm, skills: e.target.value })}
                  />
                </label>
                <label>
                  Assigned Batches (comma separated)
                  <input
                    placeholder="e.g. Fullstack Batch 15 August 2026"
                    value={createForm.assignedBatches}
                    onChange={e => setCreateForm({ ...createForm, assignedBatches: e.target.value })}
                  />
                </label>
                <label className="span-2">
                  Short Bio / Background
                  <textarea
                    rows={2}
                    placeholder="e.g. 2 years of experience as a fullstack developer..."
                    value={createForm.bio}
                    onChange={e => setCreateForm({ ...createForm, bio: e.target.value })}
                  />
                </label>
              </div>

              {/* Enrolled Students Allocation Section with Domain Filtering */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <strong style={{ fontSize: '.84rem', color: '#1e293b', display: 'block' }}>
                      Allocate Enrolled Students to this Mentor
                    </strong>
                    <span style={{ fontSize: '.68rem', color: '#64748b' }}>
                      Filter by enrolled domain or course and select students to assign ({createSelectedStudents.length} selected)
                    </span>
                  </div>
                  <div className="search-box" style={{ maxWidth: 240, padding: '5px 9px' }}>
                    <Search size={14}/>
                    <input
                      placeholder="Search by name, domain, email..."
                      value={createStudentSearch}
                      onChange={e => setCreateStudentSearch(e.target.value)}
                      style={{ fontSize: '.72rem' }}
                    />
                  </div>
                </div>

                {/* Domain Filter Bar & Quick Select Controls */}
                <div className="allocation-filter-bar">
                  <select
                    className="allocation-select-filter"
                    value={createDomainFilter}
                    onChange={e => setCreateDomainFilter(e.target.value)}
                  >
                    <option value="all">🎯 All Domains / Courses ({allStudents.length})</option>
                    {availableDomains.map(d => (
                      <option key={d} value={d}>🏷️ Domain: {d}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '.72rem', padding: '5px 10px', background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', fontWeight: 700 }}
                    onClick={() => {
                      const ids = filteredCreateStudents.map(s => s._id);
                      setCreateSelectedStudents(Array.from(new Set([...createSelectedStudents, ...ids])));
                    }}
                  >
                    + Select All Filtered ({filteredCreateStudents.length})
                  </button>
                  {createSelectedStudents.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ fontSize: '.72rem', padding: '5px 10px', color: '#b91c1c' }}
                      onClick={() => setCreateSelectedStudents([])}
                    >
                      Clear ({createSelectedStudents.length})
                    </button>
                  )}
                </div>

                <div className="allocation-student-list" style={{ maxHeight: 220 }}>
                  {filteredCreateStudents.length === 0 ? (
                    <div className="mentor-empty">No students found matching this domain/filter</div>
                  ) : (
                    filteredCreateStudents.map(st => {
                      const isSelected = createSelectedStudents.includes(st._id);
                      return (
                        <div
                          key={st._id}
                          className={`allocation-student-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            if (isSelected) {
                              setCreateSelectedStudents(createSelectedStudents.filter(id => id !== st._id));
                            } else {
                              setCreateSelectedStudents([...createSelectedStudents, st._id]);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                          />
                          <div className="allocation-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <strong>{st.name}</strong>
                              <span style={{ fontSize: '.68rem', color: '#64748b' }}>({st.email})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                              <span className="allocation-domain-tag">
                                🎯 Enrolled Domain: {st.domain || 'General Internship'}
                              </span>
                              {st.college && (
                                <span style={{ fontSize: '.65rem', color: '#475569' }}>🏫 {st.college}</span>
                              )}
                              {st.year && (
                                <span style={{ fontSize: '.65rem', color: '#475569' }}>• {st.year}</span>
                              )}
                              {st.enrolledCourses && st.enrolledCourses.length > 0 && (
                                st.enrolledCourses.map(c => (
                                  <span key={c} className="allocation-course-pill">📚 {c}</span>
                                ))
                              )}
                            </div>
                          </div>
                          {st.mentor ? (
                            <span className="allocation-badge assigned-other">
                              Assigned to {st.mentor.name}
                            </span>
                          ) : (
                            <span className="allocation-badge unassigned">Unassigned</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={creating}
                  style={{ background: 'linear-gradient(135deg, #e8a820, #f5c453)', color: '#12233f', fontWeight: 800 }}
                >
                  {creating ? 'Creating Mentor...' : `✓ Create Mentor & Allocate (${createSelectedStudents.length} Students)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ALLOCATE STUDENTS MODAL ── */}
      {allocatingMentor && (
        <div className="mentor-modal-backdrop" onClick={() => setAllocatingMentor(null)}>
          <div className="mentor-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 740 }}>
            <div className="modal-head">
              <div>
                <h2 style={{ fontSize: '1.05rem', margin: 0 }}>
                  Allocate Students to {allocatingMentor.name}
                </h2>
                <span style={{ fontSize: '.72rem', color: '#64748b' }}>
                  {allocatingMentor.email} • {selectedStudentIds.length} student(s) allocated
                </span>
              </div>
              <button onClick={() => setAllocatingMentor(null)}><X size={18}/></button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
                  <Search size={15}/>
                  <input
                    placeholder="Search by student name, domain, email, college..."
                    value={allocationSearch}
                    onChange={e => setAllocationSearch(e.target.value)}
                  />
                </div>
                <select
                  className="allocation-select-filter"
                  value={allocDomainFilter}
                  onChange={e => setAllocDomainFilter(e.target.value)}
                >
                  <option value="all">🎯 All Domains ({allStudents.length})</option>
                  {availableDomains.map(d => (
                    <option key={d} value={d}>🏷️ {d}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '.75rem', padding: '7px 11px', whiteSpace: 'nowrap', background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', fontWeight: 700 }}
                  onClick={() => {
                    const allIds = filteredAllocStudents.map(s => s._id);
                    setSelectedStudentIds(Array.from(new Set([...selectedStudentIds, ...allIds])));
                  }}
                >
                  + Select All in Filter ({filteredAllocStudents.length})
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '.75rem', padding: '7px 11px', whiteSpace: 'nowrap' }}
                  onClick={() => setSelectedStudentIds([])}
                >
                  Clear All
                </button>
              </div>

              <div className="allocation-student-list">
                {studentsLoading ? (
                  <div className="mentor-loading small">
                    <div className="mentor-spinner" />
                    <p>Loading student directory…</p>
                  </div>
                ) : filteredAllocStudents.length === 0 ? (
                  <div className="mentor-empty">No matching students found for this filter</div>
                ) : (
                  filteredAllocStudents.map(st => {
                    const isSelected = selectedStudentIds.includes(st._id);
                    const isCurrentMentor = st.mentor?._id === allocatingMentor._id || st.mentor === allocatingMentor._id;

                    return (
                      <div
                        key={st._id}
                        className={`allocation-student-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedStudentIds(selectedStudentIds.filter(id => id !== st._id));
                          } else {
                            setSelectedStudentIds([...selectedStudentIds, st._id]);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                        />
                        <div className="allocation-info">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <strong>{st.name}</strong>
                            <span style={{ fontSize: '.68rem', color: '#64748b' }}>({st.email})</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                            <span className="allocation-domain-tag">
                              🎯 Domain: {st.domain || 'General Internship'}
                            </span>
                            {st.college && (
                              <span style={{ fontSize: '.65rem', color: '#475569' }}>🏫 {st.college}</span>
                            )}
                            {st.year && (
                              <span style={{ fontSize: '.65rem', color: '#475569' }}>• {st.year}</span>
                            )}
                            {st.enrolledCourses && st.enrolledCourses.length > 0 && (
                              st.enrolledCourses.map(c => (
                                <span key={c} className="allocation-course-pill">📚 {c}</span>
                              ))
                            )}
                          </div>
                        </div>
                        {isCurrentMentor ? (
                          <span className="allocation-badge assigned-this">✓ Allocated to this mentor</span>
                        ) : st.mentor ? (
                          <span className="allocation-badge assigned-other">Assigned to {st.mentor.name}</span>
                        ) : (
                          <span className="allocation-badge unassigned">Unassigned</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setAllocatingMentor(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  disabled={allocating}
                  onClick={handleSaveAllocation}
                  style={{ background: 'linear-gradient(135deg, #e8a820, #f5c453)', color: '#12233f', fontWeight: 800 }}
                >
                  {allocating ? 'Saving Allocation...' : `✓ Save Allocation (${selectedStudentIds.length} Students)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two column: Recent Announcements & Recent Classes */}
      <div className="mentor-grid two" style={{ marginTop: '1.5rem' }}>
        <section className="mentor-card">
          <div className="mentor-card-head">
            <div>
              <h3>Recent Announcements Across Mentors</h3>
              <p>Broadcasts and alerts sent to students</p>
            </div>
          </div>
          {recentAnnouncements.length === 0 ? (
            <Empty text="No announcements sent yet." />
          ) : (
            <div>
              {recentAnnouncements.slice(0, 8).map(a => (
                <div key={a._id} className="announcement-feed-card">
                  <div className="announcement-feed-head">
                    <strong>{a.title}</strong>
                    <span>{fmtDate(a.createdAt)}</span>
                  </div>
                  <div className="announcement-feed-body">{a.message}</div>
                  <div style={{ fontSize: '.65rem', color: '#8fa1bd', marginTop: 4 }}>
                    To: {a.recipient?.name || 'Student'} ({a.recipient?.email || ''})
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mentor-card">
          <div className="mentor-card-head">
            <div>
              <h3>Recent Scheduled Classes</h3>
              <p>Lectures, workshops and review sessions</p>
            </div>
          </div>
          {recentClasses.length === 0 ? (
            <Empty text="No classes scheduled." />
          ) : (
            <div className="class-list">
              {recentClasses.slice(0, 8).map(c => (
                <div className="class-row" key={c._id}>
                  <div className="class-time">
                    <strong>{fmtTime(c.startTime)}</strong>
                    <span>{fmtDate(c.date)}</span>
                  </div>
                  <div className="class-dot" />
                  <div className="class-info">
                    <strong>{c.title}</strong>
                    <span>By {c.mentor?.name || 'Mentor'} · {c.batch || 'General'}</span>
                  </div>
                  <span className={`status-pill ${c.status}`}>{c.status}</span>
                  {c.meetingLink && (
                    <a href={c.meetingLink} target="_blank" rel="noreferrer" className="join-btn">
                      <Video size={14}/> Join
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function DashboardHome({ data, onPage, openStudent, isAdmin, mentorName }) {
  const stats = data?.stats || {};
  const classes = data?.todaysClasses || [];
  const risk = (data?.students || []).filter(s => s.status === 'At Risk');
  const activity = data?.activity || [];

  return (
    <>
      <div className="mentor-welcome">
        <div>
          <span className="eyebrow">TODAY'S OVERVIEW</span>
          <h2>{isAdmin ? `Dashboard of ${mentorName}` : 'Make every student count.'}</h2>
          <p>Here is what needs attention today for {mentorName || 'this mentor'}.</p>
        </div>
        <div className="mentor-date">
          <CalendarDays size={18}/> {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
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
          <div className="mentor-card-head">
            <div>
              <h3>Today's Schedule</h3>
              <p>Classes and mentoring sessions</p>
            </div>
            <button onClick={() => onPage('schedule')} className="text-btn">View calendar <ChevronRight size={16}/></button>
          </div>
          {classes.length === 0 ? (
            <Empty text="No classes scheduled for today." />
          ) : (
            <div className="class-list">
              {classes.map(c => (
                <div className="class-row" key={c._id}>
                  <div className="class-time">
                    <strong>{fmtTime(c.startTime)}</strong>
                    <span>{fmtTime(c.endTime)}</span>
                  </div>
                  <div className="class-dot" />
                  <div className="class-info">
                    <strong>{c.title}</strong>
                    <span>{c.batch || 'Batch'} · {c.students?.length || 0} students</span>
                  </div>
                  <span className={`status-pill ${c.status}`}>{c.status}</span>
                  {c.meetingLink && (
                    <a href={c.meetingLink} target="_blank" rel="noreferrer" className="join-btn">
                      <Video size={14}/> Join
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mentor-card">
          <div className="mentor-card-head">
            <div>
              <h3>Students At Risk</h3>
              <p>Intervene before progress slips</p>
            </div>
            <button onClick={() => onPage('students')} className="text-btn">All students <ChevronRight size={16}/></button>
          </div>
          {risk.length === 0 ? (
            <Empty text="Great! No students are currently at risk." />
          ) : (
            <div className="risk-list">
              {risk.slice(0, 5).map(s => (
                <button className="risk-row" key={s.id} onClick={() => openStudent(s)}>
                  <div className="mentor-avatar tiny">{initials(s.name)}</div>
                  <div>
                    <strong>{s.name}</strong>
                    <span>{s.attendance}% attendance · {s.progress}% progress</span>
                  </div>
                  <AlertTriangle size={17}/>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mentor-grid two">
        <section className="mentor-card">
          <div className="mentor-card-head">
            <div>
              <h3>Learning Activity</h3>
              <p>Study activity recorded this month</p>
            </div>
          </div>
          <MiniActivityChart data={activity} />
        </section>

        <section className="mentor-card">
          <div className="mentor-card-head">
            <div>
              <h3>Quick Actions</h3>
              <p>Common mentor tasks</p>
            </div>
          </div>
          <div className="quick-actions">
            <button onClick={() => onPage('schedule')}><CalendarDays/><span>Schedule Class</span><ChevronRight/></button>
            <button onClick={() => onPage('attendance')}><CheckSquare/><span>Take Attendance</span><ChevronRight/></button>
            <button onClick={() => onPage('assignments')}><ClipboardList/><span>Review Assignments</span><ChevronRight/></button>
            <button onClick={() => onPage('students')}><Users/><span>View Students</span><ChevronRight/></button>
          </div>
        </section>
      </div>
    </>
  );
}

function MiniActivityChart({ data }) {
  const max = Math.max(1, ...data.map(x => Number(x.minutes || 0)));
  return (
    <div className="mini-chart">
      {data.slice(-14).map((x, i) => (
        <div className="mini-bar-wrap" key={x._id || i} title={`${x._id}: ${x.minutes} min`}>
          <div className="mini-bar" style={{ height: `${Math.max(6, Number(x.minutes || 0) / max * 100)}%` }} />
          <span>{String(x._id || '').slice(8, 10)}</span>
        </div>
      ))}
      {!data.length && <Empty text="No activity recorded yet." />}
    </div>
  );
}

function SchedulePage({ classes, students, onCreate, onReload, mentorName }) {
  const [view, setView] = useState('week');
  return (
    <div>
      <PageActions
        title={`Schedule & Calendar (${mentorName || 'Mentor'})`}
        subtitle="Manage lectures, workshops, project reviews and one-to-one sessions."
        action="Schedule Class"
        onAction={onCreate}
      />
      <div className="schedule-toolbar">
        <div className="segmented">
          {['day', 'week', 'month'].map(v => (
            <button className={view === v ? 'active' : ''} onClick={() => setView(v)} key={v}>
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <button className="outline-btn" onClick={onReload}><RefreshCw size={15}/> Refresh</button>
      </div>
      <div className="mentor-card">
        <div className="calendar-heading">
          <h3>{view === 'day' ? 'Daily Schedule' : view === 'week' ? 'Weekly Schedule' : 'Monthly Schedule'}</h3>
          <span>{classes.length} classes</span>
        </div>
        <div className="calendar-grid">
          {classes.map(c => (
            <div className="calendar-event" key={c._id}>
              <div className="event-date">{fmtDate(c.date)}</div>
              <strong>{c.title}</strong>
              <span>{c.startTime} – {c.endTime}</span>
              <span>{c.batch || 'All assigned students'} · {c.students?.length || 0} students</span>
              <div className="event-actions">
                <span className={`status-pill ${c.status}`}>{c.status}</span>
                {c.meetingLink && <a href={c.meetingLink} target="_blank" rel="noreferrer"><Video size={14}/> Join</a>}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {['live', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    className="mini-action"
                    onClick={async () => {
                      try {
                        await updateMentorClassStatus(c._id, status);
                        toast.success(`Class marked ${status}`);
                        onReload();
                      } catch (e) {
                        toast.error(e.response?.data?.message || 'Unable to update class');
                      }
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {!classes.length && <Empty text="No classes scheduled yet." />}
        </div>
      </div>
    </div>
  );
}

function StudentsPage({ students, search, setSearch, openStudent, mentorName }) {
  return (
    <div>
      <PageActions
        title={`Assigned Students (${mentorName || 'Mentor'})`}
        subtitle={`Students assigned to ${mentorName || 'this mentor'}.`}
      />
      <div className="mentor-card">
        <div className="filter-bar">
          <div className="search-box">
            <Search size={17}/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, batch or course..."
            />
          </div>
          <span>{students.length} students</span>
        </div>
        <div className="table-wrap">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Batch</th>
                <th>Attendance</th>
                <th>Progress</th>
                <th>Assignments</th>
                <th>Last Activity</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>
                    <button className="person-cell" onClick={() => openStudent(s)}>
                      <div className="mentor-avatar tiny">{initials(s.name)}</div>
                      <span>
                        <strong>{s.name}</strong>
                        <small>{s.email}</small>
                      </span>
                    </button>
                  </td>
                  <td>{s.batch}</td>
                  <td><strong>{s.attendance}%</strong></td>
                  <td>
                    <div className="table-progress">
                      <ProgressBar value={s.progress}/>
                      <span>{s.progress}%</span>
                    </div>
                  </td>
                  <td>{s.assignments || 0}</td>
                  <td>{s.lastActivity ? fmtDate(s.lastActivity) : 'No activity'}</td>
                  <td>
                    <span className={`risk-badge ${s.status.toLowerCase().replace(' ', '-')}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <button className="icon-link" onClick={() => openStudent(s)}>
                      <ChevronRight size={17}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!students.length && <Empty text="No students assigned yet." />}
        </div>
      </div>
    </div>
  );
}

function ProgressPage({ students, openStudent, mentorName }) {
  return (
    <div>
      <PageActions
        title={`Student Progress Overview (${mentorName || 'Mentor'})`}
        subtitle="Compare progress, attendance and engagement across assigned students."
      />
      <div className="mentor-progress-cards">
        {students.map(s => (
          <button className="progress-student" key={s.id} onClick={() => openStudent(s)}>
            <div className="person-cell">
              <div className="mentor-avatar tiny">{initials(s.name)}</div>
              <span>
                <strong>{s.name}</strong>
                <small>{s.course} · {s.batch}</small>
              </span>
            </div>
            <div className="metric-line">
              <span>Overall Progress</span>
              <b>{s.progress}%</b>
            </div>
            <ProgressBar value={s.progress}/>
            <div className="progress-meta">
              <span>Attendance {s.attendance}%</span>
              <span>{s.studyMinutes || 0} min study</span>
            </div>
            <div className="metric-line">
              <span>Status</span>
              <span className={`risk-badge ${s.status.toLowerCase().replace(' ', '-')}`}>{s.status}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AssignmentsPage({ assignments, submissions, students, onCreate, onReload, mentorName }) {
  const [review, setReview] = useState(null);
  return (
    <div>
      <PageActions
        title={`Assignments & Reviews (${mentorName || 'Mentor'})`}
        subtitle="Create assignments and review student submissions."
        action="Create Assignment"
        onAction={onCreate}
      />
      <div className="mentor-grid two">
        <section className="mentor-card">
          <div className="mentor-card-head">
            <div>
              <h3>Assignments Created</h3>
              <p>Deadlines and submission status</p>
            </div>
            <button className="outline-btn" onClick={onReload}><RefreshCw size={15}/></button>
          </div>
          <div className="assignment-list">
            {assignments.map(a => (
              <div className="assignment-row" key={a._id}>
                <div className="assignment-icon"><ClipboardList/></div>
                <div>
                  <strong>{a.title}</strong>
                  <span>{a.batch || 'Assigned students'} · Due {fmtDate(a.dueDate)}</span>
                </div>
                <div className="assignment-stats">
                  <b>{a.submitted}</b><small>submitted</small>
                  <b>{a.pending}</b><small>pending</small>
                  <b>{a.averageScore}%</b><small>avg</small>
                </div>
              </div>
            ))}
            {!assignments.length && <Empty text="No assignments created yet." />}
          </div>
        </section>

        <section className="mentor-card">
          <div className="mentor-card-head">
            <div>
              <h3>Submission Queue</h3>
              <p>Review work submitted by students</p>
            </div>
          </div>
          <div className="submission-list">
            {submissions.map(s => (
              <button className="submission-row" key={s._id} onClick={() => setReview(s)}>
                <div className="mentor-avatar tiny">{initials(s.student?.name)}</div>
                <div>
                  <strong>{s.student?.name}</strong>
                  <span>{s.assignment?.title}</span>
                </div>
                <span className={`status-pill ${s.status}`}>{s.status}</span>
                <ChevronRight size={16}/>
              </button>
            ))}
            {!submissions.length && <Empty text="No submissions waiting for review." />}
          </div>
        </section>
      </div>

      {review && (
        <ReviewModal
          submission={review}
          onClose={() => setReview(null)}
          onSaved={() => { setReview(null); onReload(); }}
        />
      )}
    </div>
  );
}

function AttendancePage({ classes, students, onReload, mentorName }) {
  const [classId, setClassId] = useState('');
  const [records, setRecords] = useState({});
  const selected = classes.find(c => c._id === classId);

  useEffect(() => {
    if (classes.length && !classId) setClassId(classes[0]._id);
  }, [classes, classId]);

  useEffect(() => {
    if (selected) {
      const next = {};
      (selected.students || []).forEach(s => { next[s._id] = 'present'; });
      setRecords(next);
    }
  }, [classId]);

  const save = async () => {
    if (!selected) return toast.error('Select a class');
    try {
      await saveMentorAttendance({
        classId,
        records: Object.entries(records).map(([studentId, status]) => ({ studentId, status }))
      });
      toast.success('Attendance saved');
      onReload(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to save attendance');
    }
  };

  return (
    <div>
      <PageActions
        title={`Attendance Management (${mentorName || 'Mentor'})`}
        subtitle="Mark Present, Absent, Late or Excused."
      />
      <div className="mentor-card">
        <div className="attendance-toolbar">
          <select value={classId} onChange={e => setClassId(e.target.value)}>
            <option value="">Select class</option>
            {classes.map(c => (
              <option value={c._id} key={c._id}>
                {fmtDate(c.date)} · {c.title}
              </option>
            ))}
          </select>
          <button
            className="outline-btn"
            onClick={() => {
              if (selected) {
                const n = {};
                selected.students.forEach(s => n[s._id] = 'present');
                setRecords(n);
              }
            }}
          >
            Mark All Present
          </button>
          <button className="primary-btn" onClick={save}><Save size={15}/> Save Attendance</button>
        </div>
        {!selected ? (
          <Empty text="Select a class to take attendance." />
        ) : (
          <div className="table-wrap">
            <table className="mentor-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Present</th>
                  <th>Late</th>
                  <th>Absent</th>
                  <th>Excused</th>
                </tr>
              </thead>
              <tbody>
                {selected.students.map(s => (
                  <tr key={s._id}>
                    <td>
                      <div className="person-cell">
                        <div className="mentor-avatar tiny">{initials(s.name)}</div>
                        <span><strong>{s.name}</strong><small>{s.email}</small></span>
                      </div>
                    </td>
                    {['present', 'late', 'absent', 'excused'].map(status => (
                      <td key={status}>
                        <button
                          className={`attendance-radio ${records[s._id] === status ? 'selected' : ''}`}
                          onClick={() => setRecords(r => ({ ...r, [s._id]: status }))}
                        >
                          <span/>
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsPage({ projects, onReload, mentorName }) {
  const [editing, setEditing] = useState(null);
  return (
    <div>
      <PageActions
        title={`Internship Projects (${mentorName || 'Mentor'})`}
        subtitle="Track each student's project stage and provide mentor feedback."
      />
      <div className="project-grid">
        {projects.map(p => (
          <div className="project-card" key={p._id}>
            <div className="project-head">
              <div className="mentor-avatar tiny">{initials(p.student?.name)}</div>
              <div>
                <strong>{p.student?.name}</strong>
                <small>{p.title}</small>
              </div>
              <span className="status-pill">{p.status}</span>
            </div>
            <ProgressBar value={p.progress}/>
            <div className="project-meta">
              <span>{p.progress}% complete</span>
              <span>{fmtDate(p.lastUpdate)}</span>
            </div>
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noreferrer" className="project-link">
                <ExternalLink size={14}/> Repository
              </a>
            )}
            <button className="outline-btn full" onClick={() => setEditing(p)}>Update Project</button>
          </div>
        ))}
        {!projects.length && <Empty text="No projects assigned yet." />}
      </div>
      {editing && (
        <ProjectModal
          project={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); onReload(); }}
        />
      )}
    </div>
  );
}

function MessagesPage({ students, messages, onReload, mentorName, selectedMentorId, isAdmin }) {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const send = async () => {
    if (!recipient || !message.trim()) return toast.error('Select a student and enter a message');
    try {
      await sendMentorMessage({
        recipientId: recipient,
        subject,
        message,
        attachmentUrl,
        mentorId: selectedMentorId
      });
      setMessage('');
      setSubject('');
      setAttachmentUrl('');
      toast.success('Message sent');
      onReload();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to send message');
    }
  };

  return (
    <div>
      <PageActions
        title={`Student Messages (${mentorName || 'Mentor'})`}
        subtitle="Direct communication with assigned students."
      />
      <div className="mentor-grid two">
        <section className="mentor-card">
          <h3>New Message</h3>
          <div className="form-grid">
            <label>
              Student
              <select value={recipient} onChange={e => setRecipient(e.target.value)}>
                <option value="">Select student</option>
                {students.map(s => (
                  <option value={s.id} key={s.id}>{s.name} · {s.email}</option>
                ))}
              </select>
            </label>
            <label>
              Subject
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject"/>
            </label>
            <label className="span-2">
              Attachment Link
              <input value={attachmentUrl} onChange={e => setAttachmentUrl(e.target.value)} placeholder="Drive / GitHub / file URL"/>
            </label>
            <label className="span-2">
              Message
              <textarea rows="6" value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message..."/>
            </label>
          </div>
          <button className="primary-btn" onClick={send}><Send size={15}/> Send Message</button>
        </section>

        <section className="mentor-card">
          <div className="mentor-card-head">
            <h3>Recent Messages</h3>
            <button className="outline-btn" onClick={onReload}><RefreshCw size={15}/></button>
          </div>
          <div className="message-list">
            {messages.map(m => (
              <div className="message-row" key={m._id}>
                <div className="mentor-avatar tiny">{initials(m.sender?.name)}</div>
                <div>
                  <strong>{m.sender?.name} → {m.recipient?.name}</strong>
                  <span>{m.subject || 'Message'}</span>
                  <p>{m.message}</p>
                </div>
              </div>
            ))}
            {!messages.length && <Empty text="No messages yet." />}
          </div>
        </section>
      </div>
    </div>
  );
}

function AnnouncementsPage({ students, mentorName, selectedMentorId, isAdmin }) {
  const [ids, setIds] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const send = async () => {
    if (!ids.length || !message.trim()) return toast.error('Select at least one student and enter a message');
    try {
      await sendMentorAnnouncement({
        studentIds: ids,
        title,
        message,
        mentorId: selectedMentorId
      });
      toast.success(`Announcement sent to ${ids.length} students`);
      setMessage('');
      setTitle('');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to send announcement');
    }
  };

  return (
    <div>
      <PageActions
        title={`Announcements (${mentorName || 'Mentor'})`}
        subtitle={`Broadcast announcements to students assigned to ${mentorName || 'this mentor'}.`}
      />
      <section className="mentor-card">
        <div className="select-all-row">
          <button
            className="outline-btn"
            onClick={() => setIds(ids.length === students.length ? [] : students.map(s => s.id))}
          >
            {ids.length === students.length ? 'Clear All' : 'Select All'}
          </button>
          <span>{ids.length} selected</span>
        </div>

        <div className="student-select-grid">
          {students.map(s => (
            <label key={s.id} className={ids.includes(s.id) ? 'selected' : ''}>
              <input
                type="checkbox"
                checked={ids.includes(s.id)}
                onChange={e => setIds(e.target.checked ? [...ids, s.id] : ids.filter(x => x !== s.id))}
              />
              <div className="mentor-avatar tiny">{initials(s.name)}</div>
              <span>{s.name}<small>{s.batch}</small></span>
            </label>
          ))}
        </div>

        <div className="form-grid announcement-form">
          <label>
            Title
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Important announcement title"/>
          </label>
          <label className="span-2">
            Message
            <textarea rows="5" value={message} onChange={e => setMessage(e.target.value)} placeholder="Write the announcement message..."/>
          </label>
        </div>

        <button className="primary-btn" onClick={send}><Megaphone size={15}/> Send Announcement</button>
      </section>
    </div>
  );
}

function NotificationsPage({ notifications, onReload }) {
  const mark = async n => {
    try {
      await markMentorNotificationRead(n._id);
      onReload();
    } catch (e) {}
  };

  return (
    <div>
      <PageActions
        title="Notifications"
        subtitle="Assignment submissions, classes, student activity and alerts."
      />
      <section className="mentor-card">
        <div className="notification-list">
          {notifications.map(n => (
            <button key={n._id} className={`notification-row ${!n.readAt ? 'unread' : ''}`} onClick={() => mark(n)}>
              <div className="notification-icon"><Bell size={16}/></div>
              <div>
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <small>{fmtDate(n.createdAt)}</small>
              </div>
              {!n.readAt && <span className="unread-dot"/>}
            </button>
          ))}
          {!notifications.length && <Empty text="No notifications." />}
        </div>
      </section>
    </div>
  );
}

function ReportsPage({ reports, students, mentorName }) {
  const exportCsv = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Students', reports?.totalStudents || 0],
      ['Attendance Rate', `${reports?.attendanceRate || 0}%`],
      ['Average Score', `${reports?.averageScore || 0}%`],
      ['Study Hours', reports?.totalStudyHours || 0],
      ['Projects', reports?.projects || 0],
      ['Completed Projects', reports?.completedProjects || 0],
      ['Assignments Reviewed', reports?.assignmentsReviewed || 0]
    ];
    const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weintern-mentor-report-${mentorName || 'mentor'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mentor-page-title">
        <div>
          <span className="eyebrow">MENTOR WORKSPACE</span>
          <h2>Mentor Reports ({mentorName || 'Mentor'})</h2>
          <p>High-level internship, attendance, assignment and project performance.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="outline-btn" onClick={exportCsv}><FileText size={15}/> Export CSV</button>
          <button className="primary-btn" onClick={() => window.print()}><FileText size={15}/> Print / Save PDF</button>
        </div>
      </div>

      <div className="report-grid">
        {[
          ['Total Students', reports?.totalStudents || 0],
          ['Attendance Rate', `${reports?.attendanceRate || 0}%`],
          ['Average Score', `${reports?.averageScore || 0}%`],
          ['Study Hours', reports?.totalStudyHours || 0],
          ['Projects', reports?.projects || 0],
          ['Completed Projects', reports?.completedProjects || 0],
          ['Assignments Reviewed', reports?.assignmentsReviewed || 0]
        ].map(([l, v]) => (
          <div className="report-card" key={l}>
            <span>{l}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>

      <section className="mentor-card report-note">
        <FileText/>
        <div>
          <h3>Student report dataset</h3>
          <p>Use Print → Save as PDF for a PDF report. CSV contains current mentor metrics and can be opened in Excel.</p>
        </div>
      </section>
    </div>
  );
}

function ProfilePage({ mentor, selectedMentorId, isAdmin, onReload }) {
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

  useEffect(() => {
    setForm({
      name: mentor.name || '',
      phone: mentor.phone || '',
      experience: mentor.experience || '',
      bio: mentor.bio || '',
      expertise: (mentor.expertise || []).join(', '),
      skills: (mentor.skills || []).join(', '),
      assignedCourses: (mentor.assignedCourses || []).join(', '),
      assignedBatches: (mentor.assignedBatches || []).join(', ')
    });
  }, [mentor]);

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
        assignedBatches: form.assignedBatches.split(',').map(x => x.trim()).filter(Boolean),
        mentorId: selectedMentorId
      });
      if (!isAdmin) {
        localStorage.setItem('wi_user', JSON.stringify(res.data?.data));
      }
      toast.success('Mentor profile updated');
      onReload();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageActions
        title="Mentor Profile"
        subtitle="Professional details, expertise and assigned courses/batches."
      />
      <section className="mentor-card profile-card">
        <div className="profile-hero">
          <div className="mentor-avatar large">{initials(mentor.name)}</div>
          <div>
            <h2>{mentor.name}</h2>
            <p>{mentor.email}</p>
            <span className="role-chip">{isAdmin ? 'Supervised Mentor Profile' : 'Mentor'}</span>
          </div>
        </div>
        <div className="profile-edit-grid">
          <label>Full Name<input value={form.name} onChange={e => update('name', e.target.value)}/></label>
          <label>Phone<input value={form.phone} onChange={e => update('phone', e.target.value)}/></label>
          <label>Experience<input value={form.experience} onChange={e => update('experience', e.target.value)} placeholder="e.g. 5 years"/></label>
          <label>Expertise<input value={form.expertise} onChange={e => update('expertise', e.target.value)} placeholder="e.g. Full Stack, AI"/></label>
          <label className="span-2">Skills<input value={form.skills} onChange={e => update('skills', e.target.value)} placeholder="React, Node.js, Python, MongoDB"/></label>
          <label>Assigned Courses<input value={form.assignedCourses} onChange={e => update('assignedCourses', e.target.value)} placeholder="Web Development, Data Science"/></label>
          <label>Assigned Batches<input value={form.assignedBatches} onChange={e => update('assignedBatches', e.target.value)} placeholder="Batch 2026-A"/></label>
          <label className="span-2">Bio<textarea rows="4" value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Short professional bio"/></label>
        </div>
        <div className="modal-actions">
          <button className="primary-btn" onClick={save} disabled={saving}>
            <Save size={15}/> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </section>
    </div>
  );
}

function SettingsPage({ logout, isAdmin }) {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  const savePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) return toast.error('Enter current and new password');
    if (passwords.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password changed successfully');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to change password');
    }
  };

  return (
    <div>
      <PageActions title="Settings" subtitle="Account security and notification preferences."/>
      <section className="mentor-card settings-list">
        <div><strong>Email notifications</strong><span>Receive important student, class and assignment alerts.</span></div>
        <label className="switch"><input type="checkbox" defaultChecked/><i/></label>
        <div><strong>Class reminders</strong><span>Receive reminders before scheduled classes.</span></div>
        <label className="switch"><input type="checkbox" defaultChecked/><i/></label>
        <div><strong>Student risk alerts</strong><span>Notify when student activity or attendance drops.</span></div>
        <label className="switch"><input type="checkbox" defaultChecked/><i/></label>
      </section>

      <section className="mentor-card password-card">
        <h3>Change Password</h3>
        <p>Use your current password to set a new password.</p>
        <div className="form-grid">
          <label>Current Password<input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}/></label>
          <label>New Password<input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}/></label>
          <label>Confirm Password<input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}/></label>
        </div>
        <button className="primary-btn" onClick={savePassword}><Save size={15}/> Change Password</button>
      </section>

      {!isAdmin && <button className="danger-btn" onClick={logout}><LogOut size={16}/> Logout</button>}
    </div>
  );
}

function StudentModal({ student, detail, onClose, onRefresh }) {
  const [note, setNote] = useState('');

  const addNote = async () => {
    if (!note.trim()) return;
    try {
      await addMentorNote(student.id, { note });
      setNote('');
      toast.success('Private note saved');
      onRefresh();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to save note');
    }
  };

  return (
    <Modal title={student.name} onClose={onClose}>
      <div className="student-profile-head">
        <div className="mentor-avatar large">{initials(student.name)}</div>
        <div>
          <h2>{student.name}</h2>
          <p>{student.email} · {student.batch} · {student.course}</p>
          <div className="student-dates">
            <span>Start: {fmtDate(detail?.student?.startDate)}</span>
            <span>Expected completion: {fmtDate(detail?.student?.expectedCompletionDate)}</span>
          </div>
          <span className={`risk-badge ${student.status.toLowerCase().replace(' ', '-')}`}>
            {student.status}
          </span>
        </div>
      </div>

      {!detail ? (
        <div className="mentor-loading small"><div className="mentor-spinner"/></div>
      ) : (
        <>
          <div className="student-metrics">
            {[
              ['Progress', detail.metrics.overallProgress + '%'],
              ['Attendance', detail.metrics.attendance + '%'],
              ['Assignments', detail.metrics.assignmentCompletion + '%'],
              ['Project', detail.metrics.projectCompletion + '%'],
              ['Avg Score', detail.metrics.assessmentPerformance + '%'],
              ['Study', Math.round(detail.metrics.totalStudyMinutes / 60 * 10) / 10 + 'h']
            ].map(([l, v]) => (
              <div key={l}><strong>{v}</strong><span>{l}</span></div>
            ))}
          </div>

          <div className="detail-section">
            <h3>Learning Progress</h3>
            {detail.learningProgress.map(x => (
              <div className="learning-row" key={x.module}>
                <span>{x.module}</span>
                <ProgressBar value={x.progress}/>
                <b>{x.progress}%</b>
              </div>
            ))}
          </div>

          <div className="detail-section">
            <h3>Attendance Overview</h3>
            <div className="attendance-summary">
              <div className="attendance-ring" style={{ '--p': `${detail.metrics.attendance}%` }}>
                <strong>{detail.metrics.attendance}%</strong>
                <span>Attendance</span>
              </div>
              <div className="attendance-box">
                <b>{detail.metrics.classesAttended}</b><span>Present/Late</span>
                <b>{detail.metrics.classesMissed}</b><span>Absent</span>
                <b>{detail.metrics.classesTotal}</b><span>Total Classes</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Assignments & Submissions</h3>
            <div className="history-list">
              {detail.submissions.slice(0, 8).map(s => (
                <div key={s._id}>
                  <span>{s.assignment?.title || 'Assignment'}</span>
                  <span>{s.score ?? '—'}</span>
                  <span className={`status-pill ${s.status}`}>{s.status}</span>
                </div>
              ))}
              {!detail.submissions.length && <Empty text="No submissions yet." />}
            </div>
          </div>

          <div className="detail-section">
            <h3>Private Mentor Notes</h3>
            <textarea
              rows="3"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note about this student's progress..."
            />
            <button className="primary-btn" onClick={addNote}><Save size={15}/> Save Note</button>
            {detail.notes?.slice(0, 5).map(n => (
              <div className="note-item" key={n._id}>
                {n.note}
                <small>{fmtDate(n.createdAt)}</small>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}

function ClassModal({ students, selectedMentorId, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '', description: '', batch: '', course: '',
    date: new Date().toISOString().slice(0, 10),
    startTime: '10:00', endTime: '11:00',
    classType: 'lecture', mode: 'online',
    meetingLink: '', learningMaterialUrl: '', notes: '',
    studentIds: []
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title || !form.date) return toast.error('Title and date are required');
    try {
      await createMentorClass({ ...form, mentorId: selectedMentorId });
      toast.success('Class scheduled');
      onSaved();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to schedule class');
    }
  };

  return (
    <Modal title="Schedule a Class" onClose={onClose}>
      <div className="form-grid">
        <label>Class Title<input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. React Fundamentals"/></label>
        <label>Batch<input value={form.batch} onChange={e => update('batch', e.target.value)} placeholder="MERN-2026-A"/></label>
        <label>Course<input value={form.course} onChange={e => update('course', e.target.value)} placeholder="MERN Stack"/></label>
        <label>Date<input type="date" value={form.date} onChange={e => update('date', e.target.value)}/></label>
        <label>Start Time<input type="time" value={form.startTime} onChange={e => update('startTime', e.target.value)}/></label>
        <label>End Time<input type="time" value={form.endTime} onChange={e => update('endTime', e.target.value)}/></label>
        <label>
          Class Type
          <select value={form.classType} onChange={e => update('classType', e.target.value)}>
            {['lecture', 'practical', 'workshop', 'doubt_session', 'project_review', 'one_to_one', 'assessment'].map(x => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Mode
          <select value={form.mode} onChange={e => update('mode', e.target.value)}>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </label>
        <label className="span-2">Meeting Link<input value={form.meetingLink} onChange={e => update('meetingLink', e.target.value)} placeholder="https://meet.google.com/..."/></label>
        <label className="span-2">Notes<textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows="3"/></label>
        <div className="span-2">
          <strong className="form-heading">Students (Select to assign)</strong>
          <div className="checkbox-grid">
            {students.map(s => (
              <label key={s.id}>
                <input
                  type="checkbox"
                  checked={form.studentIds.includes(s.id)}
                  onChange={e => update('studentIds', e.target.checked ? [...form.studentIds, s.id] : form.studentIds.filter(x => x !== s.id))}
                />
                {s.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <button className="outline-btn" onClick={onClose}>Cancel</button>
        <button className="primary-btn" onClick={submit}><CalendarDays size={15}/> Schedule Class</button>
      </div>
    </Modal>
  );
}

function AssignmentModal({ students, selectedMentorId, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '', description: '', batch: '', course: '',
    dueDate: '', maxScore: 100, studentIds: []
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title || !form.dueDate) return toast.error('Title and due date are required');
    try {
      await createMentorAssignment({ ...form, mentorId: selectedMentorId });
      toast.success('Assignment created');
      onSaved();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to create assignment');
    }
  };

  return (
    <Modal title="Create Assignment" onClose={onClose}>
      <div className="form-grid">
        <label>Assignment Title<input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Build REST API"/></label>
        <label>Due Date<input type="date" value={form.dueDate} onChange={e => update('dueDate', e.target.value)}/></label>
        <label>Batch<input value={form.batch} onChange={e => update('batch', e.target.value)}/></label>
        <label>Course<input value={form.course} onChange={e => update('course', e.target.value)}/></label>
        <label>Max Score<input type="number" value={form.maxScore} onChange={e => update('maxScore', Number(e.target.value))}/></label>
        <label className="span-2">Description<textarea rows="4" value={form.description} onChange={e => update('description', e.target.value)}/></label>
        <div className="span-2">
          <strong className="form-heading">Students</strong>
          <div className="checkbox-grid">
            {students.map(s => (
              <label key={s.id}>
                <input
                  type="checkbox"
                  checked={form.studentIds.includes(s.id)}
                  onChange={e => update('studentIds', e.target.checked ? [...form.studentIds, s.id] : form.studentIds.filter(x => x !== s.id))}
                />
                {s.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <button className="outline-btn" onClick={onClose}>Cancel</button>
        <button className="primary-btn" onClick={submit}><ClipboardList size={15}/> Create Assignment</button>
      </div>
    </Modal>
  );
}

function ReviewModal({ submission, onClose, onSaved }) {
  const [score, setScore] = useState(submission.score ?? '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [status, setStatus] = useState('reviewed');

  const save = async () => {
    try {
      await reviewMentorSubmission(submission._id, { score: Number(score), feedback, status });
      toast.success('Review saved');
      onSaved();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to review');
    }
  };

  return (
    <Modal title={`Review — ${submission.assignment?.title || 'Submission'}`} onClose={onClose}>
      <div className="submission-detail">
        <div className="person-cell">
          <div className="mentor-avatar">{initials(submission.student?.name)}</div>
          <span><strong>{submission.student?.name}</strong><small>{submission.student?.email}</small></span>
        </div>
        {submission.githubUrl && (
          <a href={submission.githubUrl} target="_blank" rel="noreferrer" className="project-link">
            <ExternalLink size={15}/> Open GitHub Repository
          </a>
        )}
        {submission.fileUrl && (
          <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="project-link">
            <ExternalLink size={15}/> Open Submitted File
          </a>
        )}
        <label>Score (Out of {submission.assignment?.maxScore || 100})<input type="number" min="0" max="100" value={score} onChange={e => setScore(e.target.value)}/></label>
        <label>Feedback<textarea rows="5" value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Provide constructive feedback..."/></label>
        <label>Status
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="changes_requested">Request Changes</option>
          </select>
        </label>
      </div>
      <div className="modal-actions">
        <button className="outline-btn" onClick={onClose}>Cancel</button>
        <button className="primary-btn" onClick={save}><CheckCircle2 size={15}/> Save Review</button>
      </div>
    </Modal>
  );
}

function ProjectModal({ project, onClose, onSaved }) {
  const [progress, setProgress] = useState(project.progress || 0);
  const [status, setStatus] = useState(project.status);
  const [comments, setComments] = useState(project.mentorComments || '');

  const save = async () => {
    try {
      await updateMentorProject(project._id, { progress: Number(progress), status, mentorComments: comments });
      toast.success('Project updated');
      onSaved();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to update project');
    }
  };

  return (
    <Modal title="Update Project" onClose={onClose}>
      <label>Progress (%)<input type="number" min="0" max="100" value={progress} onChange={e => setProgress(e.target.value)}/></label>
      <label>Status
        <select value={status} onChange={e => setStatus(e.target.value)}>
          {['onboarding', 'training', 'assignments', 'project', 'evaluation', 'completed'].map(x => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>Mentor Comments<textarea rows="5" value={comments} onChange={e => setComments(e.target.value)}/></label>
      <div className="modal-actions">
        <button className="outline-btn" onClick={onClose}>Cancel</button>
        <button className="primary-btn" onClick={save}><Save size={15}/> Save Project</button>
      </div>
    </Modal>
  );
}

function PageActions({ title, subtitle, action, onAction }) {
  return (
    <div className="mentor-page-title">
      <div>
        <span className="eyebrow">MENTOR WORKSPACE</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button className="primary-btn" onClick={onAction}><Plus size={16}/> {action}</button>
      )}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="mentor-empty">
      <Circle size={18}/>
      <span>{text}</span>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="mentor-modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="mentor-modal">
        <div className="modal-head">
          <div><h2>{title}</h2></div>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default MentorDashboard;
