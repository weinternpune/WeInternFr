import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import { LoginPage, RegisterPage, OTPPage, ForgotPasswordPage, ResetPasswordPage, AuthCallback } from './components/Auth/AuthPages';
import Dashboard from './components/Dashboard/Dashboard';
import Admin from './components/Admin/Admin';

// Global styles
import './styles/global.css';
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
const WithLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <StudentProjects />
    <TestimonialsSection />
    <Footer />
    <WAFloat />
  </>
);

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
      
      {/* About Us - standalone page without footer */}
      <Route path="/about" element={<AboutUs />} />

      {/* Auth pages */}
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
      <Route path="/verify-otp" element={<AuthLayout><OTPPage /></AuthLayout>} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
      <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />
      <Route path="/auth/callback" element={<AuthLayout><AuthCallback /></AuthLayout>} />

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
        <AppRoutes />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 10, fontSize: '.9rem' },
            success: { iconTheme: { primary: '#E8A820', secondary: '#1B2A4A' } }
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </AuthProvider>
        </CoursesProvider>
    </BrowserRouter>
  );
}

export default App;
