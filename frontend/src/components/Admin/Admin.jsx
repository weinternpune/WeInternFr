import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  FaChartBar,
  FaFileAlt,
  FaBook,
  FaBuilding,
  FaUsers,
  FaGraduationCap,
  FaRocket,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import {
  getAdminApplications,
  updateApplicationStatus,
  getAdminEnrollments,
  getAdminHireRequests,
  updateHireRequest,
  getAdminUsers,
  getUserActivity,
  getAdminMentors,
  createMentorAccount,
  assignStudentToMentor,
  getAllMentorsOverview,
  getAdminBlogPosts,
  createBlogPost,
  deleteBlogPost,
getAdminCohortApplications,
updateCohortStatus,
} from "../../utils/api";
import API from "../../utils/api";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Admin.css";
import { useCourses } from "../../context/CoursesContext";

const statusBadge = (s) => (
  <span className={`badge-status badge-${s}`}>
    {s.charAt(0).toUpperCase() + s.slice(1)}
  </span>
);

const ADMIN_TABS = [
  { id: "overview", icon: <FaChartBar />, label: "Overview" },

  { id: "applications", icon: <FaFileAlt />, label: "Applications" },
  { id: "cohort", icon: <FaUsers />, label: "Cohort Applications" },
  { id: "enrollments", icon: <FaBook />, label: "Enrollments" },
  { id: "mentors", icon: <FaUsers />, label: "Mentors" },
  { id: "hire", icon: <FaBuilding />, label: "Hire Requests" },

  { id: "users", icon: <FaUsers />, label: "Users" },
  { id: "courses", icon: <FaGraduationCap />, label: "Courses" },
  { id: "projects", icon: <FaRocket />, label: "Projects" },
  { id: "blog", icon: <FaFileAlt />, label: "Blog" },
  { id: "admins", icon: <FaUserShield />, label: "Admins" },
];
const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="dashboard admin-panel">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`dash-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link to="/" className="dash-logo-link">
            <img src="/welogo.png" alt="WeIntern" className="dash-logo" />
          </Link>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="dash-user-card">
          <div className="dash-avatar-lg" style={{ background: "#dc4545" }}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              user.name?.[0]?.toUpperCase()
            )}
          </div>
          <div className="dash-user-details">
            <div className="dash-user-name">{user.name}</div>
            <div className="dash-user-role" style={{ color: "#ff6b6b" }}>
              Administrator
            </div>
          </div>
        </div>

        <div className="dash-sidebar-content">
          <div>
            <div className="dash-nav-section">
              <div className="dns-label">Main</div>
              {ADMIN_TABS.slice(0, 1).map((t) => (
                <button
                  key={t.id}
                  className={`dash-nav-item${tab === t.id ? " active" : ""}`}
                  onClick={() => {
                    setTab(t.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="dni-icon">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div className="dash-nav-section">
              <div className="dns-label">Management</div>
              {ADMIN_TABS.slice(1, 6).map((t) => (
                <button
                  key={t.id}
                  className={`dash-nav-item${tab === t.id ? " active" : ""}`}
                  onClick={() => {
                    setTab(t.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="dni-icon">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}

              <Link
                to="/mentor/dashboard"
                className="dash-nav-item"
                style={{
                  textDecoration: "none",
                  color: "#f5c453",
                  background: "rgba(232,168,32,0.12)",
                  border: "1px solid rgba(232,168,32,0.3)",
                  marginTop: "6px",
                  borderRadius: "8px"
                }}
              >
                <span className="dni-icon">🚀</span>
                <span>Mentor Portal →</span>
              </Link>
            </div>

            <div className="dash-nav-section">
              <div className="dns-label">System</div>
              {ADMIN_TABS.slice(6).map((t) => (
                <button
                  key={t.id}
                  className={`dash-nav-item${tab === t.id ? " active" : ""}`}
                  onClick={() => {
                    setTab(t.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="dni-icon">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="dash-logout"
          >
            <span className="dni-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="dash-header-title">
            {ADMIN_TABS.find((t) => t.id === tab)?.icon}{" "}
            {ADMIN_TABS.find((t) => t.id === tab)?.label}
          </div>
          <Link
            to="/"
            className="btn btn-outline"
            style={{ fontSize: ".82rem", padding: ".5rem 1rem" }}
          >
            ← Home
          </Link>
        </header>
        <div className="dash-content">
          {tab === "overview" && <AdminOverview />}
          {tab === "applications" && <AdminApplications />}
          {tab === "enrollments" && <AdminEnrollments />}
          {tab === "hire" && <AdminHireRequests />}
          {tab === "users" && <AdminUsers />}
          {tab === "courses" && <AdminCourses />}
          {tab === "blog" && <AdminBlog />}
          {tab === "projects" && <AdminProjects />}
          {tab === "admins" && <AdminsTab />}
          {tab === "mentors" && <MentorManagement />}
          {tab === "cohort" && <AdminCohortApplications />}
        </div>
      </main>
    </div>
  );
};

// ── Overview ──────────────────────────────────────────────
const AdminOverview = () => {
  const {
    stats: statsData,
    loading,
    loadStats,
    refreshStats,
    lastUpdated,
  } = useAdmin();


  useEffect(() => {
    if (!statsData) {
      loadStats();
    }
  }, [statsData, loadStats]);

  if (!statsData)
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
      </div>
    );

  const {
    stats,
    monthlyData = [],
    weeklyUsers = [],
    courseData = [],
    recentApplications = [],
    recentEnrollments = []
  } = statsData;
  const statusData = [
  {
    name: "Accepted",
    value: stats.acceptedApplications,
    color: "#27ae60"
  },
  {
    name: "Pending",
    value: stats.pendingApplications,
    color: "#E8AB82"
  },
  {
    name: "Reviewing",
    value: stats.reviewingApplications,
    color: "#2196C9"
  },
  {
    name: "Rejected",
    value: stats.rejectedApplications,
    color: "#dc4545"
  }
];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "10px 14px",
            boxShadow: "var(--sh)",
            fontSize: ".82rem",
          }}
        >
          <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>
            {label}
          </p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, margin: "2px 0" }}>
              {p.name}:{" "}
              <strong>
                {typeof p.value === "number" && p.name === "revenue"
                  ? "Rs." + p.value.toLocaleString("en-IN")
                  : p.value}
              </strong>
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
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.02em", color: "var(--navy)" }}>Analytics Dashboard</h2>
          <p>Real-time platform insights and performance metrics.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {lastUpdated && (
            <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refreshStats}
            disabled={loading}
            className="btn"
            style={{
              fontSize: ".85rem",
              padding: ".5rem 1.1rem",
              backgroundColor: "#e8a820",
              color: "#12233f",
              border: "1px solid #d49516",
              fontWeight: 700,
              borderRadius: "8px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(232, 168, 32, 0.25)"
            }}
          >
            {loading ? "🔄 Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        className="stats-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            icon: "👥",
            num: stats.totalUsers ?? 0,
            label: "Total Students",
            color: "#2196C9",
          },
          {
            icon: "🎓",
            num: stats.totalMentors ?? 0,
            label: "Active Mentors",
            color: "#8e44ad",
          },
          {
            icon: "📝",
            num: stats.totalApplications ?? 0,
            label: "Applications",
            color: "#E8A820",
          },
          {
            icon: "⏳",
            num: stats.pendingApplications ?? 0,
            label: "Pending Review",
            color: "#e67e22",
          },
          {
            icon: "📚",
            num: stats.totalEnrollments ?? 0,
            label: "Total Enrollments",
            color: "#6c3483",
          },
          {
            icon: "💰",
            num: stats.paidEnrollments ?? 0,
            label: "Paid Enrollments",
            color: "#27ae60",
          },
          {
            icon: "⏰",
            num: stats.pendingEnrollments ?? 0,
            label: "Pending Enrollment",
            color: "#dc4545",
          },
          {
            icon: "🏢",
            num: stats.totalHireRequests ?? 0,
            label: "Hire Requests",
            color: "#34495e",
          },
          {
            icon: "💵",
            num: "₹" + Number(
              stats.totalRevenue || 0
            ).toLocaleString("en-IN"),
            label: "Total Revenue",
            color: "#1e8449",
          },
          {
            icon: "📅",
            num: "₹" + Number(
              stats.currentMonthRevenue || 0
            ).toLocaleString("en-IN"),
            label: "Revenue This Month",
            color: "#0f9d58",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{
              borderTop: "3px solid " + s.color,
              overflow: "visible",
              minWidth: "170px"
            }}
          >
            <div className="stat-icon">{s.icon}</div>
            <div
              className="stat-num"
              style={{
                color: s.color,
                fontSize: "1.45rem",
                overflow: "visible",
                textOverflow: "clip",
                whiteSpace: "normal",
                wordBreak: "break-word"
              }}
            >
              {s.num}
            </div>
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
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196C9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2196C9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="enrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8A820" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E8A820" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(27,42,74,0.06)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#5a6a82" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#5a6a82" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="applications"
                stroke="#2196C9"
                strokeWidth={2.5}
                fill="url(#appGrad)"
                name="Applications"
                dot={{ r: 4, fill: "#2196C9" }}
              />
              <Area
                type="monotone"
                dataKey="enrollments"
                stroke="#E8A820"
                strokeWidth={2.5}
                fill="url(#enrGrad)"
                name="Enrollments"
                dot={{ r: 4, fill: "#E8A820" }}
              />
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
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v + " applications", n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {statusData.map((s) => (
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
      <div className="charts-row" style={{ marginTop: "1.5rem" }}>
        <div className="chart-card chart-medium">
          <div className="chart-header">
            <h3>Students per Course</h3>
            <span className="chart-sub">Total enrolled</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={courseData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(27,42,74,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#5a6a82" }}
                axisLine={false}
                tickLine={false}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#5a6a82" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(27,42,74,0.04)" }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="students" name="Students" radius={[6, 6, 0, 0]}>
                {courseData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
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
            <LineChart
              data={monthlyData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#27ae60" />
                  <stop offset="100%" stopColor="#2196C9" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(27,42,74,0.06)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#5a6a82" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#5a6a82" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => "Rs." + (v / 1000).toFixed(0) + "K"}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="revenue"
                stroke="url(#revGrad)"
                strokeWidth={3}
                dot={{ r: 5, fill: "#27ae60", strokeWidth: 2, stroke: "white" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Weekly signups + Recent Activity */}
      <div className="charts-row" style={{ marginTop: "1.5rem" }}>
        <div className="chart-card" style={{ flex: 1 }}>
          <div className="chart-header">
            <h3>New Signups This Week</h3>
            <span className="chart-sub">Daily registrations</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={weeklyUsers}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(27,42,74,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#5a6a82" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#5a6a82" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: "rgba(27,42,74,0.04)" }} />
              <Bar
                dataKey="users"
                name="New Users"
                fill="#1B2A4A"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card" style={{ flex: 1 }}>
          <div className="chart-header">
            <h3>Recent Applications</h3>
            <span className="chart-sub">Latest 5</span>
          </div>
          <div className="recent-list">
            {recentApplications.slice(0, 5).map((a) => (
              <div key={a._id} className="recent-item">
                <div className="ri-left">
                  <div className="ri-avatar">{a.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <strong>{a.name}</strong>
                    <span>
                      {a.interest} · {a.college}
                    </span>
                  </div>
                </div>
                {statusBadge(a.status)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent enrollments */}
      <div
        className="chart-card"
        style={{ marginTop: "1.5rem" }}
      >
        <div className="chart-header">
          <h3>Recent Enrollments</h3>
          <span className="chart-sub">
            Latest students
          </span>
        </div>

        {recentEnrollments.length === 0 ? (
          <div
            style={{
              padding: "1.5rem",
              textAlign: "center",
              color: "var(--muted)"
            }}
          >
            No enrollments yet.
          </div>
        ) : (
          <div className="recent-list">
            {recentEnrollments
              .slice(0, 10)
              .map(enrollment => (
                <div
                  key={enrollment._id}
                  className="recent-item"
                >
                  <div className="ri-left">
                    <div className="ri-avatar">
                      {enrollment.name?.[0]?.toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {enrollment.name}
                      </strong>

                      <span>
                        {enrollment.courseName}
                        {" · "}
                        {enrollment.email}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "right"
                    }}
                  >
                    <strong>
                      {enrollment.paymentStatus ===
                      "paid"
                        ? "Paid"
                        : enrollment.paymentStatus ===
                          "pending"
                        ? "Pending"
                        : enrollment.paymentStatus
                            ?.replace("_", " ")
                            .toUpperCase()}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        fontSize: ".72rem",
                        color: "var(--muted)"
                      }}
                    >
                      {new Date(
                        enrollment.createdAt
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Applications ──────────────────────────────────────────
const AdminApplications = () => {
  const { triggerGlobalUpdate } = useAdmin();
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await getAdminApplications({
        search,
        status: statusFilter,
        page,
        limit: 15,
      });
      setApps(r.data.data);
      setTotal(r.data.total);
      setPages(r.data.pages);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [search, statusFilter, page]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateApplicationStatus(id, { status });
      toast.success("Status updated");
      load();
      triggerGlobalUpdate(); // Trigger real-time update across tabs
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="admin-filters">
        <input
          className="admin-search"
          placeholder="Search name, email, college..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="admin-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          {["all", "pending", "reviewing", "accepted", "rejected"].map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-meta">
        Total: <strong>{total}</strong>
      </div>
      {loading ? (
        <div className="dash-loading">
          <div className="dash-spinner" />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Interest</th>
                <th>Duration</th>
                <th>College</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a._id}>
                  <td>
                    <strong>{a.name}</strong>
                  </td>
                  <td>
                    <a href={`mailto:${a.email}`} className="email-link">
                      {a.email}
                    </a>
                  </td>
                  <td>{a.interest}</td>
                  <td>{a.duration === "3months" ? "3M" : "6M"}</td>
                  <td>{a.college}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>{statusBadge(a.status)}</td>
                  <td>
                    <select
                      className="status-select"
                      value={a.status}
                      disabled={updating === a._id}
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                    >
                      {["pending", "reviewing", "accepted", "rejected"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ),
                      )}
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
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn btn-outline"
            style={{ fontSize: ".8rem", padding: ".4rem .9rem" }}
          >
            Prev
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="btn btn-outline"
            style={{ fontSize: ".8rem", padding: ".4rem .9rem" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// ── Cohort Applications ─────────────────────────────────────
const AdminCohortApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);

    try {
      const r = await getAdminCohortApplications();

      setApplications(r.data?.data || []);
    } catch (err) {
      console.error("Cohort applications error:", err);
      toast.error(
        err.response?.data?.message ||
        "Failed to load cohort applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);

    try {
      await updateCohortStatus(id, status);

      toast.success("Cohort status updated");

      await load();
    } catch (err) {
      console.error("Update cohort status error:", err);

      toast.error(
        err.response?.data?.message ||
        "Failed to update status"
      );
    } finally {
      setUpdating(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      !search ||
      app.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.college?.toLowerCase().includes(search.toLowerCase()) ||
      app.domain?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="overview-welcome">
        <div>
          <h2>Cohort Applications</h2>
          <p>
            Manage and review student cohort applications.
          </p>
        </div>

        <button
          onClick={load}
          className="btn"
          disabled={loading}
          style={{
            backgroundColor: "#e8a820",
            color: "#12233f",
            border: "1px solid #d49516",
            fontWeight: 700,
            borderRadius: "8px",
            padding: ".55rem 1rem",
            cursor: "pointer",
          }}
        >
          {loading ? "🔄 Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div
        className="admin-filters"
        style={{
          marginBottom: "1rem",
        }}
      >
        <input
          className="admin-search"
          placeholder="Search name, email, college, domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="admin-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Count */}
      <div className="admin-meta">
        Total Applications:{" "}
        <strong>{filteredApplications.length}</strong>
      </div>

      {/* Table */}
      {loading ? (
        <div className="dash-loading">
          <div className="dash-spinner" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div
          className="chart-card"
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--muted)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>
            📋
          </div>

          <strong>No cohort applications found</strong>

          <p style={{ marginTop: ".4rem" }}>
            New cohort applications will appear here.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Phone</th>
                <th>College</th>
                <th>Domain</th>
                <th>Day</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Change</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app._id}>
                  {/* Student */}
                  <td>
                    <strong>{app.name || "—"}</strong>
                  </td>

                  {/* Email */}
                  <td>
                    {app.email ? (
                      <a
                        href={`mailto:${app.email}`}
                        className="email-link"
                      >
                        {app.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Phone */}
                  <td>{app.phone || "—"}</td>

                  {/* College */}
                  <td>{app.college || "—"}</td>

                  {/* Domain */}
                  <td>{app.domain || "—"}</td>

                  {/* Day */}
                  <td>{app.day || "—"}</td>

                  {/* Applied */}
                  <td>
                    {app.createdAt
                      ? new Date(
                          app.createdAt
                        ).toLocaleDateString("en-IN")
                      : "—"}
                  </td>

                  {/* Status */}
                  <td>
                    {statusBadge(app.status || "pending")}
                  </td>

                  {/* Change */}
                  <td>
                    <select
                      className="status-select"
                      value={app.status || "pending"}
                      disabled={updating === app._id}
                      onChange={(e) =>
                        updateStatus(
                          app._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="confirmed">
                        Confirmed
                      </option>

                      <option value="rejected">
                        Rejected
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Enrollments ───────────────────────────────────────────
const AdminEnrollments = () => {
  const [enrolls, setEnrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [summary, setSummary] = useState({
    fullPaid: 0,
    emi1: 0,
    emi2: 0,
    emi3: 0,
    pending: 0,
  });
  const [selected, setSelected] = useState(null);

  const load = (f = filter) => {
    setLoading(true);
    const params = f !== "all" ? `?filter=${f}` : "";
    API.get(`/admin/payment-details${params}`)
      .then((r) => {
        setEnrolls(r.data.data);
        setSummary(r.data.summary);
      })
      .catch(() => {
        // fallback to old endpoint
        getAdminEnrollments({ search }).then((r) => setEnrolls(r.data.data));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter, search]);

  const filtered = enrolls.filter(
    (e) =>
      !search ||
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.courseName?.toLowerCase().includes(search.toLowerCase()),
  );

  const exportCSV = () => {
    const rows = [
      [
        "Name",
        "Email",
        "Phone",
        "College",
        "Course",
        "Price",
        "Payment Type",
        "Status",
        "Paid On",
      ],
    ];
    filtered.forEach((e) =>
      rows.push([
        e.name,
        e.email,
        e.phone,
        e.college,
        e.courseName,
        e.finalPrice || e.coursePrice,
        e.paymentType || "full",
        e.paymentStatus,
        new Date(e.createdAt).toLocaleDateString("en-IN"),
      ]),
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${filter}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("CSV exported!");
  };

  const FILTERS = [
    {
      key: "all",
      label: "Total Enrollments",
      color: "#1B2A4A",
      count:
        summary.total ?? (
          summary.fullPaid +
          summary.emi1 +
          summary.emi2 +
          summary.emi3 +
          summary.pending +
          (summary.failed || 0)
        ),
    },
    {
      key: "paid",
      label: "Total Paid 💰",
      color: "#27ae60",
      count: summary.totalPaid ?? (summary.fullPaid + summary.emi1 + summary.emi2 + summary.emi3),
    },
    {
      key: "full",
      label: "Full Paid ✅",
      color: "#1e8449",
      count: summary.fullPaid,
    },
    {
      key: "emi_1",
      label: "EMI 1/3 Paid",
      color: "#2196C9",
      count: summary.emi1,
    },
    {
      key: "emi_2",
      label: "EMI 2/3 Paid",
      color: "#6c3483",
      count: summary.emi2,
    },
    {
      key: "emi_3",
      label: "EMI 3/3 Paid",
      color: "#E8A820",
      count: summary.emi3,
    },
    {
      key: "pending",
      label: "Pending Enrollments ⚠️",
      color: "#dc4545",
      count: summary.pending,
    },
  ];

  const payBadge = (status, type) => {
    const map = {
      paid: { label: "Full Paid", bg: "rgba(39,174,96,.1)", color: "#27ae60" },
      emi_1: { label: "EMI 1/3", bg: "rgba(33,150,201,.1)", color: "#2196C9" },
      emi_2: { label: "EMI 2/3", bg: "rgba(108,52,131,.1)", color: "#6c3483" },
      emi_3: { label: "EMI 3/3", bg: "rgba(232,168,32,.1)", color: "#E8A820" },
      pending: { label: "Pending", bg: "rgba(220,69,69,.1)", color: "#dc4545" },
      failed: { label: "Failed", bg: "rgba(220,69,69,.1)", color: "#dc4545" },
    };
    const s = map[status] || { label: status, bg: "#f5f5f5", color: "#666" };
    return (
      <span
        style={{
          background: s.bg,
          color: s.color,
          padding: ".2rem .65rem",
          borderRadius: "50px",
          fontSize: ".72rem",
          fontWeight: 700,
        }}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div>
      {/* Summary filter cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
          gap: ".75rem",
          marginBottom: "1.5rem",
        }}
      >
        {FILTERS.map((f) => (
          <div
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              background: filter === f.key ? f.color : "white",
              color: filter === f.key ? "white" : f.color,
              border: `2px solid ${f.color}`,
              borderRadius: 12,
              padding: ".85rem 1rem",
              cursor: "pointer",
              transition: "all .2s",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                fontFamily: "'Playfair Display',serif",
              }}
            >
              {f.count}
            </div>
            <div style={{ fontSize: ".72rem", fontWeight: 600, marginTop: 2 }}>
              {f.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: ".75rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          className="admin-search"
          placeholder="Search name, email, course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <button
          onClick={exportCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".4rem",
            background: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: ".55rem 1rem",
            fontWeight: 700,
            fontSize: ".82rem",
            cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="dash-loading">
          <div className="dash-spinner" />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Coupon</th>
                <th>Enrolled On</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e._id}>
                  <td>
                    <strong>{e.name}</strong>
                    <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>
                      {e.email}
                    </div>
                    <div style={{ fontSize: ".72rem", color: "var(--muted)" }}>
                      {e.phone}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{e.courseName}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--muted)" }}>
                      {e.college}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--navy)" }}>
                      ₹
                      {Number(
                        e.finalPrice ||
                        e.coursePrice ||
                        0
                      ).toLocaleString("en-IN")}
                    </div>

                    <div
                      style={{
                        fontSize: ".72rem",
                        color:
                          Number(e.amountPaid || 0) > 0
                            ? "#27ae60"
                            : "var(--muted)"
                      }}
                    >
                      Paid: ₹
                      {Number(
                        e.amountPaid || 0
                      ).toLocaleString("en-IN")}
                    </div>

                    {Number(
                      e.finalPrice ||
                      e.coursePrice ||
                      0
                    ) -
                      Number(e.amountPaid || 0) >
                      0 && (
                      <div
                        style={{
                          fontSize: ".7rem",
                          color: "#dc4545"
                        }}
                      >
                        Due: ₹
                        {Math.max(
                          0,
                          Number(
                            e.finalPrice ||
                            e.coursePrice ||
                            0
                          ) -
                            Number(
                              e.amountPaid || 0
                            )
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    )}

                    {e.discountAmount > 0 && (
                      <div
                        style={{
                          fontSize: ".7rem",
                          color: "#27ae60"
                        }}
                      >
                        Saved ₹
                        {Number(
                          e.discountAmount
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: ".75rem",
                        fontWeight: 600,
                        color: e.paymentType === "emi" ? "#2196C9" : "#27ae60",
                      }}
                    >
                      {e.paymentType === "emi" ? "3-Part EMI" : "Full Payment"}
                    </span>
                  </td>
                  <td>{payBadge(e.paymentStatus, e.paymentType)}</td>
                  <td>
                    {e.couponApplied ? (
                      <span
                        style={{
                          background: "rgba(232,168,32,.1)",
                          color: "#E8A820",
                          padding: ".15rem .5rem",
                          borderRadius: "50px",
                          fontSize: ".7rem",
                          fontWeight: 700,
                        }}
                      >
                        {e.couponCode} 10%
                      </span>
                    ) : (
                      <span
                        style={{ color: "var(--muted)", fontSize: ".75rem" }}
                      >
                        —
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: ".8rem" }}>
                    {new Date(e.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelected(e)}
                      style={{
                        background: "var(--navy)",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: ".35rem .7rem",
                        fontSize: ".75rem",
                        cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="modal-box" style={{ maxWidth: 500 }}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              ×
            </button>
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                color: "var(--navy)",
                marginBottom: "1.25rem",
              }}
            >
              Payment Details — {selected.name}
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".75rem",
              }}
            >
              {[
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["College", selected.college],
                ["Course", selected.courseName],
                [
                  "Original Price",
                  `₹${selected.originalPrice?.toLocaleString("en-IN") || selected.coursePrice?.toLocaleString("en-IN")}`,
                ],
                [
                  "Coupon",
                  selected.couponApplied
                    ? `${selected.couponCode} (10% off — saved ₹${selected.discountAmount?.toLocaleString("en-IN")})`
                    : "None",
                ],
                [
                  "Final Price",
                  `₹${(selected.finalPrice || selected.coursePrice)?.toLocaleString("en-IN")}`,
                ],
                [
                  "Payment Type",
                  selected.paymentType === "emi"
                    ? "3-Part EMI"
                    : "Full Payment",
                ],
                ["Status", selected.paymentStatus],
                [
                  "Enrolled On",
                  new Date(selected.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                ],
              ].map(([label, val], i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--cream)",
                    borderRadius: 10,
                    padding: ".75rem 1rem",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: ".68rem",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      marginBottom: ".1rem",
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--navy)" }}>
                    {val}
                  </div>
                </div>
              ))}
              {selected.paymentType === "emi" &&
                selected.emiInstallments?.length > 0 && (
                  <div
                    style={{
                      background: "var(--cream)",
                      borderRadius: 10,
                      padding: ".75rem 1rem",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: ".68rem",
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                        marginBottom: ".5rem",
                      }}
                    >
                      EMI Installments
                    </div>
                    {selected.emiInstallments.map((inst, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: ".35rem 0",
                          borderBottom: "1px solid var(--border)",
                          fontSize: ".82rem",
                        }}
                      >
                        <span>Installment {inst.installment}</span>
                        <span style={{ fontWeight: 700 }}>
                          ₹{inst.amount?.toLocaleString("en-IN")}
                        </span>
                        <span style={{ color: "#27ae60", fontSize: ".72rem" }}>
                          {inst.paidAt
                            ? new Date(inst.paidAt).toLocaleDateString("en-IN")
                            : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Hire Requests ─────────────────────────────────────────
const AdminHireRequests = () => {
  const { triggerGlobalUpdate } = useAdmin();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const load = () => {
    setLoading(true);
    getAdminHireRequests()
      .then((r) => setRequests(r.data.data))
      .catch(() => toast.error("Failed"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const update = async (id, status) => {
    try {
      await updateHireRequest(id, { status });
      toast.success("Updated!");
      load();
      triggerGlobalUpdate(); // Trigger real-time update
    } catch {
      toast.error("Failed");
    }
  };
  return (
    <div>
      {loading ? (
        <div className="dash-loading">
          <div className="dash-spinner" />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Name</th>
                <th>Email</th>
                <th>Services</th>
                <th>Budget</th>
                <th>Date</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td>
                    <strong>{r.company}</strong>
                  </td>
                  <td>{r.name}</td>
                  <td>
                    <a href={`mailto:${r.email}`} className="email-link">
                      {r.email}
                    </a>
                  </td>
                  <td style={{ fontSize: ".75rem", maxWidth: "140px" }}>
                    {r.services?.join(", ")}
                  </td>
                  <td style={{ fontSize: ".78rem" }}>{r.budget}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>
                    <select
                      className="status-select"
                      value={r.status}
                      onChange={(e) => update(r._id, e.target.value)}
                    >
                      {["new", "contacted", "in_progress", "closed"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ),
                      )}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline"
                      style={{ fontSize: ".75rem", padding: ".35rem .75rem" }}
                      onClick={() => setSelected(r)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              ×
            </button>
            <h3>Project Inquiry</h3>
            <div className="hire-detail">
              <p>
                <strong>Company:</strong> {selected.company}
              </p>
              <p>
                <strong>Contact:</strong> {selected.name} · {selected.email} ·{" "}
                {selected.phone}
              </p>
              <p>
                <strong>Services:</strong> {selected.services?.join(", ")}
              </p>
              <p>
                <strong>Budget:</strong> {selected.budget}
              </p>
              <p>
                <strong>Description:</strong>
              </p>
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
  const { triggerGlobalUpdate } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const load = () => {
    setLoading(true);
    const actualLimit = viewAll ? 1000 : limit; // View All shows up to 1000 users
    getAdminUsers({ search, limit: actualLimit, page: viewAll ? 1 : page })
      .then((r) => {
        setUsers(r.data.data);
        setTotal(r.data.total);
        setPages(Math.ceil(r.data.total / actualLimit));
      })
      .catch(() => toast.error("Failed"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, [search, limit, page, viewAll]);

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setActionLoading(id + "-delete");
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      load();
      triggerGlobalUpdate(); // Trigger real-time update
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleBlock = async (id, isBlocked) => {
    setActionLoading(id + "-block");
    try {
      await API.patch(`/admin/users/${id}/block`);
      toast.success(isBlocked ? "Unblocked" : "Blocked");
      load();
      triggerGlobalUpdate(); // Trigger real-time update
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await API.patch(`/admin/users/${id}/role`, { role });
      toast.success(`Role updated`);
      load();
      triggerGlobalUpdate(); // Trigger real-time update
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleResetPassword = async () => {
    if (!newPass || newPass.length < 6) {
      toast.error("Min. 6 characters");
      return;
    }
    try {
      await API.patch(`/admin/users/${resetModal._id}/reset-password`, {
        password: newPass,
      });
      toast.success("Password reset!");
      setResetModal(null);
      setNewPass("");
      triggerGlobalUpdate(); // Trigger real-time update
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      <div className="admin-filters">
        <input
          className="admin-search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <span
            className="admin-meta"
            style={{ fontSize: ".88rem", color: "#5a6a82" }}
          >
            Total:{" "}
            <strong style={{ color: "#1B2A4A", fontSize: ".95rem" }}>
              {total}
            </strong>
          </span>
          {!viewAll && total > limit && (
            <button
              style={{
                fontSize: ".8rem",
                padding: ".45rem 1rem",
                whiteSpace: "nowrap",
                background: "#E8A820",
                color: "#1B2A4A",
                border: "none",
                borderRadius: "6px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all .2s",
                fontFamily: "DM Sans, sans-serif",
                lineHeight: "1",
                display: "inline-flex",
                alignItems: "center",
                height: "32px",
              }}
              onClick={() => {
                setViewAll(true);
                setPage(1);
              }}
            >
              View All
            </button>
          )}
          {viewAll && (
            <button
              style={{
                fontSize: ".8rem",
                padding: ".45rem 1rem",
                whiteSpace: "nowrap",
                background: "white",
                color: "#2196C9",
                border: "1.5px solid #2196C9",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all .2s",
                fontFamily: "DM Sans, sans-serif",
                lineHeight: "1",
                display: "inline-flex",
                alignItems: "center",
                height: "32px",
              }}
              onClick={() => {
                setViewAll(false);
                setPage(1);
              }}
            >
              Show Less
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="dash-loading">
          <div className="dash-spinner" />
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Auth</th>
                  <th>Verified</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong>{u.name}</strong>
                    </td>
                    <td>
                      <a href={`mailto:${u.email}`} className="email-link">
                        {u.email}
                      </a>
                    </td>
                    <td>{u.college || "—"}</td>
                    <td>
                      <span
                        className="badge-status badge-enrolled"
                        style={{ textTransform: "capitalize" }}
                      >
                        {u.authProvider}
                      </span>
                    </td>
                    <td>
                      {u.isVerified ? (
                        <span className="badge-status badge-accepted">Yes</span>
                      ) : (
                        <span className="badge-status badge-rejected">No</span>
                      )}
                    </td>
                    <td>
                      {u.isBlocked ? (
                        <span className="badge-status badge-rejected">
                          Blocked
                        </span>
                      ) : (
                        <span className="badge-status badge-accepted">
                          Active
                        </span>
                      )}
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={u.role}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <div className="user-actions">
                        <button
                          className={`ua-btn ${u.isBlocked ? "ua-btn-green" : "ua-btn-orange"}`}
                          disabled={actionLoading === u._id + "-block"}
                          onClick={() => toggleBlock(u._id, u.isBlocked)}
                        >
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          className="ua-btn ua-btn-blue"
                          onClick={() => {
                            setResetModal(u);
                            setNewPass("");
                          }}
                        >
                          Reset
                        </button>
                        <button
                          className="ua-btn"
                          style={{
                            background: "#e8f4fd",
                            color: "#1B2A4A",
                            border: "1px solid #bae6fd",
                          }}
                          onClick={() => setViewUser(u)}
                        >
                          View
                        </button>
                        <button
                          className="ua-btn ua-btn-red"
                          disabled={actionLoading === u._id + "-delete"}
                          onClick={() => deleteUser(u._id, u.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!viewAll && pages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn btn-outline"
                style={{ fontSize: ".8rem", padding: ".4rem .9rem" }}
              >
                Prev
              </button>
              <span>
                Page {page} of {pages}
              </span>
              <select
                className="admin-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  fontSize: ".8rem",
                  padding: ".4rem .6rem",
                  marginLeft: ".5rem",
                  marginRight: ".5rem",
                }}
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
              <button
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-outline"
                style={{ fontSize: ".8rem", padding: ".4rem .9rem" }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      {viewUser && (
        <UserDetailModal user={viewUser} onClose={() => setViewUser(null)} />
      )}
      {resetModal && (
        <div className="modal-overlay" onClick={() => setResetModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setResetModal(null)}>
              ×
            </button>
            <h3>Reset Password</h3>
            <p
              style={{
                color: "var(--muted)",
                marginBottom: "1.25rem",
                fontSize: ".9rem",
              }}
            >
              For <strong>{resetModal.name}</strong> ({resetModal.email})
            </p>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                autoFocus
              />
            </div>
            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: "1rem" }}
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Courses Management ────────────────────────────────────
const DEFAULT_COURSE_FORM = {
  icon: "mdi:web",
  title: "",
  tagline: "",
  desc: "",
  price: "",
  duration: "",
  level: "beginner",
  language: "English + Hindi",
  about: "",
  tools: "",
  category: "beginner",
  colors: null,
};

const COLOR_PRESETS = [
  { h1: "#e76f51", h2: "#f4a261", label: "Orange" },
  { h1: "#2a9d8f", h2: "#264653", label: "Teal" },
  { h1: "#6c3483", h2: "#a569bd", label: "Purple" },
  { h1: "#1a6b8a", h2: "#2196f3", label: "Blue" },
  { h1: "#c0392b", h2: "#e74c3c", label: "Red" },
  { h1: "#e67e22", h2: "#f39c12", label: "Amber" },
  { h1: "#1e8449", h2: "#27ae60", label: "Green" },
  { h1: "#2c3e50", h2: "#3498db", label: "Navy" },
];

const COURSE_ICONS = [
  // Development
  { label: "Web Development", icon: "mdi:web" },
  { label: "Frontend Development", icon: "mdi:monitor-dashboard" },
  { label: "Backend Development", icon: "mdi:server" },
  { label: "Full Stack Development", icon: "mdi:layers-triple" },
  { label: "Mobile App Development", icon: "mdi:cellphone" },
  { label: "Software Engineering", icon: "mdi:code-braces" },

  // AI & Data
  { label: "Artificial Intelligence", icon: "mdi:robot-outline" },
  { label: "Machine Learning", icon: "mdi:brain" },
  { label: "Data Science", icon: "mdi:chart-bar" },
  { label: "Data Analytics", icon: "mdi:chart-line" },
  { label: "Business Analytics", icon: "mdi:trending-up" },

  // Cloud & DevOps
  { label: "Cloud Computing", icon: "mdi:cloud-outline" },
  { label: "DevOps", icon: "mdi:cog-transfer-outline" },
  { label: "Cyber Security", icon: "mdi:shield-lock-outline" },
  { label: "Networking", icon: "mdi:lan" },

  // Design & Creative
  { label: "UI/UX Design", icon: "mdi:palette-outline" },
  { label: "Graphic Design", icon: "mdi:image-outline" },
  { label: "Video Editing", icon: "mdi:video-outline" },
  { label: "Animation", icon: "mdi:movie-open-outline" },
  { label: "Content Creation", icon: "mdi:camera-outline" },

  // Marketing & Business
  { label: "Digital Marketing", icon: "mdi:bullhorn-outline" },
  { label: "SEO", icon: "mdi:magnify" },
  { label: "Sales", icon: "mdi:cash-multiple" },
  { label: "Finance", icon: "mdi:currency-inr" },
  { label: "Business Management", icon: "mdi:briefcase-outline" },

  // Engineering
  { label: "Mechanical Engineering", icon: "mdi:cog-outline" },
  { label: "Electrical Engineering", icon: "mdi:flash-outline" },
  { label: "Civil Engineering", icon: "mdi:home-city-outline" },
  { label: "Automobile Engineering", icon: "mdi:car-outline" },

  // Emerging Tech
  { label: "Blockchain", icon: "mdi:link-variant" },
  { label: "Web3", icon: "mdi:hexagon-multiple-outline" },
  { label: "Internet of Things", icon: "mdi:access-point-network" },
  { label: "AR / VR", icon: "mdi:virtual-reality" },

  // General
  { label: "Research", icon: "mdi:book-search-outline" },
  { label: "Project Management", icon: "mdi:clipboard-check-outline" },
  { label: "Entrepreneurship", icon: "mdi:rocket-launch-outline" },
  { label: "Communication Skills", icon: "mdi:account-voice" },
  { label: "Leadership", icon: "mdi:account-tie" },

  // Default
  { label: "General Course", icon: "mdi:school-outline" },
];
const AdminCourses = () => {
  const { courses, addCourse, updateCourse, deleteCourse, toggleStatus } =
    useCourses();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_COURSE_FORM);
  const [selectedColor, setSelectedColor] = useState(0);
  const [filter, setFilter] = useState("all");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseData = {
      ...form,
      icon: form.icon,
      colors: COLOR_PRESETS[selectedColor],
    };
    if (editing) {
      updateCourse(editing.id, courseData);
      toast.success("Course updated!");
    } else {
      addCourse(courseData);
      toast.success("Course added! It is now live on the home page.");
    }
    setShowModal(false);
    setEditing(null);
    setForm(DEFAULT_COURSE_FORM);
    setSelectedColor(0);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      icon: c.icon,
      title: c.title,
      tagline: c.tagline || "",
      desc: c.desc || c.tagline || "",
      price: c.price,
      duration: c.duration,
      level: c.level,
      language: c.language || "English + Hindi",
      about: c.about || "",
      tools: Array.isArray(c.tools) ? c.tools.join(", ") : c.tools || "",
      category: c.category || c.level,
      colors: c.colors,
    });
    const idx = COLOR_PRESETS.findIndex((cp) => cp.h1 === c.colors?.h1);
    setSelectedColor(idx >= 0 ? idx : 0);
    setShowModal(true);
  };

  const filtered =
    filter === "all" ? courses : courses.filter((c) => c.status === filter);

  return (
    <div>
      <div className="tab-header">
        <div>
          <h2>Courses Management</h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".85rem",
              marginTop: ".25rem",
            }}
          >
            {courses.filter((c) => c.status === "active").length} active ·{" "}
            {courses.filter((c) => c.status === "inactive").length} inactive ·
            Changes reflect on home page instantly
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setForm(DEFAULT_COURSE_FORM);
            setSelectedColor(0);
            setShowModal(true);
          }}
        >
          + Add Course
        </button>
      </div>

      <div className="admin-filters" style={{ marginBottom: "1.25rem" }}>
        {["all", "active", "inactive"].map((f) => (
          <button
            key={f}
            style={{
              borderRadius: "50px",
              padding: ".4rem 1rem",
              fontSize: ".82rem",
              border: "1.5px solid var(--border)",
              cursor: "pointer",
              background: filter === f ? "var(--navy)" : "white",
              color: filter === f ? "var(--gold)" : "var(--muted)",
              fontFamily: "DM Sans,sans-serif",
              fontWeight: 600,
              transition: "all .2s",
              marginRight: ".4rem",
            }}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} (
            {f === "all"
              ? courses.length
              : courses.filter((c) => c.status === f).length}
            )
          </button>
        ))}
      </div>

      <div className="admin-courses-grid">
        {filtered.map((c) => (
          <div
            key={c.id}
            className={`admin-course-card${c.status === "inactive" ? " inactive" : ""}`}
          >
            <div
              className="acc-card-header"
              style={{
                background: `linear-gradient(135deg,${c.colors?.h1 || "#e76f51"},${c.colors?.h2 || "#f4a261"})`,
              }}
            >
              <div className="acc-card-emoji">
                <Icon icon={c.icon || "mdi:school-outline"} />
              </div>
              <span className="acc-card-badge">
                {c.level?.charAt(0).toUpperCase() + c.level?.slice(1)}
              </span>
              {c.status === "inactive" && (
                <span className="acc-inactive-badge">Inactive</span>
              )}
            </div>
            <div className="acc-card-body">
              <h4>{c.title}</h4>
              <p>{c.desc || c.tagline || c.about || "No description"}</p>
              <div className="acc-card-meta">
                <span>⏱ {c.duration}</span>
                <span>
                  📊 {c.level?.charAt(0).toUpperCase() + c.level?.slice(1)}
                </span>
              </div>
              <div className="acc-card-tools">
                {(Array.isArray(c.tools) ? c.tools : (c.tools || "").split(","))
                  .slice(0, 4)
                  .filter(Boolean)
                  .map((t) => (
                    <span key={t} className="acc-tool">
                      {t.trim()}
                    </span>
                  ))}
              </div>
              <div className="acc-card-footer">
                <div className="acc-card-price">
                  <small>Starting at</small>
                  <strong>₹{Number(c.price).toLocaleString("en-IN")}</strong>
                </div>
                <div className="acc-actions-row">
                  <button
                    className="ua-btn ua-btn-blue"
                    onClick={() => openEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    className={`ua-btn ${c.status === "active" ? "ua-btn-orange" : "ua-btn-green"}`}
                    onClick={() => {
                      toggleStatus(c.id);
                      toast.success(
                        c.status === "active"
                          ? "Course deactivated"
                          : "Course activated!",
                      );
                    }}
                  >
                    {c.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className="ua-btn ua-btn-red"
                    onClick={() => {
                      if (window.confirm("Delete this course?")) {
                        deleteCourse(c.id);
                        toast.success("Deleted");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            className="modal-box"
            style={{ maxWidth: "580px", maxHeight: "88vh", overflowY: "auto" }}
          >
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h3>{editing ? "Edit Course" : "Add New Course"}</h3>

            <div className="course-preview">
              <div className="cp-label">Live Preview</div>
              <div className="cp-card">
                <div
                  className="cp-header"
                  style={{
                    background: `linear-gradient(135deg,${COLOR_PRESETS[selectedColor].h1},${COLOR_PRESETS[selectedColor].h2})`,
                  }}
                >
                  <Icon
                    icon={form.icon || "mdi:school-outline"}
                    width={34}
                    height={34}
                  />
                  <span className="cc-badge">
                    {form.level?.charAt(0).toUpperCase() +
                      form.level?.slice(1) || "Beginner"}
                  </span>
                </div>
                <div className="cp-body">
                  <strong>{form.title || "Course Title"}</strong>
                  <p>{form.desc || form.tagline || "Course description..."}</p>
                  <div className="cp-price">
                    ₹
                    {form.price
                      ? Number(form.price).toLocaleString("en-IN")
                      : "0"}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "1.25rem" }}>
              <div className="form-group">
                <label>Card Color Theme *</label>
                <div className="color-picker">
                  {COLOR_PRESETS.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`color-swatch${selectedColor === i ? " selected" : ""}`}
                      style={{
                        background: `linear-gradient(135deg,${c.h1},${c.h2})`,
                      }}
                      onClick={() => setSelectedColor(i)}
                      title={c.label}
                    >
                      {selectedColor === i && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Course Icon *</label>

                  <select
                    value={form.icon}
                    onChange={(e) => set("icon", e.target.value)}
                    required
                  >
                    {COURSE_ICONS.map((item) => (
                      <option key={item.icon} value={item.icon}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Level *</label>
                  <select
                    value={form.level}
                    onChange={(e) => set("level", e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Course Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Full Stack Web Development"
                  required
                />
              </div>

              <div className="form-group">
                <label>Short Description *</label>
                <textarea
                  rows="2"
                  value={form.desc}
                  onChange={(e) => set("desc", e.target.value)}
                  placeholder="Shown on course card..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="4999"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration *</label>
                  <input
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    placeholder="e.g. 12 Weeks"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tools (comma separated) *</label>
                <input
                  value={form.tools}
                  onChange={(e) => set("tools", e.target.value)}
                  placeholder="React, Node.js, MongoDB, Git"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Language</label>
                  <input
                    value={form.language}
                    onChange={(e) => set("language", e.target.value)}
                    placeholder="English + Hindi"
                  />
                </div>
                <div className="form-group">
                  <label>Tagline</label>
                  <input
                    value={form.tagline}
                    onChange={(e) => set("tagline", e.target.value)}
                    placeholder="One-line course tagline"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Full Description</label>
                <textarea
                  rows="3"
                  value={form.about}
                  onChange={(e) => set("about", e.target.value)}
                  placeholder="Detailed course description for course detail page..."
                />
              </div>

              <div
                style={{ display: "flex", gap: ".75rem", marginTop: "1rem" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {editing ? "✓ Update Course" : "+ Add Course to Platform"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
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
  title: "",
  client: "",
  category: "Web Development",
  tech: "",
  status: "ongoing",
  description: "",
  teamSize: "",
  duration: "",
  completedDate: "",
  liveUrl: "",
};

const AdminProjects = () => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("admin_projects");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "E-Commerce Platform",
            client: "RetailEdge Solutions",
            category: "Web Development",
            tech: "React, Node.js, MongoDB",
            status: "completed",
            description: "Full e-commerce platform with payment integration.",
            teamSize: "4",
            duration: "8 weeks",
            liveUrl: "",
            completedDate: "2024-01-15",
          },
          {
            id: 2,
            title: "AI Customer Support Bot",
            client: "TechCorp India",
            category: "AI & Automation",
            tech: "Python, OpenAI, LangChain",
            status: "ongoing",
            description: "AI-powered customer support chatbot.",
            teamSize: "3",
            duration: "6 weeks",
            liveUrl: "",
            completedDate: "",
          },
          {
            id: 3,
            title: "Mobile Delivery App",
            client: "QuickDeliver",
            category: "App Development",
            tech: "Flutter, Firebase",
            status: "completed",
            description: "Cross-platform food delivery app.",
            teamSize: "5",
            duration: "10 weeks",
            liveUrl: "",
            completedDate: "2024-02-20",
          },
        ];
  });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_PROJECT);
  const [filter, setFilter] = useState("all");

  const save = (data) => {
    localStorage.setItem("admin_projects", JSON.stringify(data));
    setProjects(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      save(projects.map((p) => (p.id === editing.id ? { ...p, ...form } : p)));
      toast.success("Project updated!");
    } else {
      save([...projects, { ...form, id: Date.now() }]);
      toast.success("Project added!");
    }
    setShowModal(false);
    setEditing(null);
    setForm(DEFAULT_PROJECT);
  };

  const deleteProject = (id) => {
    if (!window.confirm("Delete this project?")) return;
    save(projects.filter((p) => p.id !== id));
    toast.success("Project deleted");
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p });
    setShowModal(true);
  };

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const STATUS_COLORS = {
    completed: "#27ae60",
    ongoing: "#2196C9",
    paused: "#e67e22",
    cancelled: "#dc4545",
  };

  return (
    <div>
      <div className="tab-header">
        <h2>Projects Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setForm(DEFAULT_PROJECT);
            setShowModal(true);
          }}
        >
          + Add Project
        </button>
      </div>

      <div className="admin-filters" style={{ marginBottom: "1.25rem" }}>
        {["all", "ongoing", "completed", "paused", "cancelled"].map((f) => (
          <button
            key={f}
            className={`cf-btn${filter === f ? " active" : ""}`}
            style={{
              borderRadius: "50px",
              padding: ".4rem 1rem",
              fontSize: ".82rem",
              border: "1.5px solid var(--border)",
              cursor: "pointer",
              background: filter === f ? "var(--navy)" : "white",
              color: filter === f ? "var(--gold)" : "var(--muted)",
              fontFamily: "DM Sans,sans-serif",
              fontWeight: 600,
              transition: "all .2s",
            }}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} (
            {f === "all"
              ? projects.length
              : projects.filter((p) => p.status === f).length}
            )
          </button>
        ))}
      </div>

      <div className="admin-projects-grid">
        {filtered.map((p) => (
          <div key={p.id} className="admin-project-card">
            <div className="apc-top">
              <div className="apc-info">
                <h4>{p.title}</h4>
                <span className="apc-client">{p.client}</span>
              </div>
              <span
                className="apc-status"
                style={{
                  background: STATUS_COLORS[p.status] + "22",
                  color: STATUS_COLORS[p.status],
                  border: `1px solid ${STATUS_COLORS[p.status]}44`,
                }}
              >
                {p.status}
              </span>
            </div>
            <div className="apc-meta">
              <span className="apc-cat">{p.category}</span>
              <span>Team: {p.teamSize || "—"}</span>
              <span>{p.duration || "—"}</span>
            </div>
            <p className="apc-desc">{p.description}</p>
            <div className="apc-tech">
              {p.tech.split(",").map((t) => (
                <span key={t} className="cd-tool-tag">
                  {t.trim()}
                </span>
              ))}
            </div>
            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="apc-link"
              >
                View Live
              </a>
            )}
            <div className="acc-actions" style={{ marginTop: ".85rem" }}>
              <button
                className="ua-btn ua-btn-blue"
                onClick={() => openEdit(p)}
              >
                Edit
              </button>
              <button
                className="ua-btn ua-btn-red"
                onClick={() => deleteProject(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            className="modal-box"
            style={{ maxWidth: "560px", maxHeight: "85vh", overflowY: "auto" }}
          >
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h3>{editing ? "Edit Project" : "Add New Project"}</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: "1.25rem" }}>
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. E-Commerce Platform"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Client Name *</label>
                  <input
                    value={form.client}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, client: e.target.value }))
                    }
                    placeholder="Client company name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                  >
                    {[
                      "Web Development",
                      "App Development",
                      "AI & Automation",
                      "Cloud Solutions",
                      "UI/UX Design",
                      "Digital Marketing",
                      "Data Science",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Tech Stack (comma separated) *</label>
                <input
                  value={form.tech}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tech: e.target.value }))
                  }
                  placeholder="React, Node.js, MongoDB"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                  >
                    {["ongoing", "completed", "paused", "cancelled"].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      ),
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>Team Size</label>
                  <input
                    type="number"
                    value={form.teamSize}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, teamSize: e.target.value }))
                    }
                    placeholder="e.g. 4"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    value={form.duration}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, duration: e.target.value }))
                    }
                    placeholder="e.g. 8 weeks"
                  />
                </div>
                <div className="form-group">
                  <label>Completed Date</label>
                  <input
                    type="date"
                    value={form.completedDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, completedDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Live URL</label>
                <input
                  value={form.liveUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, liveUrl: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Project description..."
                  required
                />
              </div>
              <div
                style={{ display: "flex", gap: ".75rem", marginTop: "1rem" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {editing ? "Update Project" : "Add Project"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ── User Detail Analytics Modal ───────────────────────────
const UserDetailModal = ({ user: u, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activityData, setActivityData] = useState({
  courses: 0,
  hoursLogged: 0,
  attendance: 0,
  assignments: 0,
  averageScore: 0,
  dayStreak: 0,
  sessionsAttended: 0,

  weeklyActivity: [],
  dailyHours: [],
  assignmentScores: [],
  courseProgress: [],
  overallProgress: [],
  sessionHistory: [],

  recentActivities: []
});
  const [loading, setLoading] = useState(true);

  // Fetch user activity data when modal opens
  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/admin/users/${u._id}/activity`);
        setActivityData(response.data.data);
      } catch (error) {
        // console.error("Failed to fetch user activity:", error);
        toast.error("Failed to load user activity data");
      } finally {
        setLoading(false);
      }
    };

    if (u._id) {
      fetchUserActivity();
    }
  }, [u._id]);

  const activityChartData = activityData.weeklyActivity || [];

  const skillData = activityData.assignmentScores?.map((item) => ({
  subject: item.name,
  A: item.score || 0,
})) || [];

  const dailyLogin = activityData.dailyHours || [];

  const progressData =
  activityData.overallProgress?.map((item) => ({
    ...item,
    color:
      item.name === "Completed"
        ? "#27ae60"
        : item.name === "In Progress"
        ? "#E8A820"
        : "#dc4545",
  })) || [];

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity" },
    { id: "progress", label: "Progress" },
    { id: "sessions", label: "Sessions" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 12px",
            boxShadow: "var(--sh)",
            fontSize: ".8rem",
          }}
        >
          <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: 3 }}>
            {label}
          </p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, margin: "2px 0" }}>
              {p.name}: <strong>{p.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ud-modal">
        <div className="ud-header">
          <button className="ud-close" onClick={onClose}>
            ×
          </button>
          <div className="ud-profile">
            <div className="ud-avatar">{u.name?.[0]?.toUpperCase()}</div>
            <div className="ud-info">
              <h2>{u.name}</h2>
              <p>
                {u.email} · {u.phone || "No phone"}
              </p>
              <div className="ud-tags">
                <span className={`ud-tag ${u.isVerified ? "green" : "red"}`}>
                  {u.isVerified ? "✓ Verified" : "✗ Unverified"}
                </span>
                <span className={`ud-tag ${u.isBlocked ? "red" : "green"}`}>
                  {u.isBlocked ? "🚫 Blocked" : "✓ Active"}
                </span>
                <span className="ud-tag blue">{u.authProvider}</span>
                {u.college && <span className="ud-tag navy">{u.college}</span>}
                {u.interest && (
                  <span className="ud-tag gold">{u.interest}</span>
                )}
              </div>
            </div>
          </div>
          <div className="ud-quick-stats">
            {[
              {
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                ),
                val: loading ? "..." : activityData.courses,
                label: "Courses",
                color: "#2196C9",
                bgColor: "rgba(33,150,201,.15)",
              },
              {
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                val: loading ? "..." : `${activityData.hoursLogged}h`,
                label: "Hours Logged",
                color: "#27ae60",
                bgColor: "rgba(39,174,96,.15)",
              },
              {
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                ),
                val: loading ? "..." : `${activityData.attendance}%`,
                label: "Attendance",
                color: "#6c3483",
                bgColor: "rgba(108,52,131,.15)",
              },
              {
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                  </svg>
                ),
                val: loading ? "..." : activityData.assignments,
                label: "Assignments",
                color: "#E8A820",
                bgColor: "rgba(232,168,32,.15)",
              },
              {
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
                val: loading ? "..." : activityData.averageScore,
                label: "Avg Score",
                color: "#e67e22",
                bgColor: "rgba(230,126,34,.15)",
              },
              {
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
                  </svg>
                ),
                val: loading ? "..." : activityData.dayStreak,
                label: "Day Streak",
                color: "#dc4545",
                bgColor: "rgba(220,69,69,.15)",
              },
            ].map((s) => (
              <div key={s.label} className="ud-qs">
                <span
                  style={{
                    color: s.color,
                    background: s.bgColor,
                    boxShadow: `0 2px 8px ${s.color}33`,
                  }}
                >
                  {s.icon}
                </span>
                <strong style={{ color: s.color }}>{s.val}</strong>
                <small>{s.label}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="ud-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`ud-tab${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="ud-body">
          {activeTab === "overview" && (
            <div className="ud-section">
              <div className="ud-charts-row">
                <div className="ud-chart-card" style={{ flex: 2 }}>
                  <div className="ud-chart-title">Weekly Learning Activity</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart
                      data={activityChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="lgGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#2196C9"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2196C9"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#E8A820"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#E8A820"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient id="seGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#27ae60"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#27ae60"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(27,42,74,0.06)"
                      />
                      <XAxis
                        dataKey="week"
                        tick={{ fontSize: 11, fill: "#5a6a82" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#5a6a82" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area
                        type="monotone"
                        dataKey="lectures"
                        stroke="#2196C9"
                        strokeWidth={2}
                        fill="url(#lgGrad)"
                        name="Lectures"
                        dot={{ r: 3 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="practice"
                        stroke="#E8A820"
                        strokeWidth={2}
                        fill="url(#prGrad)"
                        name="Practice"
                        dot={{ r: 3 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sessions"
                        stroke="#27ae60"
                        strokeWidth={2}
                        fill="url(#seGrad)"
                        name="Live Sessions"
                        dot={{ r: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="ud-chart-card" style={{ flex: 1 }}>
                  <div className="ud-chart-title">Overall Progress</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={progressData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {progressData.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [v + "%", ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-legend">
                    {progressData.map((s) => (
                      <div key={s.name} className="pie-legend-item">
                        <div
                          className="pie-dot"
                          style={{ background: s.color }}
                        />
                        <span>{s.name}</span>
                        <strong>{s.value}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ud-info-grid">
                {[
                  { icon: "👤", label: "Full Name", val: u.name },
                  { icon: "📧", label: "Email", val: u.email },
                  { icon: "🎓", label: "College", val: u.college || "—" },
                  { icon: "📅", label: "Year", val: u.year || "—" },
                  { icon: "💡", label: "Interest", val: u.interest || "—" },
                  { icon: "🔑", label: "Auth Provider", val: u.authProvider },
                  {
                    icon: "📅",
                    label: "Joined On",
                    val: new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                  },
                  { icon: "📱", label: "Phone", val: u.phone || "—" },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="ud-info-card">
                    <div className="ud-ic-icon">{icon}</div>
                    <div className="ud-ic-content">
                      <div className="ud-ic-label">{label}</div>
                      <div className="ud-ic-value">{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="ud-section">
              <div className="ud-charts-row">
                <div className="ud-chart-card" style={{ flex: 1 }}>
                  <div className="ud-chart-title">
                    Daily Study Hours (This Week)
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={dailyLogin}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(27,42,74,0.06)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12, fill: "#5a6a82" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#5a6a82" }}
                        axisLine={false}
                        tickLine={false}
                        unit="h"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="hours"
                        name="Hours"
                        fill="#1B2A4A"
                        radius={[6, 6, 0, 0]}
                      >
                        {dailyLogin.map((e, i) => (
                          <Cell
                            key={i}
                            fill={
                              e.hours >= 4
                                ? "#E8A820"
                                : e.hours >= 3
                                  ? "#2196C9"
                                  : "#1B2A4A"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="ud-chart-card" style={{ flex: 1 }}>
                  <div className="ud-chart-title">Skill Proficiency (%)</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={skillData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(27,42,74,0.06)"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: "#5a6a82" }}
                        axisLine={false}
                        tickLine={false}
                        unit="%"
                      />
                      <YAxis
                        type="category"
                        dataKey="subject"
                        tick={{ fontSize: 11, fill: "#5a6a82" }}
                        axisLine={false}
                        tickLine={false}
                        width={75}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="A"
                        name="Proficiency"
                        radius={[0, 6, 6, 0]}
                        fill="#2196C9"
                      >
                        {skillData.map((e, i) => (
                          <Cell
                            key={i}
                            fill={
                              e.A >= 75
                                ? "#27ae60"
                                : e.A >= 60
                                  ? "#2196C9"
                                  : e.A >= 45
                                    ? "#E8A820"
                                    : "#dc4545"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="ud-chart-card" style={{ marginTop: "1.25rem" }}>
                <div className="ud-chart-title">Recent Activity Log</div>
                <div className="activity-timeline">
                  {loading ? (
                    <div className="dash-loading" style={{ padding: "2rem" }}>
                      <div className="dash-spinner" />
                      <p>Loading activities...</p>
                    </div>
                  ) : activityData.recentActivities.length > 0 ? (
                    activityData.recentActivities.map((activity, i) => (
                      <div key={i} className="at-item">
                        <div
                          className={`at-dot ${activity.activityType || "default"}`}
                        />
                        <div className="at-icon">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div className="at-content">
                          <div className="at-action">
                            {activity.activityType
                              ?.replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                              "Activity"}
                          </div>
                          <div className="at-time">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span
                          className={`at-badge ${activity.activityType || "default"}`}
                        >
                          {activity.activityType || "activity"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "var(--muted)",
                      }}
                    >
                      <p>No recent activities found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "progress" && (
            <div className="ud-section">
              <div className="ud-charts-row">
                <div className="ud-chart-card" style={{ flex: 1 }}>
                  <div className="ud-chart-title">
                    Lectures Attended vs Total
                  </div>
                  <div className="progress-modules">
                    {[
                      {
                        name: "HTML & CSS",
                        done: 12,
                        total: 12,
                        color: "#27ae60",
                      },
                      {
                        name: "JavaScript",
                        done: 18,
                        total: 24,
                        color: "#2196C9",
                      },
                      {
                        name: "React.js",
                        done: 10,
                        total: 20,
                        color: "#6c3483",
                      },
                      { name: "Node.js", done: 6, total: 16, color: "#e67e22" },
                      { name: "MongoDB", done: 4, total: 12, color: "#1e8449" },
                      {
                        name: "Deployment",
                        done: 0,
                        total: 8,
                        color: "#dc4545",
                      },
                    ].map((m) => (
                      <div key={m.name} className="pm-item">
                        <div className="pm-header">
                          <span className="pm-name">{m.name}</span>
                          <span className="pm-count">
                            {m.done}/{m.total}
                          </span>
                        </div>
                        <div className="pm-bar">
                          <div
                            className="pm-fill"
                            style={{
                              width: `${(m.done / m.total) * 100}%`,
                              background: m.color,
                            }}
                          />
                        </div>
                        <span className="pm-pct" style={{ color: m.color }}>
                          {Math.round((m.done / m.total) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ud-chart-card" style={{ flex: 1 }}>
                  <div className="ud-chart-title">Assignment Scores</div>
                  <ResponsiveContainer width="100%" height={260}>
                     <LineChart
                     data={activityData.assignmentScores || []}
                      margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(27,42,74,0.06)"
                      />
                      <XAxis
                        dataKey="num"
                        tick={{ fontSize: 11, fill: "#5a6a82" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[60, 100]}
                        tick={{ fontSize: 11, fill: "#5a6a82" }}
                        axisLine={false}
                        tickLine={false}
                        unit="%"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Score"
                        stroke="#E8A820"
                        strokeWidth={2.5}
                        dot={{
                          r: 5,
                          fill: "#E8A820",
                          strokeWidth: 2,
                          stroke: "white",
                        }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ marginTop: "1.25rem" }}>
                <div
                  className="ud-chart-title"
                  style={{ marginBottom: ".85rem" }}
                >
                  Enrolled Courses
                </div>
                <div className="enrolled-courses">
                  {(activityData.courseProgress || []).map((c, i) => (
  <div key={c.id || i} className="ec-card">
    <div className="ec-info">
      <h4>{c.name}</h4>

      <div className="ec-meta">
        <span>Started: {c.start || "—"}</span>

        <span className={`ec-badge ${c.status || ""}`}>
          {c.status || "In Progress"}
        </span>

        <span
          className={`ec-badge ${c.paid ? "paid" : "pending"}`}
        >
          {c.paid ? "Paid" : "Pending Payment"}
        </span>
      </div>
    </div>

    <div className="ec-progress">
      <div className="ec-pct">
        {c.progress || 0}%
      </div>

      <div className="ec-bar">
        <div
          className="ec-fill"
          style={{
            width: `${c.progress || 0}%`,
            background:
              c.progress === 100 ? "#27ae60" : "#2196C9",
          }}
        />
      </div>
    </div>
  </div>
))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="ud-section">
              <div className="ud-charts-row">
                <div className="ud-chart-card" style={{ flex: 1 }}>
                  <div className="ud-chart-title">Live Sessions Attendance</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={activityChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(27,42,74,0.06)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="week"
                        tick={{ fontSize: 11, fill: "#5a6a82" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#5a6a82" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="sessions"
                        name="Sessions Attended"
                        fill="#27ae60"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="ud-chart-card" style={{ flex: 1 }}>
                  <div className="ud-chart-title">Session Summary</div>
                  <div className="session-stats">
                    {[
                      {
                        label: "Total Sessions Scheduled",
                        val: activityData.sessionsTotal || 0,
                        icon: "📅",
                        color: "#1B2A4A",
                      },
                      {
                        label: "Sessions Attended",
                        val: activityData.sessionsAttended || 0,
                        icon: "✅",
                        color: "#27ae60",
                      },
                      {
                        label: "Sessions Missed",
                        val:  Math.max(0,(activityData.sessionsTotal || 0) -
      (activityData.sessionsAttended || 0)),
                        icon: "❌",
                        color: "#dc4545",
                      },
                      {
                        label: "Attendance Rate",
                        val: activityData.attendanceRate? `${activityData.attendanceRate}%` : "0%",
                        icon: "📊",
                        color: "#2196C9",
                      },
                      {
                        label: "Avg Session Duration",
                        val: activityData.avgSessionDuration? `${activityData.avgSessionDuration} min`: "0 min",
                        icon: "⏱️",
                        color: "#e67e22",
                      },
                      {
                        label: "Practice Hours Total",
                        val: activityData.practiceHours? `${activityData.practiceHours}h`: "0h",
                        icon: "💻",
                        color: "#6c3483",
                      },
                    ].map((s, i) => (
                      <div key={i} className="ss-item">
                        <span className="ss-icon">{s.icon}</span>
                        <span className="ss-label">{s.label}</span>
                        <strong className="ss-val" style={{ color: s.color }}>
                          {s.val}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ud-chart-card" style={{ marginTop: "1.25rem" }}>
                <div className="ud-chart-title">Session History</div>
                <div className="table-wrap" style={{ marginTop: ".75rem" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Session</th>
                        <th>Topic</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          name: "Live Session #19",
                          topic: "Node.js REST APIs",
                          date: "01 May 2024",
                          dur: "60 min",
                          status: "attended",
                          score: "92%",
                        },
                        {
                          name: "Live Session #18",
                          topic: "React Hooks Deep Dive",
                          date: "28 Apr 2024",
                          dur: "55 min",
                          status: "attended",
                          score: "88%",
                        },
                        {
                          name: "Live Session #17",
                          topic: "MongoDB Aggregation",
                          date: "25 Apr 2024",
                          dur: "60 min",
                          status: "missed",
                          score: "—",
                        },
                        {
                          name: "Live Session #16",
                          topic: "Express Middleware",
                          date: "22 Apr 2024",
                          dur: "50 min",
                          status: "attended",
                          score: "85%",
                        },
                        {
                          name: "Live Session #15",
                          topic: "JS Async/Await",
                          date: "19 Apr 2024",
                          dur: "55 min",
                          status: "attended",
                          score: "90%",
                        },
                        {
                          name: "Live Session #14",
                          topic: "CSS Grid & Flexbox",
                          date: "16 Apr 2024",
                          dur: "45 min",
                          status: "missed",
                          score: "—",
                        },
                      ].map((s, i) => (
                        <tr key={i}>
                          <td>
                            <strong>{s.name}</strong>
                          </td>
                          <td>{s.topic}</td>
                          <td>{s.date}</td>
                          <td>{s.dur}</td>
                          <td>
                            <span
                              className={`badge-status ${s.status === "attended" ? "badge-accepted" : "badge-rejected"}`}
                            >
                              {s.status}
                            </span>
                          </td>
                          <td>
                            <strong
                              style={{
                                color: s.score !== "—" ? "#27ae60" : "#dc4545",
                              }}
                            >
                              {s.score}
                            </strong>
                          </td>
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
    API.get("/admin/admins")
      .then((r) => setAdmins(r.data.data))
      .catch(() => toast.error("Failed to load admins"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (admin) => {
    if (admin._id === currentUser?._id) {
      toast.error("You cannot delete yourself");
      return;
    }
    if (!window.confirm(`Delete admin "${admin.name}"? This cannot be undone.`))
      return;
    setDeleting(admin._id);
    try {
      await API.delete(`/admin/admins/${admin._id}`);
      toast.success("Admin deleted!");
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
      </div>
    );

  return (
    <div>
      <div className="tab-header">
        <div>
          <h2>Admin Accounts</h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".85rem",
              marginTop: ".2rem",
            }}
          >
            {admins.length} admin{admins.length !== 1 ? "s" : ""} have access to
            this panel
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            background: "rgba(220,69,69,.1)",
            color: "#dc4545",
            border: "1px solid rgba(220,69,69,.25)",
            padding: ".5rem 1.25rem",
            borderRadius: "50px",
            fontWeight: 700,
            fontSize: ".88rem",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {admins.length} Admin{admins.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        {[
          {
            color: "#dc4545",
            bg: "rgba(220,69,69,.1)",
            num: admins.length,
            label: "Total Admins",
          },
          {
            color: "#27ae60",
            bg: "rgba(39,174,96,.1)",
            num: admins.filter((a) => a.isVerified).length,
            label: "Verified",
          },
          {
            color: "#2196C9",
            bg: "rgba(33,150,201,.1)",
            num: admins.filter((a) => a.authProvider === "local").length,
            label: "Local Auth",
          },
          {
            color: "#E8A820",
            bg: "rgba(232,168,32,.1)",
            num: admins.filter((a) => a._id !== currentUser?._id).length,
            label: "Other Admins",
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "white",
              borderRadius: "var(--r)",
              padding: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              boxShadow: "var(--sh)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: s.bg,
                color: s.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontSize: ".72rem",
                  color: "var(--muted)",
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: "1.25rem",
        }}
      >
        {admins.map((a) => (
          <div
            key={a._id}
            style={{
              background: "white",
              borderRadius: "var(--r)",
              padding: "1.5rem",
              boxShadow: "var(--sh)",
              border:
                a._id === currentUser?._id
                  ? "2px solid #E8A820"
                  : "1px solid var(--border)",
              position: "relative",
            }}
          >
            {a._id === currentUser?._id && (
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "#E8A820",
                  color: "var(--navy)",
                  fontSize: ".65rem",
                  fontWeight: 800,
                  padding: ".2rem .65rem",
                  borderRadius: "50px",
                }}
              >
                YOU
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#dc4545,#ff6b6b)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  flexShrink: 0,
                }}
              >
                {a.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "var(--navy)",
                    fontSize: "1rem",
                    marginBottom: ".2rem",
                  }}
                >
                  {a.name}
                </div>
                <div
                  style={{
                    fontSize: ".78rem",
                    color: "var(--muted)",
                    marginBottom: ".4rem",
                  }}
                >
                  {a.email}
                </div>
                <div style={{ display: "flex", gap: ".35rem" }}>
                  <span
                    style={{
                      fontSize: ".65rem",
                      fontWeight: 700,
                      padding: ".18rem .6rem",
                      borderRadius: "50px",
                      background: a.isVerified
                        ? "rgba(39,174,96,.1)"
                        : "rgba(220,69,69,.1)",
                      color: a.isVerified ? "#27ae60" : "#dc4545",
                      border: `1px solid ${a.isVerified ? "rgba(39,174,96,.25)" : "rgba(220,69,69,.25)"}`,
                    }}
                  >
                    {a.isVerified ? "✓ Verified" : "✗ Unverified"}
                  </span>
                  <span
                    style={{
                      fontSize: ".65rem",
                      fontWeight: 700,
                      padding: ".18rem .6rem",
                      borderRadius: "50px",
                      background: "rgba(33,150,201,.1)",
                      color: "#2196C9",
                      border: "1px solid rgba(33,150,201,.25)",
                      textTransform: "capitalize",
                    }}
                  >
                    {a.authProvider}
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: ".8rem",
                color: "var(--muted)",
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: ".35rem",
              }}
            >
              <span>
                Joined:{" "}
                {new Date(a.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {a.phone && <span>Phone: {a.phone}</span>}
              {a.college && <span>College: {a.college}</span>}
            </div>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <button
                onClick={() => setSelected(a)}
                style={{
                  flex: 1,
                  padding: ".6rem",
                  background: "var(--navy)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--rsm)",
                  fontWeight: 700,
                  fontSize: ".82rem",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                View Details
              </button>
              {a._id !== currentUser?._id && (
                <button
                  disabled={deleting === a._id}
                  onClick={() => handleDelete(a)}
                  style={{
                    padding: ".6rem .9rem",
                    background: "rgba(220,69,69,.1)",
                    color: "#dc4545",
                    border: "1px solid rgba(220,69,69,.25)",
                    borderRadius: "var(--rsm)",
                    fontWeight: 700,
                    fontSize: ".82rem",
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    opacity: deleting === a._id ? 0.5 : 1,
                  }}
                >
                  {deleting === a._id ? "..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="modal-box" style={{ maxWidth: "480px" }}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              ×
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid var(--border)",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#dc4545,#ff6b6b)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "1.6rem",
                  flexShrink: 0,
                }}
              >
                {selected.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    color: "var(--navy)",
                    marginBottom: ".3rem",
                  }}
                >
                  {selected.name}
                </h3>
                <span
                  style={{
                    fontSize: ".75rem",
                    background: "rgba(220,69,69,.1)",
                    color: "#dc4545",
                    padding: ".2rem .65rem",
                    borderRadius: "50px",
                    fontWeight: 700,
                  }}
                >
                  Administrator
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".75rem",
              }}
            >
              {[
                ["Email", selected.email],
                ["Phone", selected.phone || "—"],
                ["College", selected.college || "—"],
                [
                  "Joined",
                  new Date(selected.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                ],
                ["Auth Provider", selected.authProvider],
                ["Verified", selected.isVerified ? "Yes ✓" : "No ✗"],
              ].map(([label, val], i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--cream)",
                    borderRadius: 10,
                    padding: ".85rem 1rem",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: ".68rem",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      marginBottom: ".15rem",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: ".9rem",
                      fontWeight: 600,
                      color: "var(--navy)",
                      wordBreak: "break-all",
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
            {selected._id !== currentUser?._id && (
              <button
                disabled={deleting === selected._id}
                onClick={() => handleDelete(selected)}
                style={{
                  width: "100%",
                  marginTop: "1.25rem",
                  padding: ".75rem",
                  background: "#dc4545",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--rsm)",
                  fontWeight: 700,
                  fontSize: ".9rem",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  opacity: deleting === selected._id ? 0.5 : 1,
                }}
              >
                {deleting === selected._id
                  ? "Deleting..."
                  : "Delete This Admin"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


// ── Mentor Management ────────────────────────────────────
const MentorManagement = () => {
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [overview, setOverview] = useState(null);
  const [form, setForm] = useState({
    name:'', email:'', password:'', phone:'', expertise:'', skills:'', assignedCourses:'', assignedBatches:''
  });
  const [assign, setAssign] = useState({ studentId:'', mentorId:'' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [m, u, ov] = await Promise.all([
        getAdminMentors(),
        getAdminUsers({ limit: 100 }),
        getAllMentorsOverview().catch(() => ({ data: { data: null } }))
      ]);
      setMentors(m.data.data || []);
      const users = u.data.data?.users || u.data.data || [];
      setStudents(users.filter(x => x.role === 'student'));
      setOverview(ov.data?.data || null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to load mentors');
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await createMentorAccount({
        ...form,
        expertise: form.expertise.split(',').map(x=>x.trim()).filter(Boolean),
        skills: form.skills.split(',').map(x=>x.trim()).filter(Boolean),
        assignedCourses: form.assignedCourses.split(',').map(x=>x.trim()).filter(Boolean),
        assignedBatches: form.assignedBatches.split(',').map(x=>x.trim()).filter(Boolean)
      });
      toast.success('Mentor account created');
      setForm({name:'',email:'',password:'',phone:'',expertise:'',skills:'',assignedCourses:'',assignedBatches:''});
      load();
    } catch(e) { toast.error(e.response?.data?.message || 'Unable to create mentor'); }
  };

  const assignStudent = async () => {
    if (!assign.studentId || !assign.mentorId) return toast.error('Select a mentor and student');
    try {
      await assignStudentToMentor(assign.studentId, assign.mentorId);
      toast.success('Student assigned to mentor');
      setAssign({studentId:'',mentorId:''});
      load();
    } catch(e) { toast.error(e.response?.data?.message || 'Unable to assign student'); }
  };

  if (loading) return <div className="dash-loading"><div className="dash-spinner"/></div>;

  return <div>
    <div className="overview-welcome">
      <div>
        <h2>Mentor Management & Supervision</h2>
        <p>Create mentor accounts, assign students, and access any mentor's live dashboard, schedule & announcements.</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link
          to="/mentor/dashboard"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', background: 'linear-gradient(135deg, #e8a820, #f5c453)', color: '#12233f', fontWeight: 800 }}
        >
          🚀 Access Mentor Portal
        </Link>
        <button
          className="btn"
          onClick={load}
          style={{
            backgroundColor: "#e8a820",
            color: "#12233f",
            border: "1px solid #d49516",
            fontWeight: 700,
            cursor: "pointer",
            borderRadius: "8px",
            padding: ".5rem 1.1rem",
            fontSize: ".85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 8px rgba(232, 168, 32, 0.25)"
          }}
        >
          ↻ Refresh
        </button>
      </div>
    </div>

    {/* Quick stats cards if overview loaded */}
    {overview?.stats && (
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-value">{overview.stats.totalMentors || 0}</div>
          <div className="stat-label">Total Mentors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overview.stats.totalStudentsMentored || 0}</div>
          <div className="stat-label">Students Mentored</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overview.stats.totalClasses || 0}</div>
          <div className="stat-label">Scheduled Classes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overview.stats.totalPendingSubmissions || 0}</div>
          <div className="stat-label">Pending Reviews</div>
        </div>
      </div>
    )}

    <div className="charts-row">
      <div className="chart-card" style={{flex:1}}>
        <h3 style={{marginBottom:'1rem'}}>Create Mentor Account</h3>
        <form className="admin-filters" onSubmit={create} style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
          <input className="admin-search" required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input className="admin-search" required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <input className="admin-search" required type="password" minLength="6" placeholder="Temporary password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
          <input className="admin-search" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
          <input className="admin-search" placeholder="Expertise (comma separated)" value={form.expertise} onChange={e=>setForm({...form,expertise:e.target.value})}/>
          <input className="admin-search" placeholder="Skills (comma separated)" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})}/>
          <input className="admin-search" placeholder="Courses (comma separated)" value={form.assignedCourses} onChange={e=>setForm({...form,assignedCourses:e.target.value})}/>
          <input className="admin-search" placeholder="Batches (comma separated)" value={form.assignedBatches} onChange={e=>setForm({...form,assignedBatches:e.target.value})}/>
          <button className="btn btn-primary" type="submit" style={{gridColumn:'1 / -1'}}>Create Mentor</button>
        </form>
      </div>

      <div className="chart-card" style={{flex:1}}>
        <h3 style={{marginBottom:'1rem'}}>Assign Student to Mentor</h3>
        <div style={{display:'grid',gap:'.8rem'}}>
          <select className="admin-select" value={assign.mentorId} onChange={e=>setAssign({...assign,mentorId:e.target.value})}>
            <option value="">Select mentor</option>
            {mentors.map(m=><option key={m._id} value={m._id}>{m.name} ({m.studentCount} students)</option>)}
          </select>
          <select className="admin-select" value={assign.studentId} onChange={e=>setAssign({...assign,studentId:e.target.value})}>
            <option value="">Select student</option>
            {students.map(st=><option key={st._id} value={st._id}>{st.name} — {st.email}</option>)}
          </select>
          <button className="btn btn-primary" onClick={assignStudent}>Assign Student</button>
        </div>
      </div>
    </div>

    {/* Mentors Table with Direct Dashboard Access */}
    <div className="chart-card" style={{marginTop:'1.5rem'}}>
      <div className="chart-header">
        <div>
          <h3>Active Mentors Roster</h3>
          <span className="chart-sub">{mentors.length} mentor accounts in system</span>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mentor</th>
              <th>Email</th>
              <th>Expertise</th>
              <th>Assigned Courses</th>
              <th>Students</th>
              <th>Status</th>
              <th>Supervision</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map(m=>(
              <tr key={m._id}>
                <td><strong>{m.name}</strong></td>
                <td>{m.email}</td>
                <td>{(m.expertise||[]).join(', ') || '—'}</td>
                <td>{(m.assignedCourses||[]).join(', ') || '—'}</td>
                <td><span className="badge-status badge-active">{m.studentCount} students</span></td>
                <td><span className={`badge-status badge-${m.isBlocked?'blocked':'active'}`}>{m.isBlocked?'Blocked':'Active'}</span></td>
                <td>
                  <Link
                    to={`/mentor/dashboard?mentorId=${m._id}`}
                    className="btn btn-outline"
                    style={{
                      fontSize: '.75rem',
                      padding: '.35rem .75rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#f8fafc',
                      color: '#1e40af',
                      borderColor: '#93c5fd'
                    }}
                  >
                    👁️ View Dashboard →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Collective Activity & Announcements Section */}
    {overview && (
      <div className="charts-row" style={{ marginTop: '1.5rem' }}>
        <div className="chart-card" style={{ flex: 1 }}>
          <div className="chart-header">
            <h3>Recent Mentor Announcements</h3>
            <span className="chart-sub">Messages sent to students</span>
          </div>
          {(!overview.recentAnnouncements || overview.recentAnnouncements.length === 0) ? (
            <p style={{ color: 'var(--muted)', fontSize: '.85rem', padding: '1rem 0' }}>No announcements sent yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {overview.recentAnnouncements.slice(0, 6).map(a => (
                <div key={a._id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '.88rem', color: '#1e293b' }}>{a.title}</strong>
                    <span style={{ fontSize: '.72rem', color: '#64748b' }}>{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '.78rem', color: '#475569', margin: '4px 0' }}>{a.message}</p>
                  <small style={{ fontSize: '.68rem', color: '#94a3b8' }}>
                    Recipient: {a.recipient?.name || 'Student'} ({a.recipient?.email || ''})
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chart-card" style={{ flex: 1 }}>
          <div className="chart-header">
            <h3>Scheduled Classes Across Mentors</h3>
            <span className="chart-sub">Upcoming & recent sessions</span>
          </div>
          {(!overview.recentClasses || overview.recentClasses.length === 0) ? (
            <p style={{ color: 'var(--muted)', fontSize: '.85rem', padding: '1rem 0' }}>No scheduled classes yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {overview.recentClasses.slice(0, 6).map(c => (
                <div key={c._id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '.88rem', display: 'block', color: '#1e293b' }}>{c.title}</strong>
                    <span style={{ fontSize: '.72rem', color: '#64748b' }}>
                      Mentor: {c.mentor?.name || 'Mentor'} · {new Date(c.date).toLocaleDateString()} ({c.startTime} - {c.endTime})
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="badge-status badge-active" style={{ textTransform: 'capitalize' }}>{c.status}</span>
                    {c.meetingLink && (
                      <a href={c.meetingLink} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '.7rem', padding: '.25rem .5rem', textDecoration: 'none' }}>
                        Join
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </div>;
};

export default Admin;
const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", coverImageUrl: "", tags: "" });
  const [saving, setSaving] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await getAdminBlogPosts();
      setPosts(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) {
      toast.error("Title, excerpt, and content are required");
      return;
    }
    setSaving(true);
    try {
      await createBlogPost(form);
      toast.success("Blog post published!");
      setShowModal(false);
      setForm({ title: "", excerpt: "", content: "", coverImageUrl: "", tags: "" });
      loadPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      await deleteBlogPost(id);
      toast.success("Post deleted");
      loadPosts();
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div>
      <div className="tab-header">
        <div>
          <h2>Blog Management</h2>
          <p style={{ color: "var(--muted)", fontSize: ".85rem" }}>
            Published posts appear on the public Blog page, newest first. All posts stay listed here as your blog history.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Post
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading…</p>
      ) : posts.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No blog posts yet. Click "New Post" to publish your first one.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {posts.map((p) => (
            <div
              key={p._id}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#fff", border: "1px solid var(--border)", borderRadius: "12px",
                padding: "14px 18px",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: "3px" }}>{p.title}</div>
                <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>
                  {new Date(p.createdAt).toLocaleDateString()} · {p.author?.name || "WeIntern Team"}
                  {!p.published && <span style={{ color: "#dc2626", fontWeight: 700 }}> · Unpublished</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <a
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ fontSize: ".78rem", padding: ".4rem .8rem" }}
                >
                  View
                </a>
                <button
                  className="btn btn-outline"
                  style={{ fontSize: ".78rem", padding: ".4rem .8rem", color: "#dc2626", borderColor: "#dc2626" }}
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "640px" }}>
            <h3 style={{ marginBottom: "1rem" }}>New Blog Post</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text" value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Excerpt * (shown on the blog listing card)</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label>Content * (each blank line becomes a new paragraph)</label>
                <textarea
                  value={form.content}
                  onChange={(e) => set("content", e.target.value)}
                  rows={8}
                />
              </div>
              <div className="form-group">
                <label>Cover image URL (optional)</label>
                <input
                  type="text" value={form.coverImageUrl}
                  onChange={(e) => set("coverImageUrl", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Tags, comma separated (optional)</label>
                <input
                  type="text" value={form.tags}
                  onChange={(e) => set("tags", e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "6px" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Publishing…" : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
