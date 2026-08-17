// Generated helper data for the per-course detail page.
// PLACEHOLDER CONTENT still to REPLACE ME: mentor emails, the dummy demo
// video, and material download URLs. Search for "REPLACE ME" markers.

export const slugify = (str = '') =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

const hashStr = (str = '') =>
  str.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

// ── Tech / tool icon lookup (used in "Skills You Will Master") ──
// Falls back to a generic code icon if a tool name isn't recognized.
const TECH_ICON_MAP = {
  html: 'logos:html-5', html5: 'logos:html-5',
  css: 'logos:css-3', css3: 'logos:css-3',
  javascript: 'logos:javascript', js: 'logos:javascript',
  'javascript es6+': 'logos:javascript', 'javascript es6': 'logos:javascript',
  typescript: 'logos:typescript-icon', ts: 'logos:typescript-icon',
  react: 'logos:react', 'react.js': 'logos:react', reactjs: 'logos:react',
  'react native': 'logos:react',
  vue: 'logos:vue', 'vue.js': 'logos:vue',
  angular: 'logos:angular-icon',
  node: 'logos:nodejs-icon', 'node.js': 'logos:nodejs-icon', nodejs: 'logos:nodejs-icon',
  express: 'simple-icons:express', 'express.js': 'simple-icons:express', expressjs: 'simple-icons:express',
  mongodb: 'logos:mongodb-icon', mongo: 'logos:mongodb-icon',
  mysql: 'logos:mysql', postgresql: 'logos:postgresql', postgres: 'logos:postgresql',
  firebase: 'logos:firebase',
  python: 'logos:python',
  django: 'logos:django-icon', flask: 'logos:flask',
  java: 'logos:java',
  'c++': 'logos:c-plusplus', cpp: 'logos:c-plusplus', 'c/c++': 'logos:c-plusplus',
  c: 'logos:c', 'c language': 'logos:c',
  kotlin: 'logos:kotlin-icon',
  swift: 'logos:swift',
  flutter: 'logos:flutter',
  dart: 'logos:dart',
  android: 'logos:android-icon', 'android studio': 'mdi:android-studio',
  ios: 'mdi:apple', xcode: 'mdi:apple',
  'rest apis': 'mdi:api', 'rest api': 'mdi:api', api: 'mdi:api',
  git: 'logos:git-icon', github: 'mdi:github', 'github actions': 'mdi:github',
  docker: 'logos:docker-icon',
  kubernetes: 'logos:kubernetes',
  aws: 'logos:aws',
  azure: 'logos:microsoft-azure',
  'google cloud': 'logos:google-cloud', gcp: 'logos:google-cloud',
  'cloud deployment': 'mdi:cloud-upload',
  vercel: 'logos:vercel-icon',
  postman: 'logos:postman-icon',
  terraform: 'logos:terraform-icon',
  nginx: 'logos:nginx',
  cloudwatch: 'mdi:cloud-check',
  'play console': 'mdi:google-play',
  figma: 'logos:figma',
  'adobe xd': 'logos:adobe-xd', xd: 'logos:adobe-xd',
  photoshop: 'logos:adobe-photoshop',
  illustrator: 'logos:adobe-illustrator',
  tailwind: 'logos:tailwindcss-icon', 'tailwind css': 'logos:tailwindcss-icon',
  bootstrap: 'logos:bootstrap',
  redux: 'logos:redux',
  graphql: 'logos:graphql',
  jenkins: 'logos:jenkins',
  linux: 'logos:linux-tux',
  'openai api': 'simple-icons:openai', openai: 'simple-icons:openai',
  langchain: 'mdi:link-variant',
  'n8n': 'mdi:workflow',
  'make.com': 'mdi:auto-fix',
  pinecone: 'mdi:pine-tree',
  fastapi: 'simple-icons:fastapi',
  'google ads': 'logos:google-ads', seo: 'mdi:magnify-scan',
  'google analytics': 'logos:google-analytics',
  excel: 'logos:microsoft-excel', 'power bi': 'logos:microsoft-power-bi',
  tableau: 'logos:tableau-icon',
  pandas: 'logos:pandas', numpy: 'logos:numpy',
  matplotlib: 'mdi:chart-line', 'matplotlib.pyplot': 'mdi:chart-line',
  seaborn: 'mdi:chart-box-outline',
  'scikit-learn': 'devicon:scikitlearn', sklearn: 'devicon:scikitlearn',
  sql: 'mdi:database', mysql: 'logos:mysql', postgresql: 'logos:postgresql', postgres: 'logos:postgresql',
  jupyter: 'mdi:notebook', 'jupyter notebook': 'mdi:notebook',
  tensorflow: 'logos:tensorflow', pytorch: 'logos:pytorch-icon',
  'machine learning': 'mdi:brain', ml: 'mdi:brain',
  // Programming concepts
  'python basics': 'mdi:language-python', 
  'java basics': 'mdi:language-java',
  'c basics': 'mdi:language-c', 
  'c++ oop': 'mdi:language-cpp',
  'oop': 'mdi:cube-outline',
  'data structures': 'mdi:file-tree',
  'libraries': 'mdi:package-variant',
  'project development': 'mdi:application-brackets',
  'spring boot': 'logos:spring-icon',
  'rest apis': 'mdi:api',
  'algorithms': 'mdi:chart-timeline-variant',
  'memory management': 'mdi:memory',
  // Video Editing & Content Creation
  'premiere pro': 'logos:adobe-premiere',
  'after effects': 'logos:adobe-after-effects',
  'capcut': 'mdi:content-cut',
  'color grading': 'mdi:palette-outline',
  'content strategy': 'mdi:strategy',
  // UI/UX Design Tools
  'figjam': 'mdi:draw',
  'maze': 'mdi:maze',
  'notion': 'logos:notion-icon',
  'zeplin': 'mdi:chart-box',
  'invision': 'mdi:eye-outline',
  // Digital Marketing Tools
  'meta ads manager': 'logos:meta-icon',
  'semrush': 'mdi:chart-line-variant',
  'canva': 'logos:canva',
  'mailchimp': 'logos:mailchimp',
  'hootsuite': 'mdi:owl',
  'search console': 'mdi:google-search-console',
};

export const getTechIcon = (toolName = '') => {
  const key = toolName.trim().toLowerCase();
  return TECH_ICON_MAP[key] || 'mdi:code-tags';
};

// ── Company Partners (shown on every course page) ──────────────
// REPLACE ME: swap in your real hiring/college partner names + logos.
export const PARTNERS = [
  { name: 'TechCorp Solutions', icon: 'mdi:domain' },
  { name: 'InnovateX', icon: 'mdi:rocket-launch-outline' },
  { name: 'CloudNine Systems', icon: 'mdi:cloud-outline' },
  { name: 'ByteWorks', icon: 'mdi:code-braces' },
  { name: 'NexGen Labs', icon: 'mdi:flask-outline' },
  { name: 'Pixel Studio', icon: 'mdi:palette-outline' },
  { name: 'DataSphere', icon: 'mdi:database-outline' },
  { name: 'CodeCraft Inc', icon: 'mdi:laptop' },
];

// ── Why choose this course (4 value props shown under hero) ─────
export const WHY_CHOOSE = [
  { icon: 'mdi:book-open-page-variant-outline', title: 'Comprehensive Curriculum', desc: 'From basics to advanced concepts covering all essential technologies' },
  { icon: 'mdi:code-tags', title: 'Hands-on Projects', desc: 'Build real-world projects and strengthen your portfolio' },
  { icon: 'mdi:infinity', title: 'Lifetime Access', desc: 'Access course materials anytime, anywhere' },
  { icon: 'mdi:certificate-outline', title: 'Industry Recognized', desc: 'Earn a certificate that boosts your career' },
];

// ── Mentors ──────────────────────────────────────────────────────
// REPLACE ME: swap in your real mentors' names/emails/bios.
const MENTOR_POOL = [
  { name: 'Aditya Sharma', role: 'Senior Software Engineer', years: 6, bio: 'Has led product teams at two Series-B startups and mentored 300+ interns into full-time roles.', avatarIcon: 'mdi:account-tie' },
  { name: 'Priya Verma', role: 'Product Designer', years: 5, bio: 'Design lead with experience shipping consumer apps used by millions; passionate about teaching design fundamentals.', avatarIcon: 'mdi:account-tie-woman' },
  { name: 'Rohan Mehta', role: 'Data Scientist', years: 7, bio: 'Worked on ML pipelines at scale; enjoys breaking down complex data concepts into practical, hands-on lessons.', avatarIcon: 'mdi:account-tie' },
  { name: 'Sneha Kapoor', role: 'DevOps Lead', years: 6, bio: 'Manages production infrastructure for high-traffic platforms; focuses on real-world, battle-tested practices.', avatarIcon: 'mdi:account-tie-woman' },
  { name: 'Karan Malhotra', role: 'Full Stack Engineer', years: 5, bio: 'Built and shipped 20+ production applications; mentors students through real client project delivery.', avatarIcon: 'mdi:account-tie' },
  { name: 'Ananya Iyer', role: 'Marketing Strategist', years: 6, bio: 'Runs performance marketing for D2C brands; teaches through live campaign case studies.', avatarIcon: 'mdi:account-tie-woman' },
];

export const getMentor = (course) => {
  const idx = hashStr(course.title) % MENTOR_POOL.length;
  const m = MENTOR_POOL[idx];
  const emailSlug = slugify(m.name).replace(/-/g, '.');
  return {
    ...m,
    email: `${emailSlug}@we-intern.in`, // REPLACE ME
    yearOfStudy: null,
  };
};

// ── Roadmap (reuses curriculum data when available) ─────────────
export const getRoadmap = (course, details) => {
  if (details?.curriculum?.length) {
    return details.curriculum.map((c) => ({
      phase: c.week,
      title: c.title,
      topics: c.topics,
    }));
  }
  return [
    { phase: 'Phase 1', title: 'Fundamentals & Setup', topics: ['Environment setup', 'Core concepts', 'Basic exercises'] },
    { phase: 'Phase 2', title: 'Applied Practice', topics: ['Real-world patterns', 'Guided projects', 'Code review'] },
    { phase: 'Phase 3', title: 'Real Client Projects', topics: ['Client requirements', 'Delivery', 'Portfolio building'] },
  ];
};

// ── Demo lecture videos ──────────────────────────────────────────
// A working DUMMY sample video is used by default (small public-domain
// clip, commonly used for HTML5 <video> demos) so the player actually
// works out of the box. REPLACE DUMMY_VIDEO_URL below with your real
// hosted lecture recordings once available, or set a per-video
// `videoUrl` to override an individual card.
export const DUMMY_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4'; // REPLACE ME

export const getVideos = (course, details) => {
  const source = details?.curriculum?.slice(0, 3) || [
    { title: 'Course Introduction' },
    { title: 'Core Concepts Walkthrough' },
    { title: 'Live Project Demo' },
  ];
  return source.map((c, i) => ({
    title: `${c.title} — Demo Lecture`,
    duration: ['08:45', '14:20', '11:05'][i] || '10:00',
    videoUrl: DUMMY_VIDEO_URL, // REPLACE ME with a real lecture recording URL
    isDummy: true, // flips off automatically once you set a real videoUrl per item
  }));
};

// ── Student testimonials ─────────────────────────────────────────
// REPLACE ME: swap in real student quotes once available.
const TESTIMONIAL_NAMES = [
  { name: 'Ishaan Gupta', batch: 'B.Tech CSE, 2025' },
  { name: 'Riya Desai', batch: 'BCA, 2024' },
  { name: 'Vikram Nair', batch: 'B.Tech IT, 2025' },
];

export const getTestimonials = (course) => [
  { ...TESTIMONIAL_NAMES[0], rating: 5, quote: `The ${course.title} course gave me real project experience I could actually show in interviews — not just certificates.` },
  { ...TESTIMONIAL_NAMES[1], rating: 5, quote: `Mentors were genuinely invested in helping us. The ${course.title} curriculum felt practical from day one.` },
  { ...TESTIMONIAL_NAMES[2], rating: 4, quote: `Best decision I made this year. I landed my first internship offer right after finishing this course.` },
];

// ── Free downloadable study materials ────────────────────────────
export const getMaterials = (course, details) => {
  const courseSlug = slugify(course.title);
  const basePath = `/course-materials/${courseSlug}`;
  
  const weeks = details?.curriculum?.map((c) => c.week) || ['Phase 1', 'Phase 2'];
  const items = weeks.map((w, index) => {
    const weekSlug = w.toLowerCase().replace(/\s+/g, '-');
    // Only first 2 weeks are free for non-enrolled users
    const isFree = index < 2;
    return { 
      title: `${w} — Notes & Slides (PDF)`, 
      type: 'PDF', 
      downloadUrl: isFree ? `${basePath}/${weekSlug}-notes.pdf` : '',
      locked: !isFree
    };
  });
  
  return [
    ...items,
    { title: 'Complete Cheat Sheet', type: 'PDF', downloadUrl: '', locked: true },
    { title: 'Practice Assignments', type: 'ZIP', downloadUrl: '', locked: true },
    { title: 'Reference Links & Resources', type: 'PDF', downloadUrl: '', locked: true },
  ];
};

// ── Prerequisites ─────────────────────────────────────────────────
export const getPrerequisites = (course) => {
  const base = ['A laptop with a stable internet connection', 'Willingness to learn and practice consistently'];
  const level = (course.level || 'beginner').toLowerCase();
  const toolHint = Array.isArray(course.tools) && course.tools.length
    ? `Basic familiarity with ${course.tools[0]} is helpful but not required`
    : null;

  if (level === 'beginner') return ['No prior experience required', ...base];
  if (level === 'intermediate') return ['Basic programming/technical fundamentals', ...(toolHint ? [toolHint] : []), ...base];
  return ['Solid understanding of programming fundamentals', 'Prior exposure to related tools recommended', ...base];
};
