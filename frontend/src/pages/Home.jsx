import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Sections/Hero';
import { Problem, HowItWorks, EcosystemSection, Vision, LiveJourney } from '../components/Sections/Sections';
import Courses from '../components/Sections/Courses';
import { ApplySection, } from '../components/Sections/Forms';
import StudentProjects from '../components/Sections/StudentProjects';
import TestimonialsSection from '../components/Sections/Testimonials';
import '../components/Sections/Sections.css';
import '../components/Sections/Forms.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect to login after 10 seconds if not logged in
  useEffect(() => {
    if (user) {
      console.log('✅ User is logged in - no auto-redirect');
      return;
    }

    console.log('⏰ Starting 10-second timer for login redirect...');
    const timer = setTimeout(() => {
      console.log('🚀 10 seconds complete! Redirecting to login page');
      navigate('/login');
    }, 10000);

    return () => {
      console.log('⏹️ Timer cleanup on unmount');
      clearTimeout(timer);
    };
  }, [user, navigate]);

  return (
    <>
      <Hero />
      {/* Marquee */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {['🌐 Web Development', '📱 App Development', '🤖 AI & Automation', '☁️ Cloud Solutions', '🎨 UI/UX Design', '📢 Digital Marketing', '📊 Data Science', '💰 Earn While You Learn', '🚀 Real Projects', '✅ Stipend Based',
            '🌐 Web Development', '📱 App Development', '🤖 AI & Automation', '☁️ Cloud Solutions', '🎨 UI/UX Design', '📢 Digital Marketing', '📊 Data Science', '💰 Earn While You Learn', '🚀 Real Projects', '✅ Stipend Based'
          ].map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
      
      {/* All sections visible - no blur */}
      <Courses />
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
