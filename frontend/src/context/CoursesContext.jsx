import React, { createContext, useContext, useState, useEffect } from 'react';
import { client, QUERIES } from '../utils/sanityClient';

const STORAGE_KEY = 'weintern_courses_v2';

const DEFAULT_COURSES = [
  { id:1, emoji:'🌐', title:'Full Stack Web Development', desc:'Build production-grade websites from scratch. HTML to React, Node.js to deployment — 4 real client projects included.', duration:'12 Weeks', level:'beginner', tools:['HTML/CSS','JavaScript','React','Node.js','MongoDB'], price:4999, colors:{h1:'#e76f51',h2:'#f4a261'}, status:'active' },
  { id:2, emoji:'📱', title:'Mobile App Development', desc:'Design and ship cross-platform apps. Learn Flutter and build apps that go live on the Play Store and App Store.', duration:'10 Weeks', level:'intermediate', tools:['Flutter','Dart','Firebase','REST APIs','Android/iOS'], price:5999, colors:{h1:'#2a9d8f',h2:'#264653'}, status:'active' },
  { id:3, emoji:'🤖', title:'AI & Automation', desc:'Master AI tools, LLMs, and workflow automation. Build chatbots, AI pipelines, and smart automations for real businesses.', duration:'8 Weeks', level:'intermediate', tools:['Python','OpenAI API','LangChain','n8n','Make'], price:6499, colors:{h1:'#6c3483',h2:'#a569bd'}, status:'active' },
  { id:4, emoji:'☁️', title:'Cloud Solutions & DevOps', desc:'Learn cloud infrastructure, containerization, CI/CD pipelines, and deploy scalable systems.', duration:'10 Weeks', level:'intermediate', tools:['AWS','Docker','Kubernetes','CI/CD','Linux'], price:5499, colors:{h1:'#1a6b8a',h2:'#2196f3'}, status:'active' },
  { id:5, emoji:'🎨', title:'UI/UX Design', desc:'From wireframes to pixel-perfect interfaces. Learn design thinking, user research, and prototyping.', duration:'8 Weeks', level:'beginner', tools:['Figma','Adobe XD','Prototyping','User Research','Design Systems'], price:3999, colors:{h1:'#c0392b',h2:'#e74c3c'}, status:'active' },
  { id:6, emoji:'📢', title:'Digital Marketing', desc:'Master SEO, social media, paid ads, email campaigns, and content strategy. Run real campaigns.', duration:'6 Weeks', level:'beginner', tools:['Google Ads','Meta Ads','SEO','Canva','Analytics'], price:2999, colors:{h1:'#e67e22',h2:'#f39c12'}, status:'active' },
  { id:7, emoji:'📊', title:'Data Science & Analytics', desc:'Turn raw data into business decisions. Data cleaning, visualization, machine learning, and pipelines.', duration:'12 Weeks', level:'intermediate', tools:['Python','Pandas','Scikit-learn','Tableau','SQL'], price:6999, colors:{h1:'#1e8449',h2:'#27ae60'}, status:'active' },
];

const CoursesContext = createContext(null);

const normTools = (t) => {
  if (Array.isArray(t)) return t.map(x => x.trim()).filter(Boolean);
  if (typeof t === 'string') return t.split(',').map(x => x.trim()).filter(Boolean);
  return [];
};

export const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) { const p = JSON.parse(saved); if (Array.isArray(p) && p.length) return p; }
    } catch {}
    return DEFAULT_COURSES;
  });

  // Try fetching from Sanity on mount — merge with local
  useEffect(() => {
    client && client.fetch(QUERIES.courses)
      .then(sanityCourses => { if (!sanityCourses) return;
        if (!sanityCourses || sanityCourses.length === 0) return;
        // Convert Sanity format to our format
        const converted = sanityCourses.map(c => ({
          id: c._id,
          emoji: c.emoji || '🎓',
          title: c.title,
          desc: c.description || c.tagline || '',
          tagline: c.tagline || '',
          about: c.about || '',
          duration: c.duration || '',
          level: c.level || 'beginner',
          tools: normTools(c.tools),
          price: c.price || 0,
          colors: { h1: c.colorH1 || '#1B2A4A', h2: c.colorH2 || '#243659' },
          language: c.language || 'English + Hindi',
          status: 'active',
          fromSanity: true,
        }));
        // Merge: Sanity courses replace matching local ones, add new ones
        setCourses(prev => {
          const localOnly = prev.filter(lc =>
            !converted.find(sc => sc.title === lc.title) && !lc.fromSanity
          );
          return [...localOnly, ...converted];
        });
      })
      .catch(() => {}); // Silently fail - use local data
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { const u = JSON.parse(e.newValue); if (Array.isArray(u)) setCourses(u); } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const COLOR_PRESETS = [
    {h1:'#e76f51',h2:'#f4a261'},{h1:'#2a9d8f',h2:'#264653'},
    {h1:'#6c3483',h2:'#a569bd'},{h1:'#1a6b8a',h2:'#2196f3'},
    {h1:'#c0392b',h2:'#e74c3c'},{h1:'#e67e22',h2:'#f39c12'},
    {h1:'#1e8449',h2:'#27ae60'},{h1:'#2c3e50',h2:'#3498db'},
  ];

  const addCourse = (form, colorIdx = 0) => {
    const c = { id:Date.now(), emoji:form.emoji||'🎓', title:form.title, desc:form.desc||form.tagline||form.about||'', tagline:form.tagline||'', about:form.about||'', duration:form.duration, level:form.level||'beginner', tools:normTools(form.tools), price:Number(form.price), colors:COLOR_PRESETS[colorIdx]||COLOR_PRESETS[0], language:form.language||'English + Hindi', status:'active' };
    setCourses(prev => { const u=[...prev,c]; localStorage.setItem(STORAGE_KEY,JSON.stringify(u)); return u; });
    return c;
  };

  const updateCourse = (id, form, colorIdx) => {
    setCourses(prev => {
      const u = prev.map(c => c.id===id ? { ...c, emoji:form.emoji||c.emoji, title:form.title||c.title, desc:form.desc||form.tagline||c.desc, tagline:form.tagline||c.tagline, about:form.about||c.about, duration:form.duration||c.duration, level:form.level||c.level, tools:normTools(form.tools).length?normTools(form.tools):c.tools, price:Number(form.price)||c.price, colors:colorIdx!==undefined?COLOR_PRESETS[colorIdx]:c.colors, language:form.language||c.language } : c);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); return u;
    });
  };

  const deleteCourse = (id) => {
    setCourses(prev => { const u=prev.filter(c=>c.id!==id); localStorage.setItem(STORAGE_KEY,JSON.stringify(u)); return u; });
  };

  const toggleStatus = (id) => {
    setCourses(prev => { const u=prev.map(c=>c.id===id?{...c,status:c.status==='active'?'inactive':'active'}:c); localStorage.setItem(STORAGE_KEY,JSON.stringify(u)); return u; });
  };

  return (
    <CoursesContext.Provider value={{ courses, activeCourses:courses.filter(c=>c.status==='active'), addCourse, updateCourse, deleteCourse, toggleStatus, COLOR_PRESETS }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error('useCourses must be used within CoursesProvider');
  return ctx;
};
