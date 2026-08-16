#!/bin/bash
set -e

# ============================================================
# WeIntern - Fix Courses mega-menu routing (properly this time)
# The fuzzy-match fix from before got overwritten by later navbar
# rewrites. Re-applying it on top of the current Navbar.jsx.
# Run from your project ROOT:
#   cd ~/path/to/WeInternFr
#   bash fix-courses-menu-routing.sh
# ============================================================

SRC="frontend/src"

if [ ! -f "$SRC/components/Layout/Navbar.jsx" ]; then
  echo "Cannot find $SRC/components/Layout/Navbar.jsx -- run this from your project root."
  exit 1
fi

echo "Writing Navbar.jsx ..."
cat > "$SRC/components/Layout/Navbar.jsx" << 'NAVJSXEOF'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CoursesContext';
import { slugify } from '../../data/courseExtras';
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
      { num: 1, label: 'Full Stack Development', desc: 'MERN, REST APIs & deployment', icon: Monitor, color: 'text-amber-300', badge: 'Popular' },
      { num: 2, label: 'MERN Stack Development', desc: 'MongoDB, Express, React, Node', icon: Database, color: 'text-emerald-400' },
      { num: 3, label: 'Java Development', desc: 'Core Java to Spring Boot', icon: Coffee, color: 'text-amber-400' },
      { num: 4, label: 'C / C++ Programming', desc: 'DSA & systems fundamentals', icon: Cpu, color: 'text-orange-400' },
      { num: 5, label: 'Web Development', desc: 'HTML, CSS & modern JS', icon: Globe2, color: 'text-orange-300' },
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
      { num: 9, label: 'Cyber Security', desc: 'Network & app security basics', icon: ShieldCheck, color: 'text-yellow-500' },
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
      { num: 13, label: 'Digital Marketing', desc: 'SEO, ads & social growth', icon: Megaphone, color: 'text-amber-500' },
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
  const { activeCourses } = useCourses();
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

  // Match a mega-menu label (e.g. "AI / ML") to a real course from
  // CoursesContext (e.g. "AI & Automation") by word overlap, since the
  // menu's display names don't always exactly match course titles.
  const findRealCourse = useCallback((label) => {
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const targetWords = norm(label).split(' ').filter((w) => w.length > 2);
    let best = null, bestScore = 0;
    (activeCourses || []).forEach((c) => {
      const title = norm(c.title);
      let score = 0;
      targetWords.forEach((w) => { if (title.includes(w)) score++; });
      if (score > bestScore) { bestScore = score; best = c; }
    });
    return bestScore > 0 ? best : null;
  }, [activeCourses]);

  const handleCourseNavigate = useCallback((item) => {
    clearTimers();
    setCoursesOpen(false);
    setMenuOpen(false);
    if (item.findMyCourse) {
      scrollTo('courses');
      return;
    }
    const match = findRealCourse(item.label);
    if (match) {
      navigate(`/courses/${slugify(match.title)}`);
    } else {
      // No live course matches this menu item yet -- send them to the
      // courses section instead of a broken/404 course page.
      scrollTo('courses');
    }
  }, [navigate, findRealCourse]);

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
NAVJSXEOF

echo ""
echo "Done. cd frontend && npm start"
echo "Click Courses in the navbar, then click any of the 13 items -- each should"
echo "open its matching real course page (e.g. 'AI / ML' -> 'AI & Automation')."
echo "Items with no live course match yet scroll to the courses section instead"
echo "of showing a broken/404 page."
echo ""
echo "To deploy:"
echo "   git add ."
echo "   git commit -m \"fix: re-apply fuzzy-match routing for courses mega-menu\""
echo "   git push origin main"
