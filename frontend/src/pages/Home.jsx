import React from 'react';
import Hero from '../components/Sections/Hero';
import { Problem, HowItWorks, EcosystemSection, Vision } from '../components/Sections/Sections';
import Courses from '../components/Sections/Courses';
import { ApplySection, } from '../components/Sections/Forms';
import StudentProjects from '../components/Sections/StudentProjects';
import TestimonialsSection from '../components/Sections/Testimonials';
import '../components/Sections/Sections.css';
import '../components/Sections/Forms.css';

const Home = ({ phoneVerified = false }) => (
  <>
    <Hero />
    {/* Marquee - Always visible */}
    <div className="marquee-strip">
      <div className="marquee-track">
        {['🌐 Web Development', '📱 App Development', '🤖 AI & Automation', '☁️ Cloud Solutions', '🎨 UI/UX Design', '📢 Digital Marketing', '📊 Data Science', '💰 Earn While You Learn', '🚀 Real Projects', '✅ Stipend Based',
          '🌐 Web Development', '📱 App Development', '🤖 AI & Automation', '☁️ Cloud Solutions', '🎨 UI/UX Design', '📢 Digital Marketing', '📊 Data Science', '💰 Earn While You Learn', '🚀 Real Projects', '✅ Stipend Based'
        ].map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
    
    {/* Courses - Always visible */}
    <Courses />
    
    {/* All sections after Courses - BLUR until phone verified */}
    {phoneVerified ? (
      <>
        <Problem />
        <HowItWorks />
        <EcosystemSection />
        <Vision />
        <ApplySection />
        <StudentProjects />
        <TestimonialsSection />
      </>
    ) : (
      <div className="content-blurred-wrapper">
        <div className="content-blurred">
          <Problem />
          <HowItWorks />
          <EcosystemSection />
          <Vision />
          <ApplySection />
          <StudentProjects />
          <TestimonialsSection />
        </div>
      </div>
    )}
  </>
);

export default Home;
