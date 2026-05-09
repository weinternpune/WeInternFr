import React, { useState } from 'react';
import './CourseDetail.css';

const COURSE_DETAILS = {
  'Full Stack Web Development': {
    emoji:'🌐',tagline:'Master the complete web stack and build production-grade applications',price:4999,duration:'12 Weeks',level:'Beginner',language:'English + Hindi',certificate:true,stipend:true,colors:{h1:'#e76f51',h2:'#f4a261'},
    about:'This comprehensive course takes you from zero to full-stack developer. You will build 4 real client projects that go live — not toy apps. You will work with actual client requirements, real deadlines, and a supervised team just like a professional work environment.',
    whatYouLearn:['Build complete websites from scratch using HTML, CSS, JavaScript','Master React.js for dynamic frontends','Build REST APIs with Node.js and Express','Design and manage MongoDB databases','Deploy applications on cloud platforms','Work with Git and version control','Understand client communication and project delivery','Build a portfolio of 4 live production projects'],
    tools:['HTML5','CSS3','JavaScript ES6+','React.js','Node.js','Express.js','MongoDB','Git','GitHub','Vercel','Postman'],
    curriculum:[
      {week:'Week 1-2',title:'HTML, CSS & Responsive Design',topics:['Semantic HTML5','CSS Flexbox & Grid','Responsive layouts','CSS animations']},
      {week:'Week 3-4',title:'JavaScript & ES6+',topics:['Core JS concepts','DOM manipulation','Async/Await','Fetch API']},
      {week:'Week 5-6',title:'React.js Fundamentals',topics:['Components & Props','State management','React Hooks','React Router']},
      {week:'Week 7-8',title:'Node.js & Express',topics:['Server setup','REST API design','Middleware','JWT Authentication']},
      {week:'Week 9-10',title:'MongoDB & Database Design',topics:['Schema design','CRUD operations','Mongoose ODM','Aggregation']},
      {week:'Week 11-12',title:'Real Projects & Deployment',topics:['Live project delivery','Cloud deployment','Code review','Portfolio building']}
    ],
    projects:[{name:'E-Commerce Website',tech:'React + Node.js + MongoDB'},{name:'Task Management App',tech:'React + Express + Auth'},{name:'Client Portfolio Site',tech:'HTML + CSS + JS'},{name:'REST API Service',tech:'Node.js + MongoDB'}],
    whoFor:['College students in CS/IT','Freshers looking for jobs','Students with basic computer knowledge','Anyone wanting to build websites professionally'],
    faqs:[{q:'Do I need prior coding experience?',a:'No! This course starts from absolute basics. All you need is a laptop and willingness to learn.'},{q:'Will I get a certificate?',a:'Yes, you will receive a WeIntern verified certificate upon successful completion.'},{q:'Is the stipend guaranteed?',a:'Stipend is performance-based and given upon completing real client projects.'}]
  },
  'Mobile App Development': {
    emoji:'📱',tagline:'Build and ship cross-platform mobile apps to Play Store and App Store',price:5999,duration:'10 Weeks',level:'Intermediate',language:'English + Hindi',certificate:true,stipend:true,colors:{h1:'#2a9d8f',h2:'#264653'},
    about:'Learn to build beautiful, performant mobile apps using Flutter. You will design real UIs, integrate APIs, and publish apps that users can download from the Play Store and App Store.',
    whatYouLearn:['Build cross-platform apps with Flutter','Master Dart programming language','Design stunning mobile UIs','Integrate REST APIs in mobile apps','Use Firebase for backend','Implement app navigation and state management','Publish apps to Play Store and App Store','Work on 3 real client app projects'],
    tools:['Flutter','Dart','Firebase','REST APIs','Android Studio','Xcode','Git','Figma','Play Console'],
    curriculum:[
      {week:'Week 1-2',title:'Dart & Flutter Basics',topics:['Dart syntax','Flutter widgets','Layouts','Styling']},
      {week:'Week 3-4',title:'State Management',topics:['setState','Provider','GetX basics','Navigation']},
      {week:'Week 5-6',title:'Firebase Integration',topics:['Authentication','Firestore','Storage','Push notifications']},
      {week:'Week 7-8',title:'API Integration & Advanced UI',topics:['REST API calls','JSON parsing','Animations','Custom widgets']},
      {week:'Week 9-10',title:'Real Projects & Publishing',topics:['Client project delivery','App Store submission','Play Store publishing','Portfolio']}
    ],
    projects:[{name:'Food Delivery App UI',tech:'Flutter + Firebase'},{name:'Chat Application',tech:'Flutter + Firestore'},{name:'Client App Project',tech:'Flutter + REST API'}],
    whoFor:['Students who know basic programming','Web developers wanting to go mobile','Anyone interested in app development'],
    faqs:[{q:'Do I need a Mac for iOS development?',a:'A Mac is recommended for iOS publishing, but the entire course can be done on Windows for Android.'},{q:'What phone do I need?',a:'Any Android phone works for testing.'}]
  },
  'AI & Automation': {
    emoji:'🤖',tagline:'Master AI tools, LLMs, and workflow automation for real businesses',price:6499,duration:'8 Weeks',level:'Intermediate',language:'English + Hindi',certificate:true,stipend:true,colors:{h1:'#6c3483',h2:'#a569bd'},
    about:'Learn to build AI-powered applications, automate business workflows, and integrate LLMs into real products. This is the most in-demand skill set of 2024 and beyond.',
    whatYouLearn:['Build AI chatbots with OpenAI API','Create workflow automations with n8n and Make','Integrate LangChain for AI pipelines','Build AI-powered web apps','Automate repetitive business tasks','Work with vector databases','Deploy AI solutions for real clients','Create 3 live AI projects'],
    tools:['Python','OpenAI API','LangChain','n8n','Make.com','Pinecone','FastAPI','Docker'],
    curriculum:[
      {week:'Week 1-2',title:'Python & AI Foundations',topics:['Python basics','OpenAI API','Prompt engineering','GPT integration']},
      {week:'Week 3-4',title:'LangChain & AI Pipelines',topics:['LangChain setup','Chains','Agents','Vector databases']},
      {week:'Week 5-6',title:'Workflow Automation',topics:['n8n basics','Make.com','Zapier','API integrations']},
      {week:'Week 7-8',title:'Real AI Projects',topics:['AI chatbot for client','Automation pipeline','AI dashboard','Deployment']}
    ],
    projects:[{name:'AI Customer Support Bot',tech:'OpenAI + LangChain'},{name:'Business Automation Pipeline',tech:'n8n + Make.com'},{name:'AI Document Analyzer',tech:'Python + Pinecone'}],
    whoFor:['Developers wanting AI skills','Business students interested in automation','Anyone curious about AI applications'],
    faqs:[{q:'Do I need ML knowledge?',a:'No. This course focuses on using existing AI APIs and tools, not building ML models from scratch.'},{q:'Is Python experience required?',a:'Basic Python helps but we cover everything from week 1.'}]
  },
  'Cloud Solutions & DevOps': {
    emoji:'☁️',tagline:'Learn cloud infrastructure, DevOps, and deploy scalable systems',price:5499,duration:'10 Weeks',level:'Intermediate',language:'English + Hindi',certificate:true,stipend:true,colors:{h1:'#1a6b8a',h2:'#2196f3'},
    about:'Master cloud platforms and DevOps practices used in every modern tech company. Learn to deploy, scale, and manage applications on AWS and build CI/CD pipelines.',
    whatYouLearn:['Set up cloud infrastructure on AWS','Containerize apps with Docker','Orchestrate with Kubernetes','Build CI/CD pipelines','Manage Linux servers','Configure load balancers','Monitor applications in production','Work on real client infrastructure projects'],
    tools:['AWS','Docker','Kubernetes','GitHub Actions','Jenkins','Linux','Terraform','Nginx','CloudWatch'],
    curriculum:[
      {week:'Week 1-2',title:'Linux & Cloud Basics',topics:['Linux commands','AWS EC2','S3 storage','IAM roles']},
      {week:'Week 3-4',title:'Docker & Containers',topics:['Docker basics','Dockerfile','Docker Compose','Container networking']},
      {week:'Week 5-6',title:'CI/CD Pipelines',topics:['GitHub Actions','Jenkins','Automated testing','Deployment automation']},
      {week:'Week 7-8',title:'Kubernetes & Scaling',topics:['K8s basics','Pods & Services','Ingress','Auto-scaling']},
      {week:'Week 9-10',title:'Real Projects & Monitoring',topics:['Client infrastructure','CloudWatch','Logging','Cost optimization']}
    ],
    projects:[{name:'Dockerized Web App',tech:'Docker + AWS EC2'},{name:'CI/CD Pipeline',tech:'GitHub Actions + Jenkins'},{name:'Scalable Architecture',tech:'AWS + Kubernetes'}],
    whoFor:['Developers wanting DevOps skills','CS students interested in infrastructure','Anyone targeting cloud engineer roles'],
    faqs:[{q:'Do I need AWS account?',a:'Yes, a free-tier AWS account is sufficient for the entire course.'},{q:'Is this for beginners?',a:'Basic programming knowledge is helpful but we start from Linux fundamentals.'}]
  },
  'UI/UX Design': {
    emoji:'🎨',tagline:'Design pixel-perfect interfaces that users love using real-world methods',price:3999,duration:'8 Weeks',level:'Beginner',language:'English + Hindi',certificate:true,stipend:true,colors:{h1:'#c0392b',h2:'#e74c3c'},
    about:'Learn the complete UI/UX design process from user research to high-fidelity prototypes. Work on real client design projects and build a professional design portfolio.',
    whatYouLearn:['Master Figma from scratch','Apply design thinking principles','Conduct user research','Create wireframes and prototypes','Build complete design systems','Design for mobile and web','Present designs to clients','Complete 3 real client design projects'],
    tools:['Figma','Adobe XD','FigJam','Maze','Notion','Zeplin','InVision'],
    curriculum:[
      {week:'Week 1-2',title:'Design Thinking & Research',topics:['User research','Empathy mapping','Problem definition','Ideation']},
      {week:'Week 3-4',title:'Figma Mastery',topics:['Figma tools','Auto layout','Components','Variants']},
      {week:'Week 5-6',title:'Wireframing & Prototyping',topics:['Low-fi wireframes','High-fi mockups','Interactive prototypes','User testing']},
      {week:'Week 7-8',title:'Design Systems & Client Projects',topics:['Design systems','Developer handoff','Real client project','Portfolio']}
    ],
    projects:[{name:'Mobile App Redesign',tech:'Figma'},{name:'SaaS Dashboard Design',tech:'Figma + Design System'},{name:'Client Website Design',tech:'Figma + Prototype'}],
    whoFor:['Students with no design experience','Developers wanting design skills','Anyone interested in product design'],
    faqs:[{q:'Do I need design tools experience?',a:'No. We start from absolute basics in Figma.'},{q:'Will I build a portfolio?',a:'Yes, you will complete 3 real client projects for your portfolio.'}]
  },
  'Digital Marketing': {
    emoji:'📢',tagline:'Run real campaigns for real businesses and master digital growth',price:2999,duration:'6 Weeks',level:'Beginner',language:'English + Hindi',certificate:true,stipend:true,colors:{h1:'#e67e22',h2:'#f39c12'},
    about:'Learn modern digital marketing by actually running campaigns for real businesses. Master SEO, paid ads, social media, and analytics with hands-on practice.',
    whatYouLearn:['Master SEO and rank on Google','Run Google Ads campaigns','Manage Meta Ads','Create content strategies','Build email marketing funnels','Analyze data with Google Analytics','Manage social media accounts','Run real campaigns for client businesses'],
    tools:['Google Ads','Meta Ads Manager','Google Analytics','SEMrush','Canva','Mailchimp','Hootsuite','Search Console'],
    curriculum:[
      {week:'Week 1',title:'SEO & Content Marketing',topics:['Keyword research','On-page SEO','Content strategy','Link building']},
      {week:'Week 2',title:'Google Ads',topics:['Campaign setup','Ad copywriting','Bidding strategies','Conversion tracking']},
      {week:'Week 3',title:'Meta Ads',topics:['Facebook Ads','Instagram Ads','Audience targeting','Retargeting']},
      {week:'Week 4',title:'Social Media & Content',topics:['Content calendar','Organic growth','Influencer marketing','Viral strategies']},
      {week:'Week 5',title:'Email Marketing & Analytics',topics:['Email campaigns','Automation','Google Analytics','Reporting']},
      {week:'Week 6',title:'Real Client Campaigns',topics:['Live campaign management','Budget optimization','ROI analysis','Client reporting']}
    ],
    projects:[{name:'SEO Optimization Project',tech:'Google Search Console + SEMrush'},{name:'Paid Ad Campaign',tech:'Google Ads + Meta Ads'},{name:'Full Digital Strategy',tech:'All channels combined'}],
    whoFor:['Students interested in marketing','Entrepreneurs wanting to grow online','Anyone wanting a digital marketing career'],
    faqs:[{q:'Do I need a marketing background?',a:'Absolutely not. Designed for complete beginners.'},{q:'Will I run real campaigns?',a:'Yes, we use small budgets on real client accounts for actual experience.'}]
  },
  'Data Science & Analytics': {
    emoji:'📊',tagline:'Turn raw data into business decisions with Python and machine learning',price:6999,duration:'12 Weeks',level:'Intermediate',language:'English + Hindi',certificate:true,stipend:true,colors:{h1:'#1e8449',h2:'#27ae60'},
    about:'Master data science from data cleaning to machine learning. Work on real business datasets and build end-to-end data pipelines that deliver actual business value.',
    whatYouLearn:['Master Python for data analysis','Clean and process messy real-world data','Create compelling visualizations','Build machine learning models','Work with SQL databases','Use Tableau for business dashboards','Build end-to-end ML pipelines','Complete 3 real data projects'],
    tools:['Python','Pandas','NumPy','Scikit-learn','Matplotlib','Seaborn','Tableau','SQL','Jupyter','Git'],
    curriculum:[
      {week:'Week 1-2',title:'Python for Data Science',topics:['Python basics','NumPy','Pandas','Data structures']},
      {week:'Week 3-4',title:'Data Cleaning & EDA',topics:['Missing data','Outlier detection','Exploratory analysis','Feature engineering']},
      {week:'Week 5-6',title:'Data Visualization',topics:['Matplotlib','Seaborn','Tableau dashboards','Storytelling with data']},
      {week:'Week 7-8',title:'Machine Learning',topics:['Supervised learning','Classification','Regression','Model evaluation']},
      {week:'Week 9-10',title:'SQL & Databases',topics:['SQL queries','Joins','Aggregations','Database design']},
      {week:'Week 11-12',title:'Real Projects & Deployment',topics:['End-to-end project','Model deployment','Business presentation','Portfolio']}
    ],
    projects:[{name:'Sales Analysis Dashboard',tech:'Python + Tableau'},{name:'Customer Churn Prediction',tech:'Scikit-learn + Pandas'},{name:'Business Intelligence Report',tech:'SQL + Python'}],
    whoFor:['Students interested in data careers','Anyone with basic math knowledge','Developers wanting data skills'],
    faqs:[{q:'Do I need statistics background?',a:'Basic math is sufficient. We cover all required statistics within the course.'},{q:'Will I work on real data?',a:'Yes, all projects use real business datasets from actual companies.'}]
  }
};

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cd-faq${open ? ' open' : ''}`}>
      <button className="cd-faq-q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="cd-faq-icon">{open ? '-' : '+'}</span>
      </button>
      {open && <div className="cd-faq-a">{a}</div>}
    </div>
  );
};

const CourseDetailModal = ({ course, onClose, onEnroll }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const details = COURSE_DETAILS[course.title] || {
    emoji: course.emoji || '🎓',
    tagline: course.tagline || course.desc || 'Professional course by WeIntern',
    price: course.price || 0,
    duration: course.duration || 'Flexible',
    level: (course.level || 'beginner').charAt(0).toUpperCase() + (course.level || 'beginner').slice(1),
    language: course.language || 'English + Hindi',
    certificate: true,
    stipend: true,
    colors: course.colors || { h1: '#1B2A4A', h2: '#243659' },
    about: course.about || course.desc || course.tagline || 'This course is designed by industry experts to give you real-world skills and hands-on experience.',
    whatYouLearn: course.tools
      ? (Array.isArray(course.tools) ? course.tools : course.tools.split(',').map(t => t.trim()))
          .map(t => 'Master ' + t.trim())
      : ['Real-world project experience', 'Industry-standard tools', 'Mentorship from experts', 'Verified certificate on completion'],
    tools: Array.isArray(course.tools)
      ? course.tools
      : (course.tools || '').split(',').map(t => t.trim()).filter(Boolean),
    curriculum: [
      { week: 'Phase 1', title: 'Fundamentals & Setup', topics: ['Environment setup', 'Core concepts', 'Basic projects', 'Best practices'] },
      { week: 'Phase 2', title: 'Intermediate Topics', topics: ['Advanced features', 'Real patterns', 'Code review', 'Debugging'] },
      { week: 'Phase 3', title: 'Real Client Projects', topics: ['Client requirements', 'Project execution', 'Delivery', 'Portfolio'] },
    ],
    projects: [
      { name: 'Starter Project', tech: course.tools ? (Array.isArray(course.tools) ? course.tools.slice(0,2).join(' + ') : course.tools.split(',').slice(0,2).join(' + ')) : 'Core Tools' },
      { name: 'Client Project', tech: 'Real Client Work' },
    ],
    whoFor: ['Students wanting real experience', 'Freshers building their portfolio', 'Anyone wanting job-ready skills'],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No prior experience needed. We start from the basics and build up to advanced topics.' },
      { q: 'Will I get a certificate?', a: 'Yes! You will receive a WeIntern verified certificate upon successful completion.' },
      { q: 'Is stipend available?', a: 'Yes, stipend opportunities are available for top-performing students after completing real client projects.' },
    ],
  };

  const downloadCurriculum = () => {
    const win = window.open('', '_blank');
    const html = buildPDFHTML(details, course);
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  return (
    <div className="cd-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cd-modal">
        <div className="cd-header" style={{ background: `linear-gradient(135deg,${details.colors.h1},${details.colors.h2})` }}>
          <button className="cd-close" onClick={onClose}>x</button>
          <div className="cd-header-content">
            <div className="cd-emoji">{details.emoji}</div>
            <div>
              <div className="cd-badge-row">
                <span className="cd-badge">{details.level}</span>
                <span className="cd-badge">{details.duration}</span>
                <span className="cd-badge">{details.language}</span>
              </div>
              <h2 className="cd-title">{course.title}</h2>
              <p className="cd-tagline">{details.tagline}</p>
            </div>
          </div>
          <div className="cd-header-bottom">
            <div className="cd-price-row">
              <div className="cd-price">Rs.{details.price.toLocaleString('en-IN')}</div>
              <div className="cd-perks">
                <span>Certificate</span>
                <span>Stipend</span>
                <span>Live Projects</span>
              </div>
            </div>
            <div className="cd-header-btns">
              <button onClick={onEnroll} className="cd-enroll-btn">Enroll Now</button>
              <button onClick={downloadCurriculum} className="cd-download-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:4}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download PDF</button>
            </div>
          </div>
        </div>

        <div className="cd-tabs">
          {[['overview','Overview'],['curriculum','Curriculum'],['projects','Projects'],['faqs','FAQs']].map(([id, label]) => (
            <button key={id} className={`cd-tab${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)}>
              {label}
            </button>
          ))}
        </div>

        <div className="cd-body">
          {activeTab === 'overview' && (
            <div className="cd-section">
              <div className="cd-about">
                <h3>About This Course</h3>
                <p>{details.about}</p>
              </div>
              <div className="cd-learn">
                <h3>What You Will Learn</h3>
                <div className="cd-learn-grid">
                  {details.whatYouLearn.map((l, i) => (
                    <div key={i} className="cd-learn-item">
                      <span className="cd-check">checkmark</span>
                      <span>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cd-tools-section">
                <h3>Tools and Technologies</h3>
                <div className="cd-tools-grid">
                  {details.tools.map(t => <span key={t} className="cd-tool-tag">{t}</span>)}
                </div>
              </div>
              <div className="cd-who">
                <h3>Who This Course Is For</h3>
                {details.whoFor.map((w, i) => (
                  <div key={i} className="cd-who-item"><span>target</span><span>{w}</span></div>
                ))}
              </div>
              <div className="cd-highlights">
                <div className="cd-hl"><span></span><div><strong>{details.duration}</strong><small>Duration</small></div></div>
                <div className="cd-hl"><span></span><div><strong>{details.level}</strong><small>Level</small></div></div>
                <div className="cd-hl"><span></span><div><strong>{details.language}</strong><small>Language</small></div></div>
                <div className="cd-hl"><span></span><div><strong>Yes</strong><small>Certificate</small></div></div>
                <div className="cd-hl"><span></span><div><strong>Available</strong><small>Stipend</small></div></div>
                <div className="cd-hl"><span></span><div><strong>{details.projects.length} Projects</strong><small>Live Projects</small></div></div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="cd-section">
              <div className="cd-curriculum-header">
                <h3>Week-by-Week Curriculum</h3>
                <button onClick={downloadCurriculum} className="cd-dl-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:4}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download PDF</button>
              </div>
              <div className="cd-curriculum">
                {details.curriculum.map((w, i) => (
                  <div key={i} className="cd-week">
                    <div className="cd-week-header">
                      <span className="cd-week-num">{i + 1}</span>
                      <div>
                        <div className="cd-week-period">{w.week}</div>
                        <div className="cd-week-title">{w.title}</div>
                      </div>
                    </div>
                    <div className="cd-week-topics">
                      {w.topics.map((t, j) => <span key={j} className="cd-topic-tag">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="cd-section">
              <h3>Projects You Will Build</h3>
              <p className="cd-section-sub">All projects are delivered to real clients and go into your portfolio.</p>
              <div className="cd-projects">
                {details.projects.map((p, i) => (
                  <div key={i} className="cd-project-card">
                    <div className="cd-project-num">0{i + 1}</div>
                    <div className="cd-project-info">
                      <h4>{p.name}</h4>
                      <div className="cd-project-tech">{p.tech}</div>
                    </div>
                    <div className="cd-project-badge">Live Project</div>
                  </div>
                ))}
              </div>
              <div className="cd-project-note">
                <p>All projects are real client work. They go live and are added to your verified portfolio.</p>
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="cd-section">
              <h3>Frequently Asked Questions</h3>
              <div className="cd-faqs">
                {details.faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
              </div>
              <div className="cd-contact-note">
                <h4>Still have questions?</h4>
                <p>Our team is here to help you pick the right course.</p>
                <div className="cd-contact-btns">
                  <a href="https://wa.me/917414974582" target="_blank" rel="noreferrer" className="cd-wa-btn">WhatsApp Us</a>
                  <a href="mailto:contact.weintern@gmail.com" className="cd-mail-btn">Email Us</a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="cd-footer">
          <div className="cd-footer-price">
            <small>Starting at</small>
            <strong>Rs.{details.price.toLocaleString('en-IN')}</strong>
          </div>
          <div className="cd-footer-btns">
            <button onClick={downloadCurriculum} className="cd-dl-btn-sm"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:4}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download PDF</button>
            <button onClick={onEnroll} className="cd-enroll-btn-sm">Enroll Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

function buildPDFHTML(details, course) {
  const learnItems = details.whatYouLearn.map(function(l) {
    return '<div class="learn-item"><span class="check">&#10003;</span><span>' + l + '</span></div>';
  }).join('');

  const toolTags = details.tools.map(function(t) {
    return '<span class="tool-tag">' + t + '</span>';
  }).join('');

  const weekItems = details.curriculum.map(function(w, i) {
    const topics = w.topics.map(function(t) {
      return '<span class="topic-tag">' + t + '</span>';
    }).join('');
    return '<div class="week"><div class="week-header"><div class="week-num">' + (i+1) + '</div><div><div class="week-period">' + w.week + '</div><div class="week-title">' + w.title + '</div></div></div><div class="topic-tags">' + topics + '</div></div>';
  }).join('');

  const projectItems = details.projects.map(function(p, i) {
    return '<div class="project-card"><div class="project-num">0' + (i+1) + '</div><div><div class="project-name">' + p.name + '</div><span class="project-tech">' + p.tech + '</span></div><div class="project-badge">Live Project</div></div>';
  }).join('');

  const faqItems = details.faqs.map(function(f) {
    return '<div class="faq"><div class="faq-q">Q: ' + f.q + '</div><div class="faq-a">A: ' + f.a + '</div></div>';
  }).join('');

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>WeIntern - ' + course.title + ' Curriculum</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:40px;color:#1B2A4A;background:white}.header{background:linear-gradient(135deg,#1B2A4A,#243659);color:white;padding:32px 40px;border-radius:12px;margin-bottom:28px;text-align:center}.header h1{font-size:26px;font-weight:900;margin-bottom:6px}.header .emoji{font-size:36px;margin-bottom:10px;display:block}.header p{color:rgba(255,255,255,0.7);font-size:13px}.meta-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px}.meta-card{background:#f4f6fb;border-radius:8px;padding:12px;text-align:center;border:1px solid #e0e4ef}.meta-card strong{display:block;color:#1B2A4A;font-size:14px;font-weight:700}.meta-card small{color:#5a6a82;font-size:11px}.section{margin-bottom:24px}.section-title{font-size:14px;font-weight:800;color:#1B2A4A;border-left:4px solid #E8A820;padding-left:10px;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px}.about-text{color:#5a6a82;line-height:1.8;font-size:13px;background:#f8fafc;padding:14px;border-radius:8px}.learn-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}.learn-item{display:flex;align-items:flex-start;gap:6px;font-size:12px;color:#1B2A4A;background:#f4f6fb;padding:7px 10px;border-radius:6px}.check{color:#27ae60;font-weight:700;flex-shrink:0}.tools{display:flex;flex-wrap:wrap;gap:5px}.tool-tag{background:rgba(33,150,201,0.1);color:#2196C9;border:1px solid rgba(33,150,201,0.2);padding:3px 8px;border-radius:50px;font-size:11px;font-weight:600}.week{background:#f4f6fb;border-radius:8px;padding:12px 14px;margin-bottom:8px;border-left:4px solid #E8A820}.week-header{display:flex;align-items:center;gap:8px;margin-bottom:6px}.week-num{width:26px;height:26px;background:#1B2A4A;color:#E8A820;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}.week-title{font-weight:700;color:#1B2A4A;font-size:13px}.week-period{font-size:10px;color:#5a6a82}.topic-tags{display:flex;flex-wrap:wrap;gap:4px}.topic-tag{background:white;border:1px solid #e0e4ef;color:#1B2A4A;padding:2px 7px;border-radius:50px;font-size:10px}.project-card{background:#f4f6fb;border-radius:8px;padding:12px 14px;margin-bottom:7px;display:flex;align-items:center;gap:12px;border:1px solid #e0e4ef}.project-num{font-size:20px;font-weight:900;color:rgba(232,168,32,0.3);flex-shrink:0}.project-name{font-weight:700;color:#1B2A4A;font-size:13px;margin-bottom:3px}.project-tech{background:rgba(33,150,201,0.1);color:#2196C9;display:inline-block;padding:2px 7px;border-radius:50px;font-size:10px;font-weight:600}.project-badge{margin-left:auto;background:rgba(39,174,96,0.1);color:#27ae60;border:1px solid rgba(39,174,96,0.25);padding:3px 8px;border-radius:50px;font-size:10px;font-weight:700;flex-shrink:0}.faq{margin-bottom:10px;background:#f8fafc;border-radius:8px;padding:12px 14px;border:1px solid #e0e4ef}.faq-q{font-weight:700;color:#1B2A4A;font-size:12px;margin-bottom:5px}.faq-a{color:#5a6a82;font-size:12px;line-height:1.6}.footer{margin-top:28px;background:#1B2A4A;color:white;padding:18px 28px;border-radius:12px;text-align:center}.footer p{font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:3px}.footer .contact{color:#E8A820;font-size:12px;font-weight:600}@media print{body{padding:15px}}</style></head><body><div class="header"><span class="emoji">' + details.emoji + '</span><h1>' + course.title + '</h1><p>' + details.tagline + '</p></div><div class="meta-grid"><div class="meta-card"><strong>' + details.duration + '</strong><small>Duration</small></div><div class="meta-card"><strong>' + details.level + '</strong><small>Level</small></div><div class="meta-card"><strong style="color:#E8A820">Rs.' + details.price.toLocaleString('en-IN') + '</strong><small>Course Fee</small></div><div class="meta-card"><strong>' + details.language + '</strong><small>Language</small></div><div class="meta-card"><strong style="color:#27ae60">Yes</strong><small>Certificate</small></div><div class="meta-card"><strong style="color:#27ae60">Available</strong><small>Stipend</small></div></div><div class="section"><div class="section-title">About This Course</div><div class="about-text">' + details.about + '</div></div><div class="section"><div class="section-title">What You Will Learn</div><div class="learn-grid">' + learnItems + '</div></div><div class="section"><div class="section-title">Tools and Technologies</div><div class="tools">' + toolTags + '</div></div><div class="section"><div class="section-title">Week-by-Week Curriculum</div>' + weekItems + '</div><div class="section"><div class="section-title">Projects You Will Build</div>' + projectItems + '</div><div class="section"><div class="section-title">Frequently Asked Questions</div>' + faqItems + '</div><div class="footer"><p class="contact">weintern.in | contact.weintern@gmail.com | +91 74149 74582</p><p>2024 WeIntern - Where Students Build Opportunity</p></div><script>window.onload=function(){window.print();}<\/script></body></html>';
}

export default CourseDetailModal;
