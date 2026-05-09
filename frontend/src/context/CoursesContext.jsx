import React, { createContext, useContext, useState, useEffect } from 'react';

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

export const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_COURSES;
    } catch { return DEFAULT_COURSES; }
  });

  // Persist every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  const COLOR_PRESETS = [
    {h1:'#e76f51',h2:'#f4a261'},{h1:'#2a9d8f',h2:'#264653'},
    {h1:'#6c3483',h2:'#a569bd'},{h1:'#1a6b8a',h2:'#2196f3'},
    {h1:'#c0392b',h2:'#e74c3c'},{h1:'#e67e22',h2:'#f39c12'},
    {h1:'#1e8449',h2:'#27ae60'},{h1:'#2c3e50',h2:'#3498db'},
  ];

  const normalizeTools = (tools) => {
    if (Array.isArray(tools)) return tools.map(t => t.trim()).filter(Boolean);
    if (typeof tools === 'string') return tools.split(',').map(t => t.trim()).filter(Boolean);
    return [];
  };

  const addCourse = (form, colorIdx = 0) => {
    const newCourse = {
      id: Date.now(),
      emoji: form.emoji || '🎓',
      title: form.title,
      desc: form.desc || form.tagline || form.about || '',
      tagline: form.tagline || '',
      about: form.about || '',
      duration: form.duration,
      level: form.level || 'beginner',
      tools: normalizeTools(form.tools),
      price: Number(form.price),
      colors: COLOR_PRESETS[colorIdx] || COLOR_PRESETS[0],
      language: form.language || 'English + Hindi',
      status: 'active',
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (id, form, colorIdx) => {
    setCourses(prev => prev.map(c => c.id === id ? {
      ...c,
      emoji: form.emoji || c.emoji,
      title: form.title || c.title,
      desc: form.desc || form.tagline || c.desc,
      tagline: form.tagline || c.tagline,
      about: form.about || c.about,
      duration: form.duration || c.duration,
      level: form.level || c.level,
      tools: normalizeTools(form.tools) || c.tools,
      price: Number(form.price) || c.price,
      colors: colorIdx !== undefined ? COLOR_PRESETS[colorIdx] : c.colors,
      language: form.language || c.language,
    } : c));
  };

  const deleteCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id));

  const toggleStatus = (id) => {
    setCourses(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ));
  };

  const activeCourses = courses.filter(c => c.status === 'active');

  return (
    <CoursesContext.Provider value={{
      courses, activeCourses, addCourse, updateCourse, deleteCourse, toggleStatus, COLOR_PRESETS
    }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error('useCourses must be used within CoursesProvider');
  return ctx;
};
