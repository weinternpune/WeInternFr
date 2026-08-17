import React from 'react';
import Hero from '../components/Sections/Hero';
import PopularPrograms from '../components/Sections/PopularPrograms';
import { Problem, HowItWorks, EcosystemSection, Vision, LiveJourney } from '../components/Sections/Sections';
import Courses from '../components/Sections/Courses';
import { ApplySection, } from '../components/Sections/Forms';
import StudentProjects from '../components/Sections/StudentProjects';
import TestimonialsSection from '../components/Sections/Testimonials';
import PartnersMarquee from '../components/Sections/PartnersMarquee';
import '../components/Sections/Sections.css';
import '../components/Sections/Forms.css';

const Home = () => {
  return (
    <>
      <Hero />
      <PopularPrograms />

      {/* Marquee */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {['🌐 Web Development', '📱 App Development', '🤖 AI & Automation', '☁️ Cloud Solutions', '🎨 UI/UX Design', '📢 Digital Marketing', '📊 Data Science', '💰 Earn While You Learn', '🚀 Real Projects', '✅ Stipend Based',
            '🌐 Web Development', '📱 App Development', '🤖 AI & Automation', '☁️ Cloud Solutions', '🎨 UI/UX Design', '📢 Digital Marketing', '📊 Data Science', '💰 Earn While You Learn', '🚀 Real Projects', '✅ Stipend Based'
          ].map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* All original sections, unchanged */}
      <Courses />
      <PartnersMarquee/>
      <LiveJourney />
      <Problem />
      <HowItWorks />
      <EcosystemSection />
      <Vision />
      <ApplySection />
      <StudentProjects />
      <TestimonialsSection />
    </>
  );
};

export default Home;
