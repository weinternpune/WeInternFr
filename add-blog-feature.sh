#!/bin/bash
set -e

# ============================================================
# WeIntern - Blog feature (admin post + public blog with history)
# + Internships dropdown: Projects -> our projects section,
#   Placement -> homepage (as requested)
# Run from your project ROOT:
#   cd ~/path/to/WeInternFr
#   bash add-blog-feature.sh
# ============================================================

if [ ! -f "backend/src/server.js" ]; then
  echo "Cannot find backend/src/server.js -- run this from your project root."
  exit 1
fi

echo "[1/10] Writing backend/src/models/Blog.js ..."
mkdir -p "backend/src/models"
cat > "backend/src/models/Blog.js" << 'FILEEOF1'
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  coverImageUrl: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'WeIntern Team' },
  },
  published: { type: Boolean, default: true },
}, { timestamps: true });

blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
FILEEOF1

echo "[2/10] Writing backend/src/routes/blog.js ..."
mkdir -p "backend/src/routes"
cat > "backend/src/routes/blog.js" << 'FILEEOF2'
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Blog = require('../models/Blog');

const slugify = (str = '') =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ---- Public: list all published posts (blog history) ----------------------
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .select('title slug excerpt coverImageUrl tags author createdAt');
    res.json({ success: true, data: posts });
  } catch (err) {
    console.error('Blog list error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load blog posts' });
  }
});

// ---- Admin: list all posts including unpublished ---------------------------
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    console.error('Blog admin list error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load posts' });
  }
});

// ---- Public: single post by slug ------------------------------------------
router.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (err) {
    console.error('Blog detail error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load post' });
  }
});

// ---- Admin: create a post ---------------------------------------------------
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, coverImageUrl, tags, published } = req.body;
    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, message: 'Title, excerpt, and content are required' });
    }

    let slug = slugify(title);
    const existing = await Blog.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

    const post = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      coverImageUrl: coverImageUrl || '',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      author: { id: req.user._id, name: req.user.name || 'WeIntern Team' },
      published: published !== false,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    console.error('Blog create error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
});

// ---- Admin: update a post ---------------------------------------------------
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, coverImageUrl, tags, published } = req.body;
    const update = { excerpt, content, coverImageUrl, published };
    if (title) update.title = title;
    if (tags) update.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim()).filter(Boolean);

    const post = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    res.json({ success: true, data: post });
  } catch (err) {
    console.error('Blog update error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update post' });
  }
});

// ---- Admin: delete a post ----------------------------------------------------
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('Blog delete error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
});

module.exports = router;
FILEEOF2

echo "[3/10] Writing backend/src/server.js ..."
mkdir -p "backend/src"
cat > "backend/src/server.js" << 'FILEEOF3'
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");

const connectDB = require("./config/database");
const { generalLimiter } = require("./middleware/rateLimiter");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const applicationRoutes = require("./routes/application");
const courseRoutes = require("./routes/course");
const paymentRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");
const blogRoutes = require("./routes/blog");

// Passport config
require("./config/passport");

const app = express();
app.set('trust proxy', 1);
app.set('trust proxy', 1);

// Connect Database
connectDB();

// Security Middleware
app.use(helmet());

// CORS Configuration (Production Ready)
const allowedOrigins = [
  // Local development
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',

  // Production
  'https://we-intern.in',
  'https://www.we-intern.in',

  process.env.FRONTEND_URL,
].filter(Boolean);


app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      // Remove trailing slash issue
      const cleanOrigin = origin.replace(/\/$/, "");

      const isAllowed = allowedOrigins.some(
        (allowed) => allowed && cleanOrigin === allowed.replace(/\/$/, ""),
      );

      if (isAllowed) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  }),
);

// Preflight requests
app.options("*", cors());

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Passport
app.use(passport.initialize());

// Rate Limiting
app.use("/api/", generalLimiter);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blog", blogRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WeIntern Server running on port ${PORT}`);
});

module.exports = app;
FILEEOF3

echo "[4/10] Writing frontend/src/pages/Blog.jsx ..."
mkdir -p "frontend/src/pages"
cat > "frontend/src/pages/Blog.jsx" << 'FILEEOF4'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from '../components/Layout/Navbar';
import { getBlogPosts } from '../utils/api';
import './Blog.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getBlogPosts();
        setPosts(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="blog-page">
      <Navbar />
      <div className="blog-hero">
        <span className="blog-eyebrow">— From the WeIntern Team —</span>
        <h1>WeIntern Blog</h1>
        <p>Updates, guides, and stories from our student and mentor community.</p>
      </div>

      <div className="blog-body">
        {loading && (
          <div className="blog-empty">
            <Icon icon="mdi:loading" width={28} height={28} className="blog-spin" />
            <p>Loading posts…</p>
          </div>
        )}

        {!loading && error && (
          <div className="blog-empty">
            <Icon icon="mdi:alert-circle-outline" width={28} height={28} />
            <p>Couldn't load blog posts right now. Please try again shortly.</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="blog-empty">
            <Icon icon="mdi:notebook-outline" width={28} height={28} />
            <p>No posts yet — check back soon!</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="blog-grid">
            {posts.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blog-card" key={post._id}>
                <div className="blog-card-cover">
                  {post.coverImageUrl ? (
                    <img src={post.coverImageUrl} alt={post.title} />
                  ) : (
                    <div className="blog-card-cover-fallback">
                      <Icon icon="mdi:file-document-outline" width={32} height={32} />
                    </div>
                  )}
                </div>
                <div className="blog-card-body">
                  {!!post.tags?.length && (
                    <div className="blog-card-tags">
                      {post.tags.slice(0, 2).map((t) => <span key={t}>{t}</span>)}
                    </div>
                  )}
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-card-meta">
                    <span>{post.author?.name || 'WeIntern Team'}</span>
                    <span>·</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
FILEEOF4

echo "[5/10] Writing frontend/src/pages/BlogPost.jsx ..."
mkdir -p "frontend/src/pages"
cat > "frontend/src/pages/BlogPost.jsx" << 'FILEEOF5'
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from '../components/Layout/Navbar';
import { getBlogPost } from '../utils/api';
import './Blog.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const res = await getBlogPost(slug);
        setPost(res.data?.data || null);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-page">
        <Navbar />
        <div className="blog-empty" style={{ minHeight: '50vh' }}>
          <Icon icon="mdi:loading" width={28} height={28} className="blog-spin" />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="blog-page">
        <Navbar />
        <div className="blog-empty" style={{ minHeight: '50vh' }}>
          <Icon icon="mdi:file-remove-outline" width={28} height={28} />
          <p>Post not found.</p>
          <Link to="/blog" className="blog-back-link">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <Navbar />
      <article className="blog-post">
        <Link to="/blog" className="blog-back-link"><Icon icon="mdi:arrow-left" width={16} height={16} /> Back to Blog</Link>

        {!!post.tags?.length && (
          <div className="blog-card-tags" style={{ marginTop: 20 }}>
            {post.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
        )}

        <h1 className="blog-post-title">{post.title}</h1>
        <div className="blog-card-meta">
          <span>{post.author?.name || 'WeIntern Team'}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        {post.coverImageUrl && (
          <div className="blog-post-cover">
            <img src={post.coverImageUrl} alt={post.title} />
          </div>
        )}

        <div className="blog-post-content">
          {post.content.split('\n').map((para, i) => (para.trim() ? <p key={i}>{para}</p> : null))}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
FILEEOF5

echo "[6/10] Writing frontend/src/pages/Blog.css ..."
mkdir -p "frontend/src/pages"
cat > "frontend/src/pages/Blog.css" << 'FILEEOF6'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.blog-page { min-height: 100vh; background: #fbfcfe; font-family: 'Inter', sans-serif; }
.blog-page * { font-family: 'Inter', sans-serif; }

.blog-hero {
  padding: 120px 24px 50px;
  text-align: center;
  background: linear-gradient(120deg, #ff8a4c 0%, #ff6b35 55%, #6366f1 130%);
  color: #fff;
}
.blog-eyebrow { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.85; margin-bottom: 10px; }
.blog-hero h1 { font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; margin: 0 0 10px; letter-spacing: -0.02em; }
.blog-hero p { font-size: 1rem; opacity: 0.92; margin: 0; }

.blog-body { max-width: 1080px; margin: 0 auto; padding: 48px 24px 90px; }

.blog-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; color: #6b7280; padding: 60px 24px; text-align: center;
}
.blog-spin { animation: blogSpin 0.9s linear infinite; }
@keyframes blogSpin { to { transform: rotate(360deg); } }

.blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 22px; }

.blog-card {
  display: block; text-decoration: none; color: inherit;
  background: #fff; border: 1px solid #eef0f5; border-radius: 18px; overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.blog-card:hover { transform: translateY(-4px); box-shadow: 0 16px 34px rgba(0,0,0,0.08); }
.blog-card-cover { height: 170px; background: linear-gradient(135deg, #fff0e6, #ffe0cc); }
.blog-card-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.blog-card-cover-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #ff6b35; }
.blog-card-body { padding: 18px 20px; }
.blog-card-tags { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
.blog-card-tags span {
  background: rgba(255,107,53,0.1); color: #ff6b35; font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.02em;
}
.blog-card-body h3 { font-size: 17px; font-weight: 700; color: #1a2036; margin: 0 0 8px; line-height: 1.35; }
.blog-card-body p { font-size: 13.5px; color: #6b7280; line-height: 1.6; margin: 0 0 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.blog-card-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9aa0b4; font-weight: 500; }

/* ── Single post ─────────────────────────────────────── */
.blog-post { max-width: 760px; margin: 0 auto; padding: 120px 24px 90px; }
.blog-back-link {
  display: inline-flex; align-items: center; gap: 6px;
  color: #ff6b35; font-weight: 600; font-size: 13.5px; text-decoration: none; margin-bottom: 10px;
}
.blog-back-link:hover { text-decoration: underline; }
.blog-post-title { font-size: clamp(1.8rem, 4vw, 2.4rem); font-weight: 800; color: #1a2036; line-height: 1.25; margin: 14px 0 14px; letter-spacing: -0.02em; }
.blog-post-cover { margin: 24px 0; border-radius: 16px; overflow: hidden; }
.blog-post-cover img { width: 100%; display: block; }
.blog-post-content { margin-top: 24px; }
.blog-post-content p { font-size: 16px; line-height: 1.85; color: #374151; margin: 0 0 18px; }

@media (max-width: 640px) {
  .blog-hero { padding: 100px 18px 40px; }
  .blog-body { padding: 36px 18px 70px; }
  .blog-post { padding: 100px 18px 70px; }
}
FILEEOF6

echo "[7/10] Writing frontend/src/utils/api.js ..."
mkdir -p "frontend/src/utils"
cat > "frontend/src/utils/api.js" << 'FILEEOF7'
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

// Blog
export const getBlogPosts = () => API.get('/blog');
export const getBlogPost = (slug) => API.get(`/blog/${slug}`);
export const getAdminBlogPosts = () => API.get('/blog/admin/all');
export const createBlogPost = (data) => API.post('/blog', data);
export const updateBlogPost = (id, data) => API.put(`/blog/${id}`, data);
export const deleteBlogPost = (id) => API.delete(`/blog/${id}`);
FILEEOF7

echo "[8/10] Writing frontend/src/components/Admin/Admin.jsx ..."
mkdir -p "frontend/src/components/Admin"
cat > "frontend/src/components/Admin/Admin.jsx" << 'FILEEOF8'
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
  getAdminBlogPosts,
  createBlogPost,
  deleteBlogPost,
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
  { id: "enrollments", icon: <FaBook />, label: "Enrollments" },
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
              {ADMIN_TABS.slice(1, 5).map((t) => (
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
              <div className="dns-label">System</div>
              {ADMIN_TABS.slice(5).map((t) => (
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

 const { stats, monthlyData, courseData} = statsData;

  // const courseData = [
  //   { name: "Full Stack", students: 45, color: "#e76f51" },
  //   { name: "Mobile App", students: 32, color: "#2a9d8f" },
  //   { name: "AI & Auto", students: 28, color: "#6c3483" },
  //   { name: "Cloud", students: 20, color: "#1a6b8a" },
  //   { name: "UI/UX", students: 38, color: "#c0392b" },
  //   { name: "Marketing", students: 55, color: "#e67e22" },
  //   { name: "Data Sci", students: 25, color: "#1e8449" },
  // ];

  // Calculate real status data from applications
  const statusData = [
    {
      name: "Accepted",
      value: Math.max(1, Math.floor(stats.totalApplications * 0.35)),
      color: "#27ae60",
    },
    { name: "Pending", value: stats.pendingApplications, color: "#E8A820" },
    {
      name: "Reviewing",
      value: Math.max(1, Math.floor(stats.totalApplications * 0.2)),
      color: "#2196C9",
    },
    {
      name: "Rejected",
      value: Math.max(1, Math.floor(stats.totalApplications * 0.17)),
      color: "#dc4545",
    },
  ];

  const weeklyUsers = [
    { day: "Mon", users: Math.floor(stats.totalUsers * 0.08) },
    { day: "Tue", users: Math.floor(stats.totalUsers * 0.12) },
    { day: "Wed", users: Math.floor(stats.totalUsers * 0.1) },
    { day: "Thu", users: Math.floor(stats.totalUsers * 0.18) },
    { day: "Fri", users: Math.floor(stats.totalUsers * 0.15) },
    { day: "Sat", users: Math.floor(stats.totalUsers * 0.25) },
    { day: "Sun", users: Math.floor(stats.totalUsers * 0.2) },
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
          <h2>Analytics Dashboard</h2>
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
            className="btn btn-outline"
            style={{
              fontSize: ".8rem",
              padding: ".4rem .8rem",
              backgroundColor: "#198754",
              color: "#fff",
            }}
          >
            {loading ? "🔄" : "↻"} Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        className="stats-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            icon: "👥",
            num: stats.totalUsers,
            label: "Total Students",
            color: "#2196C9",
          },
          {
            icon: "📝",
            num: stats.totalApplications,
            label: "Applications",
            color: "#E8A820",
          },
          {
            icon: "⏳",
            num: stats.pendingApplications,
            label: "Pending Review",
            color: "#e67e22",
          },
          {
            icon: "📚",
            num: stats.totalEnrollments,
            label: "Enrollments",
            color: "#6c3483",
          },
          {
            icon: "💰",
            num: stats.paidEnrollments,
            label: "Paid",
            color: "#27ae60",
          },
          {
            icon: "🏢",
            num: stats.totalHireRequests,
            label: "Hire Requests",
            color: "#dc4545",
          },
          {
            icon: "💵",
            num: stats.totalRevenue
              ? "₹" + (stats.totalRevenue / 100000).toFixed(1) + "L"
              : "₹0",
            label: "Total Revenue",
            color: "#1e8449",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ borderTop: "3px solid " + s.color }}
          >
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-num" style={{ color: s.color }}>
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
            {statsData.recentApplications.slice(0, 5).map((a) => (
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
  }, [filter]);

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
      label: "All",
      color: "#6b7280",
      count:
        summary.fullPaid +
        summary.emi1 +
        summary.emi2 +
        summary.emi3 +
        summary.pending,
    },
    {
      key: "full",
      label: "Full Paid ✅",
      color: "#27ae60",
      count: summary.fullPaid,
    },
    {
      key: "emi_1",
      label: "EMI 1st Only",
      color: "#2196C9",
      count: summary.emi1,
    },
    {
      key: "emi_2",
      label: "EMI 2nd Done",
      color: "#6c3483",
      count: summary.emi2,
    },
    {
      key: "emi_3",
      label: "EMI 3rd Done",
      color: "#E8A820",
      count: summary.emi3,
    },
    {
      key: "pending",
      label: "Pending ⚠️",
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
                      {(e.finalPrice || e.coursePrice)?.toLocaleString("en-IN")}
                    </div>
                    {e.discountAmount > 0 && (
                      <div style={{ fontSize: ".7rem", color: "#27ae60" }}>
                        Saved ₹{e.discountAmount?.toLocaleString("en-IN")}
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
    recentActivities: [],
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

  const mockActivityData = [
    { week: "Week 1", lectures: 0, practice: 0, sessions: 0 },
    { week: "Week 2", lectures: 0, practice: 0, sessions: 0 },
    { week: "Week 3", lectures: 0, practice: 0, sessions: 0 },
    { week: "Week 4", lectures: 0, practice: 0, sessions: 0 },
    { week: "Week 5", lectures: 0, practice: 0, sessions: 0 },
    { week: "Week 6", lectures: 0, practice: 0, sessions: 0 },
  ];

  const skillData = [
    { subject: "HTML/CSS", A: 0 },
    { subject: "JavaScript", A: 0 },
    { subject: "React", A: 0 },
    { subject: "Node.js", A: 0 },
    { subject: "Database", A: 0 },
    { subject: "Deployment", A: 0 },
  ];

  const dailyLogin = [
    { day: "Mon", hours: 0 },
    { day: "Tue", hours: 0 },
    { day: "Wed", hours: 0 },
    { day: "Thu", hours: 0 },
    { day: "Fri", hours: 0 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
  ];

  const progressData = [
    { name: "Completed", value: 0, color: "#27ae60" },
    { name: "In Progress", value: 0, color: "#2196C9" },
    { name: "Pending", value: 100, color: "#E8A820" },
  ];

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
                      data={mockActivityData}
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
                      data={[
                        { num: "A1", score: 72 },
                        { num: "A2", score: 78 },
                        { num: "A3", score: 85 },
                        { num: "A4", score: 80 },
                        { num: "A5", score: 88 },
                        { num: "A6", score: 82 },
                        { num: "A7", score: 91 },
                        { num: "A8", score: 88 },
                      ]}
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
                  {[
                    {
                      name: "Full Stack Web Development",
                      progress: 65,
                      status: "active",
                      paid: true,
                      start: "Jan 2024",
                    },
                    {
                      name: "UI/UX Design",
                      progress: 100,
                      status: "completed",
                      paid: true,
                      start: "Nov 2023",
                    },
                    {
                      name: "Digital Marketing",
                      progress: 30,
                      status: "active",
                      paid: false,
                      start: "Feb 2024",
                    },
                  ].map((c, i) => (
                    <div key={i} className="ec-card">
                      <div className="ec-info">
                        <h4>{c.name}</h4>
                        <div className="ec-meta">
                          <span>Started: {c.start}</span>
                          <span className={`ec-badge ${c.status}`}>
                            {c.status}
                          </span>
                          <span
                            className={`ec-badge ${c.paid ? "paid" : "pending"}`}
                          >
                            {c.paid ? "Paid" : "Pending Payment"}
                          </span>
                        </div>
                      </div>
                      <div className="ec-progress">
                        <div className="ec-pct">{c.progress}%</div>
                        <div className="ec-bar">
                          <div
                            className="ec-fill"
                            style={{
                              width: `${c.progress}%`,
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
                      data={mockActivityData}
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
                        val: "24",
                        icon: "📅",
                        color: "#1B2A4A",
                      },
                      {
                        label: "Sessions Attended",
                        val: "19",
                        icon: "✅",
                        color: "#27ae60",
                      },
                      {
                        label: "Sessions Missed",
                        val: "5",
                        icon: "❌",
                        color: "#dc4545",
                      },
                      {
                        label: "Attendance Rate",
                        val: "79%",
                        icon: "📊",
                        color: "#2196C9",
                      },
                      {
                        label: "Avg Session Duration",
                        val: "55 min",
                        icon: "⏱️",
                        color: "#e67e22",
                      },
                      {
                        label: "Practice Hours Total",
                        val: "68h",
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
FILEEOF8

echo "[9/10] Writing frontend/src/components/Layout/Navbar.jsx ..."
mkdir -p "frontend/src/components/Layout"
cat > "frontend/src/components/Layout/Navbar.jsx" << 'FILEEOF9'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronDown,
  ChevronRight,
  Monitor,
  Database,
  Coffee,
  Cpu,
  Globe2,
  Bot,
  TrendingUp,
  Terminal,
  ShieldCheck,
  PenTool,
  Palette,
  Megaphone,
  Rocket,
  Code2,
  BarChart3,
  Sparkles,
  Briefcase,
  Award,
  Users,
} from 'lucide-react';
import './Navbar.css';

// ---- Courses mega-menu data ------------------------------------------------
const COURSE_COLUMNS = [
  {
    key: 'development',
    title: 'Development',
    icon: Code2,
    items: [
      { num: 1, label: 'Full Stack Development', desc: 'MERN, REST APIs & deployment', icon: Monitor, color: 'text-sky-400', badge: 'Popular' },
      { num: 2, label: 'MERN Stack Development', desc: 'MongoDB, Express, React, Node', icon: Database, color: 'text-emerald-400' },
      { num: 3, label: 'Java Development', desc: 'Core Java to Spring Boot', icon: Coffee, color: 'text-amber-400' },
      { num: 4, label: 'C / C++ Programming', desc: 'DSA & systems fundamentals', icon: Cpu, color: 'text-violet-400' },
      { num: 5, label: 'Web Development', desc: 'HTML, CSS & modern JS', icon: Globe2, color: 'text-blue-400' },
    ],
  },
  {
    key: 'data-ai',
    title: 'Data & AI',
    icon: BarChart3,
    items: [
      { num: 6, label: 'AI / ML', desc: 'Models, training & deployment', icon: Bot, color: 'text-purple-400', badge: 'Popular' },
      { num: 7, label: 'Data Science', desc: 'Statistics, EDA & storytelling', icon: TrendingUp, color: 'text-orange-400' },
      { num: 8, label: 'Python Development', desc: 'Scripting, backend & automation', icon: Terminal, color: 'text-yellow-400' },
      { num: 9, label: 'Cyber Security', desc: 'Network & app security basics', icon: ShieldCheck, color: 'text-cyan-400' },
      { num: 10, label: 'Data Analytics', desc: 'SQL, dashboards & reporting', icon: Database, color: 'text-fuchsia-400' },
    ],
  },
  {
    key: 'design-other',
    title: 'Design & Other',
    icon: Palette,
    items: [
      { num: 11, label: 'UI / UX Design', desc: 'Figma, wireframes & prototyping', icon: PenTool, color: 'text-pink-400', badge: 'Popular' },
      { num: 12, label: 'Graphic Design', desc: 'Visual identity & branding', icon: Sparkles, color: 'text-orange-400' },
      { num: 13, label: 'Digital Marketing', desc: 'SEO, ads & social growth', icon: Megaphone, color: 'text-sky-400' },
    ],
  },
];

// Hover-intent timing
const OPEN_DELAY = 60;
const CLOSE_DELAY = 220;

const panelVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.035, delayChildren: 0.03 },
  },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12, ease: 'easeIn' } },
};

const columnVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

// Per-item entrance, staggered inside each column
const itemListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } },
};

// Subtle icon-chip "pop" on row hover — restrained, no bounce
const iconChipVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } },
};

const CoursesDropdown = ({ onNavigate, id, onMouseEnter, onMouseLeave }) => (
  <motion.div
    id={id}
    role="menu"
    variants={panelVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className="
      absolute left-1/2 top-full z-50 mt-3 flex w-[94vw] max-w-[1000px] -translate-x-1/2
      flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a1626]
      shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65)]
      sm:w-[90vw] md:w-[88vw] lg:w-[min(80vw,1000px)]
    "
    style={{ maxHeight: 'min(80vh, 640px)' }}
  >
    <motion.div
      className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[#00d68f]/0 via-[#00d68f] to-[#00d68f]/0"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'center' }}
    />

    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 lg:gap-x-8 lg:p-7">
        {COURSE_COLUMNS.map((col, colIdx) => (
          <motion.div
            key={col.key}
            variants={columnVariants}
            className={`
              ${colIdx > 0 ? 'sm:border-l sm:border-white/[0.06] sm:pl-6 lg:pl-8' : ''}
              ${colIdx === 2 ? 'sm:col-span-2 sm:border-l-0 sm:border-t sm:border-white/[0.06] sm:pl-0 sm:pt-6 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0' : ''}
            `}
          >
            <div className="mb-4 flex items-center gap-2 text-[#00d68f]">
              <col.icon size={15} strokeWidth={2.25} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                {col.title}
              </span>
            </div>

            <motion.div variants={itemListVariants} className="flex flex-col gap-1">
              {col.items.map((item) => (
                <motion.button
                  key={item.num}
                  variants={itemVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.985 }}
                  role="menuitem"
                  onClick={() => onNavigate(item)}
                  className="
                    group/item relative flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5
                    text-left transition-colors duration-150
                    hover:bg-white/[0.05] focus-visible:bg-white/[0.05]
                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00d68f]/50
                  "
                >
                  <motion.span
                    variants={iconChipVariants}
                    className={`
                      mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                      bg-white/[0.04] ${item.color}
                      group-hover/item:bg-white/[0.08]
                    `}
                    style={{ transition: 'background-color 150ms' }}
                  >
                    <item.icon size={15} strokeWidth={2} />
                  </motion.span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[13.5px] font-medium text-white/90 group-hover/item:text-white">
                        {item.num}. {item.label}
                      </span>
                      {item.badge && (
                        <span className="shrink-0 rounded-full bg-[#00d68f]/15 px-1.5 py-[1px] text-[9.5px] font-semibold tracking-wide text-[#00d68f]">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[11.5px] text-white/40">
                      {item.desc}
                    </span>
                  </span>

                  <ChevronRight
                    size={14}
                    className="mt-1.5 shrink-0 text-white/20 opacity-0 transition-all duration-150 group-hover/item:translate-x-0.5 group-hover/item:text-white/50 group-hover/item:opacity-100"
                  />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>

    <motion.div
      variants={columnVariants}
      className="
        flex shrink-0 flex-col items-start justify-between gap-4 border-t border-white/[0.06]
        bg-white/[0.015] px-5 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5 lg:px-7
      "
    >
      <div className="flex items-center gap-3">
        <motion.span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00d68f]/10 text-[#00d68f]"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Rocket size={16} />
        </motion.span>
        <div>
          <p className="text-[13.5px] font-semibold text-white">
            Can&rsquo;t decide which course is right for you?
          </p>
          <p className="text-[11.5px] text-white/45">
            Answer a few questions and we&rsquo;ll suggest the perfect course for your goals.
          </p>
        </div>
      </div>

      <motion.button
        onClick={() => onNavigate({ findMyCourse: true })}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="
          group/cta flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#00d68f] px-4 py-2.5
          text-[13px] font-semibold text-[#04160f] shadow-sm shadow-[#00d68f]/20
          transition-shadow duration-150 hover:brightness-110 hover:shadow-md hover:shadow-[#00d68f]/25
          sm:w-auto
        "
      >
        Find My Course
        <ChevronRight size={15} className="transition-transform duration-150 group-hover/cta:translate-x-0.5" />
      </motion.button>
    </motion.div>
  </motion.div>
);

// -----------------------------------------------------------------------------

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [internshipsOpen, setInternshipsOpen] = useState(false);
  const [mobileInternshipsOpen, setMobileInternshipsOpen] = useState(false);
  const internshipsRef = useRef(null);
  const internshipsCloseTimer = useRef(null);
  const [canHover, setCanHover] = useState(false);
  const coursesRef = useRef(null);
  const coursesTriggerRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detect true hover-capable pointers (desktop/laptop) vs touch devices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mq.matches);
    const listener = (e) => setCanHover(e.matches);
    mq.addEventListener ? mq.addEventListener('change', listener) : mq.addListener(listener);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', listener) : mq.removeListener(listener);
    };
  }, []);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const openCourses = useCallback(() => {
    clearTimers();
    openTimer.current = setTimeout(() => setCoursesOpen(true), OPEN_DELAY);
  }, []);

  const scheduleCloseCourses = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setCoursesOpen(false), CLOSE_DELAY);
  }, []);

  useEffect(() => clearTimers, []);

  // Close the Courses dropdown on outside click / Escape, restore focus on Escape
  useEffect(() => {
    const onClick = (e) => {
      if (coursesRef.current && !coursesRef.current.contains(e.target)) {
        setCoursesOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && coursesOpen) {
        clearTimers();
        setCoursesOpen(false);
        coursesTriggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [coursesOpen]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setCoursesOpen(false);
    const NAV_H = 74;
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - NAV_H;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(doScroll, 400);
    } else {
      doScroll();
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const handleCourseNavigate = useCallback((item) => {
    clearTimers();
    setCoursesOpen(false);
    setMenuOpen(false);
    if (item.findMyCourse) {
      navigate('/find-my-course');
      return;
    }
    navigate(`/courses/${item.key || item.label.toLowerCase().replace(/[\s/]+/g, '-')}`);
  }, [navigate]);

  const handleTriggerClick = () => {
    clearTimers();
    setCoursesOpen((o) => !o);
  };

  const openInternships = useCallback(() => {
    if (internshipsCloseTimer.current) clearTimeout(internshipsCloseTimer.current);
    setInternshipsOpen(true);
  }, []);
  const scheduleCloseInternships = useCallback(() => {
    if (internshipsCloseTimer.current) clearTimeout(internshipsCloseTimer.current);
    internshipsCloseTimer.current = setTimeout(() => setInternshipsOpen(false), 200);
  }, []);

  const INTERNSHIP_COLUMNS = [
    {
      key: 'projects', title: 'Projects', icon: Code2,
      items: [
        { label: 'Live Client Projects', desc: 'Work on real projects from WeNexa', icon: Briefcase },
        { label: 'Portfolio Building', desc: 'Ship work you can show employers', icon: Award },
      ],
      target: 'projects',
    },
    {
      key: 'placement', title: 'Placement', icon: Users,
      items: [
        { label: 'Stipend & Earnings', desc: '75% of project value goes to students', icon: TrendingUp },
        { label: 'Career Support', desc: 'Mentor-guided growth into full-time roles', icon: Rocket },
      ],
      target: 'home',
    },
  ];

  const NAV_LINKS = [
    { label: 'Courses',      id: 'courses', dropdown: true },
    { label: 'Internships',  id: 'internships', simpleDropdown: true },
    { label: 'Events',       id: 'journey', scrollTo: true },
    { label: 'Blog',         id: 'blog', isRoute: true },
    { label: 'About Us',     id: 'about', isRoute: true },
    { label: 'Contact',      id: 'contact', scrollTo: true },
  ];

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="nav-inner">
        <Link to="/" className="logo-link">
          <img src="/welogo.png" alt="WeIntern" className="nav-logo" />
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map(l => {
            if (l.dropdown) {
              return (
                <li
                  key={l.id}
                  ref={coursesRef}
                  className="relative"
                  onMouseEnter={canHover ? openCourses : undefined}
                  onMouseLeave={canHover ? scheduleCloseCourses : undefined}
                >
                  <button
                    ref={coursesTriggerRef}
                    className="nav-link relative inline-flex items-center gap-1"
                    onClick={handleTriggerClick}
                    onFocus={openCourses}
                    aria-expanded={coursesOpen}
                    aria-haspopup="menu"
                    aria-controls="courses-mega-menu"
                  >
                    <span className={coursesOpen ? 'text-[#00d68f]' : ''}>{l.label}</span>
                    <motion.span
                      animate={{ rotate: coursesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="flex"
                    >
                      <ChevronDown size={14} className={coursesOpen ? 'text-[#00d68f]' : ''} />
                    </motion.span>
                    <motion.span
                      className="absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#00d68f]"
                      initial={false}
                      animate={{ width: coursesOpen ? '100%' : '0%', opacity: coursesOpen ? 1 : 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </button>
                  <AnimatePresence>
                    {coursesOpen && (
                      <CoursesDropdown
                        id="courses-mega-menu"
                        onNavigate={handleCourseNavigate}
                        onMouseEnter={canHover ? openCourses : undefined}
                        onMouseLeave={canHover ? scheduleCloseCourses : undefined}
                      />
                    )}
                  </AnimatePresence>
                </li>
              );
            }
            if (l.simpleDropdown) {
              return (
                <li
                  key={l.id}
                  ref={internshipsRef}
                  className="relative"
                  onMouseEnter={canHover ? openInternships : undefined}
                  onMouseLeave={canHover ? scheduleCloseInternships : undefined}
                >
                  <button
                    className="nav-link relative inline-flex items-center gap-1"
                    onClick={() => setInternshipsOpen((o) => !o)}
                    aria-expanded={internshipsOpen}
                    aria-haspopup="menu"
                  >
                    <span className={internshipsOpen ? 'text-[#00d68f]' : ''}>{l.label}</span>
                    <ChevronDown size={14} className={internshipsOpen ? 'text-[#00d68f]' : ''} style={{ transform: internshipsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                  </button>
                  <AnimatePresence>
                    {internshipsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.16 }}
                        className="internships-dropdown"
                        onMouseEnter={canHover ? openInternships : undefined}
                        onMouseLeave={canHover ? scheduleCloseInternships : undefined}
                      >
                        {INTERNSHIP_COLUMNS.map((col) => (
                          <div className="internships-col" key={col.key}>
                            <div className="internships-col-head">
                              <col.icon size={14} strokeWidth={2.25} />
                              <span>{col.title}</span>
                            </div>
                            {col.items.map((item) => (
                              <button
                                key={item.label}
                                className="internships-item"
                                onClick={() => { setInternshipsOpen(false); col.target === 'home' ? navigate('/') : scrollTo(col.target); }}
                              >
                                <span className="internships-item-icon"><item.icon size={14} /></span>
                                <span>
                                  <span className="internships-item-label">{item.label}</span>
                                  <span className="internships-item-desc">{item.desc}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            }
            return (
              <li key={l.id}>
                {l.isRoute ? (
                  <Link to={`/${l.id}`} className="nav-link">
                    {l.label}
                  </Link>
                ) : (
                  <button className="nav-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="nav-ctas">
          {user ? (
            <>
              <div className="nav-user-info">
                <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
                <span className="nav-user-type">
                  {user.role === 'admin' ? 'Admin' : 'Student'}
                </span>
              </div>
              {user.role === 'admin'
                ? <Link to="/admin" className="btn btn-outline" style={{fontSize:'.82rem',padding:'.5rem 1rem'}}>⚙️ Admin</Link>
                : <Link to="/dashboard" className="btn btn-outline" style={{fontSize:'.82rem',padding:'.5rem 1rem'}}>Dashboard</Link>
              }
              <button onClick={handleLogout} className="btn btn-outline" style={{fontSize:'.82rem',padding:'.5rem 1rem'}}>Logout</button>
            </>
          ) : (
            <>
              <div className="nav-students-count">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>4k+ Students</span>
              </div>
              <div className="nav-for-biz">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <span>For Businesses</span>
              </div>
              <Link to="/login" className="btn-nav-login">Login / Sign Up</Link>
            </>
          )}
        </div>

        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="mobile-menu overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 74px)' }}
          >
            {NAV_LINKS.map(l => {
              if (l.dropdown) {
                return (
                  <div key={l.id} className="flex flex-col">
                    <button
                      className="mobile-nav-link inline-flex items-center justify-between"
                      onClick={() => setMobileCoursesOpen((o) => !o)}
                      aria-expanded={mobileCoursesOpen}
                    >
                      {l.label}
                      <motion.span
                        animate={{ rotate: mobileCoursesOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex"
                      >
                        <ChevronDown size={16} />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {mobileCoursesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18, ease: 'easeInOut' }}
                          className="overflow-hidden px-3 pb-4 pt-1 sm:px-4"
                        >
                          <motion.div
                            variants={{
                              hidden: {},
                              visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                            }}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4"
                          >
                            {COURSE_COLUMNS.map((col) => (
                              <motion.div
                                key={col.key}
                                variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } } }}
                              >
                                <div className="mb-2 flex items-center gap-2 text-[#00d68f]">
                                  <col.icon size={14} strokeWidth={2.25} />
                                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                                    {col.title}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  {col.items.map((item) => (
                                    <motion.button
                                      key={item.num}
                                      onClick={() => handleCourseNavigate(item)}
                                      whileTap={{ scale: 0.97 }}
                                      transition={{ duration: 0.1 }}
                                      className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-left text-sm text-white/90 active:bg-white/[0.06]"
                                    >
                                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04] ${item.color}`}>
                                        <item.icon size={14} />
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="flex items-center gap-2">
                                          <span className="truncate">{item.num}. {item.label}</span>
                                          {item.badge && (
                                            <span className="shrink-0 rounded-full bg-[#00d68f]/15 px-1.5 py-0.5 text-[9px] font-semibold text-[#00d68f]">
                                              {item.badge}
                                            </span>
                                          )}
                                        </span>
                                      </span>
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                            <motion.button
                              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } } }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleCourseNavigate({ findMyCourse: true })}
                              className="flex items-center justify-center gap-2 rounded-lg bg-[#00d68f] px-4 py-2.5 text-sm font-semibold text-[#04160f]"
                            >
                              <Rocket size={15} />
                              Find My Course
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              if (l.simpleDropdown) {
                return (
                  <div key={l.id} className="flex flex-col">
                    <button
                      className="mobile-nav-link inline-flex items-center justify-between"
                      onClick={() => setMobileInternshipsOpen((o) => !o)}
                      aria-expanded={mobileInternshipsOpen}
                    >
                      {l.label}
                      <ChevronDown size={16} style={{ transform: mobileInternshipsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                    </button>
                    <AnimatePresence>
                      {mobileInternshipsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden px-3 pb-4 pt-1 sm:px-4"
                        >
                          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                            {INTERNSHIP_COLUMNS.map((col) => (
                              <div key={col.key}>
                                <div className="mb-2 flex items-center gap-2 text-[#00d68f]">
                                  <col.icon size={14} strokeWidth={2.25} />
                                  <span className="text-[11px] font-semibold uppercase tracking-wider">{col.title}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  {col.items.map((item) => (
                                    <button
                                      key={item.label}
                                      onClick={() => { setMenuOpen(false); setMobileInternshipsOpen(false); col.target === 'home' ? navigate('/') : scrollTo(col.target); }}
                                      className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-left text-sm text-white/90 active:bg-white/[0.06]"
                                    >
                                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
                                        <item.icon size={14} />
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="block truncate">{item.label}</span>
                                        <span className="block truncate text-xs text-white/50">{item.desc}</span>
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return l.isRoute ? (
                <Link key={l.id} to={`/${l.id}`} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  {l.label}
                </Link>
              ) : (
                <button key={l.id} className="mobile-nav-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
              );
            })}
            {user ? (
              <>
                {user.role === 'admin'
                  ? <Link to="/admin" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Admin Panel</Link>
                  : <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Dashboard</Link>
                }
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mobile-cta-btn">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="mobile-cta-btn">Login / Sign Up</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
FILEEOF9

echo "[10/10] Writing frontend/src/App.jsx ..."
mkdir -p "frontend/src"
cat > "frontend/src/App.jsx" << 'FILEEOF10'
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';

// Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import { LoginPage, RegisterPage, OTPPage, ForgotPasswordPage, ResetPasswordPage, AuthCallback } from './components/Auth/AuthPages';
import Dashboard from './components/Dashboard/Dashboard';
import Admin from './components/Admin/Admin';
import CoursePage from './pages/CoursePage';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Global styles
import './styles/global.css';
import OAuthCallback from './components/Auth/OAuthCallback';
import StudentProjects from './components/Sections/StudentProjects';
import TestimonialsSection from './components/Sections/Testimonials';
import { useSanitySEO } from './hooks/useSanity';
import { CoursesProvider } from './context/CoursesContext';

// WhatsApp float
const WAFloat = () => (
  <a href="https://wa.me/917414974582" className="wa-float" target="_blank" rel="noreferrer" title="Chat on WhatsApp">
    <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  </a>
);

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--cream)' }}>
      <div style={{ width:44, height:44, border:'3px solid #e8a820', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

// Layout wrapper with nav + footer
const WithLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WAFloat />
    </>
  );
};

// Auth pages (no footer)
const AuthLayout = ({ children }) => (
  <>
    {children}
  </>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public with layout */}
      <Route path="/" element={<WithLayout><Home /></WithLayout>} />
      
      {/* Course detail page - standalone, opens in a new tab */}
      <Route path="/courses/:slug" element={<CoursePage />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

      {/* About Us - standalone page without footer */}
      <Route path="/about" element={<AboutUs />} />

      {/* Auth pages */}
      <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
      <Route path="/verify-otp" element={<AuthLayout><OTPPage /></AuthLayout>} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
      <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


const SEOHead = () => {
  const { seo } = useSanitySEO();
  useEffect(() => {
    if (!seo) return;
    if (seo.siteTitle) document.title = seo.siteTitle;
    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
      el.content = content;
    };
    const setOG = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
      el.content = content;
    };
    if (seo.siteDescription) setMeta('description', seo.siteDescription);
    if (seo.keywords) setMeta('keywords', seo.keywords);
    if (seo.ogTitle) setOG('og:title', seo.ogTitle);
    if (seo.ogDescription) setOG('og:description', seo.ogDescription);
  }, [seo]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <CoursesProvider>
        <SEOHead />
        <AuthProvider>
          <AdminProvider>
            <AppRoutes />
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4500,
                style: { 
                  fontFamily: "'DM Sans', sans-serif", 
                  fontWeight: 600, 
                  borderRadius: 10, 
                  fontSize: '.9rem',
                  maxWidth: '500px',
                  padding: '0.9rem 1.2rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                },
                success: { 
                  iconTheme: { primary: '#E8A820', secondary: '#1B2A4A' },
                  style: {
                    background: 'white',
                    color: '#1B2A4A',
                    border: '2px solid #E8A820'
                  }
                },
                error: {
                  style: {
                    background: '#dc4545',
                    color: 'white',
                    fontWeight: 700
                  }
                }
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </AdminProvider>
        </AuthProvider>
      </CoursesProvider>
    </BrowserRouter>
  );
}

export default App;
FILEEOF10

echo ""
echo "Done. Next steps:"
echo "   1. Restart your backend (Node process) so the new /api/blog routes load."
echo "   2. cd frontend && npm start"
echo "   3. Log in as an admin -> Admin panel -> Blog tab -> New Post to publish one."
echo "   4. Visit /blog on the site to see it listed (all posts stay there permanently"
echo "      as your blog history unless you delete them from the admin panel)."
echo ""
echo "To deploy:"
echo "   git add ."
echo "   git commit -m \"feat: add blog (admin post + public history), fix internships routing\""
echo "   git push origin main"
echo ""
echo "IMPORTANT for production: after pushing to main, also pull/redeploy the backend"
echo "on your MilesWeb server (SSH + restart the Node app) so /api/blog exists there too."
