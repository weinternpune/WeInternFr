import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from '../components/Layout/Navbar';
import Footerpage from '../components/Layout/Footer';
import { useCourses } from '../context/CoursesContext';
import CourseMarquee from './CoursesMarquee';
import './InternshipPage.css';

const PAYMENT_URL = 'https://rzp.io/rzp/weintern-internship';

const INTERNSHIP_DATA = {
  '3-month': {
    title: '3 & 6 Month Internship',
    subtitle: 'Learn. Build. Work on Real Projects. Get Career-Ready.',
    description: 'A 3-month industry-focused internship designed to help students move beyond theoretical learning and gain practical experience by working on real-world projects.',
    duration: '3 & 6 Months',
    registrationFee: '₹999',
    stipend: 'Up to ₹10,000',
    badge: 'Career-Ready',
    hero: {
      title: 'Learn. Build. Work on Real Projects. Get Career-Ready.',
      subtitle: 'Build your skills, strengthen your professional profile, and prepare yourself for the next step in your career.',
    },
    features: [
      { icon: 'mdi:briefcase-check', title: '100% Placement Support', desc: 'Dedicated career and placement support throughout your journey' },
      { icon: 'mdi:certificate-outline', title: 'Internship Certificate & LOR', desc: 'Official certificate and Letter of Recommendation' },
      { icon: 'mdi:file-document-edit', title: 'Professional Resume Building', desc: 'Industry-ready resume highlighting your skills and experience' },
      { icon: 'mdi:linkedin', title: 'LinkedIn Profile Optimization', desc: 'Build strong professional presence with profile guidance' },
      { icon: 'mdi:account-tie', title: 'Full-Time Employment', desc: 'Top 3 performers may be considered for full-time positions' },
      { icon: 'mdi:code-braces', title: 'Real Client Projects', desc: 'Work on real-world client projects with professional teams' },
      { icon: 'mdi:cash-multiple', title: 'Earn Through Contribution', desc: 'Up to 75% project value sharing based on your work' },
      { icon: 'mdi:domain', title: 'Industry Connections', desc: '40+ companies and industry partners network' },
    ],
    highlights: [
      'Duration: 3 & 6 Months',
      'Real-World Project Experience',
      '100% Placement Support',
      'Internship Certificate',
      'Letter of Recommendation',
      'Professional Resume Building',
      'LinkedIn Profile Optimization',
      'Performance-Based Full-Time Opportunities',
      'Up to 75% Project Value Sharing',
      '40+ Industry Connections',
      'Stipend Opportunities up to ₹10,000',
    ],
    journey: {
      title: 'Your 3-Month Journey',
      subtitle: 'Learn → Build → Contribute → Earn → Get Career-Ready',
      description: 'Don\'t just add another certificate to your resume. Build real skills, work on real projects, and create real career opportunities.',
    },
    whatYouGet: [
      {
        title: '100% Placement Support',
        desc: 'Get dedicated career and placement support throughout your internship journey to help you prepare for opportunities and confidently enter the job market.',
      },
      {
        title: 'Internship Certificate & Letter of Recommendation',
        desc: 'Receive an official internship certificate upon successful completion, along with a Letter of Recommendation based on your performance and contribution.',
      },
      {
        title: 'Professional Resume Building',
        desc: 'Create a professional, industry-ready resume that highlights your technical skills, project experience, achievements, and internship experience.',
      },
      {
        title: 'LinkedIn Profile Optimization',
        desc: 'Build a strong professional presence on LinkedIn with guidance on profile optimization, project showcasing, skills, and personal branding.',
      },
      {
        title: 'Opportunity for Full-Time Employment',
        desc: 'Your performance can open the door to a full-time career opportunity. The top 3 performing interns may be considered for a full-time position based on their performance, skills, and contribution during the internship.',
      },
    ],
    realProjects: {
      title: 'Work on Real Client Projects',
      subtitle: 'This isn\'t just a learning program.',
      desc: 'You get the opportunity to work on real-world client projects and experience how professional development teams operate.',
      earning: 'When you contribute to a client project, up to 75% of the project value generated through your contribution can be shared with the student/intern, giving you the opportunity to gain practical experience while earning based on your work.',
    },
    industryConnections: 'Get exposure to an ecosystem connected with 40+ companies and industry partners, creating opportunities to understand real industry requirements and explore potential career paths.',
  },
  '6-month': {
    title: '6 Month Internship Program',
    subtitle: 'Learn. Experience. Build. Get Career-Ready.',
    description: 'A comprehensive 6-month industry-focused internship designed for students who want to go beyond basic internship experience and build the skills, project portfolio, and professional exposure needed to launch their careers.',
    duration: '6 Months',
    registrationFee: '₹1,599',
    stipend: 'Up to ₹10,000',
    badge: 'Premium',
    hero: {
      title: 'Learn. Experience. Build. Get Career-Ready.',
      subtitle: 'With extended hands-on experience, live project opportunities, career support, and professional development, this program takes you from learning the fundamentals to working in a real-world environment.',
    },
    features: [
      { icon: 'mdi:briefcase-check', title: '100% Placement Support', desc: 'Dedicated placement assistance and career guidance' },
      { icon: 'mdi:certificate-outline', title: 'Course & Internship Certificates', desc: 'Complete certification for learning and experience' },
      { icon: 'mdi:file-certificate', title: 'Letter of Recommendation', desc: 'LOR based on performance and contribution' },
      { icon: 'mdi:trophy-award', title: 'Appreciation Certificate', desc: 'Recognition for achievements and contributions' },
      { icon: 'mdi:code-tags', title: 'Live Project Experience', desc: 'Work on live and real-world projects' },
      { icon: 'mdi:file-document-edit', title: 'Professional Resume Building', desc: 'Industry-ready resume with your experience' },
      { icon: 'mdi:linkedin', title: 'LinkedIn Profile Optimization', desc: 'Strong professional presence and branding' },
      { icon: 'mdi:account-multiple-check', title: 'Career Support', desc: 'Interview prep and placement guidance' },
    ],
    highlights: [
      'Duration: 6 Months',
      'Live & Real-World Project Experience',
      '100% Placement Support',
      'Course Completion Certificate',
      'Internship Experience Certificate',
      'Letter of Recommendation',
      'Appreciation Certificate',
      'Professional Resume Building',
      'LinkedIn Profile Optimization',
      'Career & Placement Support',
      'Stipend Opportunities up to ₹10,000',
    ],
    journey: {
      title: 'Your 6-Month Journey',
      phases: [
        {
          title: 'Month 1–2 — Learn & Build Your Foundation',
          desc: 'Strengthen your technical fundamentals through structured learning, practical assignments, and guided development.',
        },
        {
          title: 'Month 3–4 — Apply & Develop',
          desc: 'Put your knowledge into practice by building projects, solving real-world problems, and working with industry-relevant development practices.',
        },
        {
          title: 'Month 5–6 — Experience & Contribute',
          desc: 'Work on live projects, gain professional experience, contribute to real deliverables, and prepare yourself for the transition from student to professional.',
        },
      ],
    },
    careerReady: {
      title: 'Career-Ready by the End of 6 Months',
      subtitle: 'By completing the program, you\'ll have more than a certificate.',
      points: ['Technical Skills', 'Project Experience', 'Professional Profile', 'Industry Exposure', 'Career Support'],
    },
    whatYouGet: [
      {
        title: '100% Placement Support',
        desc: 'Get dedicated placement assistance and career guidance throughout your internship journey. From interview preparation to resume building and opportunity guidance, we\'ll support you as you take your next step toward a professional career.',
      },
      {
        title: 'Complete Internship & Course Certification',
        desc: 'Receive a Course Completion Certificate and an Internship Experience Certificate to officially validate your learning and practical experience.',
      },
      {
        title: 'Letter of Recommendation',
        desc: 'Stand out to recruiters with a Letter of Recommendation (LOR) based on your performance, dedication, and contribution during the program.',
      },
      {
        title: 'Appreciation Certificate',
        desc: 'Get recognized for your achievements and contributions with an Appreciation Certificate during your internship journey.',
      },
      {
        title: 'Live Project Experience',
        desc: 'Work on live and real-world projects to understand how technology is applied in professional environments. Gain hands-on experience with development workflows, project requirements, teamwork, and practical problem-solving.',
      },
      {
        title: 'Professional Resume Building',
        desc: 'Build an industry-ready resume that effectively showcases your technical skills, project experience, internship experience, and professional achievements.',
      },
      {
        title: 'LinkedIn Profile Optimization',
        desc: 'Develop a strong professional presence on LinkedIn with guidance on profile optimization, project presentation, skills, and personal branding.',
      },
    ],
    moreTime: {
      title: 'More Time. More Experience. More Opportunities.',
      desc: 'The additional duration gives you the opportunity to spend more time developing your technical abilities, working on practical assignments, contributing to live projects, and building confidence in a professional environment. Instead of simply completing an internship, you\'ll build a portfolio of experience that you can take into your career.',
    },
  },
};

const InternshipPage = () => {
  const navigate = useNavigate();
  const { activeCourses } = useCourses();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    college: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const type = '3-month';
  const internship = INTERNSHIP_DATA[type];

  /*
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  */

  if (!internship) {
    return (
      <div className="ip-page">
        <Navbar />
        <div className="ip-notfound">
          <h2>Internship Not Found</h2>
          <button onClick={() => navigate('/')} className="ip-btn">Go Home</button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    window.open(PAYMENT_URL, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.course || !formData.college) {
      alert('Please fill all fields');
      setIsSubmitting(false);
      return;
    }

    // Directly open Razorpay payment
    setIsSubmitting(false);
    setShowApplyModal(false);
    
    // Call payment handler directly
    setTimeout(() => {
      handlePayment();
    }, 500);
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        alert('Payment gateway is loading. Please wait a moment and try again.');
        setIsProcessingPayment(false);
        return;
      }

      // Get registration fee amount
      const amount = parseInt(internship.registrationFee.replace(/[₹,]/g, ''));
      
      // Prepare application data
      const applicationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        college: formData.college,
        internshipType: type,
      };

      // Call backend to create Razorpay order
      const response = await fetch(`${process.env.REACT_APP_API_URL}/payments/internship/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          applicationData 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }
      
      const { order, applicationId } = await response.json();
      setIsProcessingPayment(false);

      // Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'WeIntern',
        description: `${internship.title} Registration`,
        image: '/blogo.png',
        order_id: order.id,
        handler: async function (response) {
          // Payment successful - verify on backend
          try {
            setIsProcessingPayment(true);
            
            const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/payments/internship/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                applicationId: applicationId
              })
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              // Set application ID and show success modal
              setApplicationId(verifyData.applicationId);
              setIsProcessingPayment(false);
              setShowSuccessModal(true);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            setIsProcessingPayment(false);
            alert('⚠️ Payment completed but verification failed.\n\nPlease contact support with Payment ID: ' + response.razorpay_payment_id);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          internship_type: type,
          student_name: formData.name,
        },
        theme: {
          color: '#3db8f0',
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
            alert('Payment cancelled. Please apply again to complete your registration.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setIsProcessingPayment(false);
        alert('❌ Payment Failed\n\n' + response.error.description);
        console.error('Payment failed:', response.error);
      });
      
      rzp.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessingPayment(false);
      alert('❌ Payment initialization failed.\n\nPlease try again or contact support.');
    }
  };

  return (
    <div className="ip-page">
      <Navbar />

      {/* Hero Section */}
      <div className="ip-hero">
        <div className="ip-hero-inner">
          <div className="ip-badge">{internship.badge}</div>
          <h1 className="ip-hero-title">{internship.hero.title}</h1>
          <p className="ip-hero-subtitle">{internship.hero.subtitle}</p>
          
          <div className="ip-hero-meta">
            <span className="ip-meta-item">
              <Icon icon="mdi:clock-outline" width={18} /> {internship.duration}
            </span>
           
            <span className="ip-meta-item">
              <Icon icon="mdi:currency-inr" width={18} /> Stipend: {internship.stipend}
            </span>
          </div>

          
        </div>
        <CourseMarquee/>
      </div>

      {/* Features */}
      <div className="ip-section ip-features">
        <div className="ip-container">
          <h2 className="ip-section-title">What You'll Get</h2>
          <div className="ip-features-grid">
            {internship.features.map((feature, idx) => (
              <div key={idx} className="ip-feature-card">
                <Icon icon={feature.icon} width={32} className="ip-feature-icon" />
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Apply Now CTA */}
      <div className="ip-inline-apply">
        <div className="ip-container ip-inline-apply-container">
          <button
            type="button"
            className="ip-btn ip-btn-primary ip-inline-apply-btn"
            onClick={handleApply}
          >
            Apply Now
            <Icon icon="mdi:arrow-right" width={18} />
          </button>
        </div>
      </div>

      {/* What You'll Do */}
      <div className="ip-section">
        <div className="ip-container">
          <h2 className="ip-section-title">What You Get</h2>
          <div className="ip-whatyouget-grid">
            {internship.whatYouGet.map((item, idx) => (
              <div key={idx} className="ip-whatyouget-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="ip-section ip-gray">
        <div className="ip-container">
          <h2 className="ip-section-title">Program Highlights</h2>
          <div className="ip-highlights-grid">
            {internship.highlights.map((item, idx) => (
              <div key={idx} className="ip-highlight-item">
                <Icon icon="mdi:check-circle" width={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real Projects Section (3-month only) */}
      {type === '3-month' && internship.realProjects && (
        <div className="ip-section">
          <div className="ip-container">
            <h2 className="ip-section-title">{internship.realProjects.title}</h2>
            <p className="ip-section-subtitle">{internship.realProjects.subtitle}</p>
            <p className="ip-section-text">{internship.realProjects.desc}</p>
            <div className="ip-earning-box">
              <Icon icon="mdi:cash-multiple" width={32} />
              <p>{internship.realProjects.earning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Trusted By Section */}
      <div className="ip-section ip-trusted">
        <div className="ip-container">
          <h2 className="ip-trusted-title">
            Trusted By <span className="ip-trusted-govt">Government</span> & <span className="ip-trusted-industry">Industry</span>
          </h2>
          <div className="ip-trusted-divider">
            <div className="ip-trusted-divider-line ip-trusted-divider-left"></div>
            <Icon icon="mdi:shield-check" width={24} className="ip-trusted-divider-icon" />
            <div className="ip-trusted-divider-line ip-trusted-divider-right"></div>
          </div>
          <p className="ip-trusted-subtitle">
            Recognitions that validate our commitment to quality, innovation & impact
          </p>
          
          <div className="ip-trusted-marquee">
            <div className="ip-trusted-marquee-content">
              {/* First set of logos */}
              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/msme.png" alt="Ministry of MSME" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/nsdc.png" alt="NSDC" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/skill-india.png" alt="Skill India" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/skill-ministry.png" alt="Ministry of Skill Development" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/aicte.png" alt="AICTE" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/google-partner.png" alt="Google Partner" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/aws.png" alt="AWS" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/iso.png" alt="ISO Certified" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/dpiit.png" alt="DPIIT" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/ibm.png" alt="IBM" />
                </div>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/msme.png" alt="Ministry of MSME" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/nsdc.png" alt="NSDC" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/skill-india.png" alt="Skill India" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/skill-ministry.png" alt="Ministry of Skill Development" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/aicte.png" alt="AICTE" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/google-partner.png" alt="Google Partner" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/aws.png" alt="AWS" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/iso.png" alt="ISO Certified" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/dpiit.png" alt="DPIIT" />
                </div>
              </div>

              <div className="ip-trusted-card">
                <div className="ip-trusted-logo-img">
                  <img src="/trust-logos/ibm.png" alt="IBM" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Connections (3-month only) */}
      {type === '3-month' && internship.industryConnections && (
        <div className="ip-section ip-gray">
          <div className="ip-container">
            <h2 className="ip-section-title">Industry Connections</h2>
            <p className="ip-section-text">{internship.industryConnections}</p>
          </div>
        </div>
      )}

      {/* Journey Section (6-month only) */}
      {type === '6-month' && internship.journey.phases && (
        <div className="ip-section">
          <div className="ip-container">
            <h2 className="ip-section-title">{internship.journey.title}</h2>
            <div className="ip-journey-grid">
              {internship.journey.phases.map((phase, idx) => (
                <div key={idx} className="ip-journey-card">
                  <h3>{phase.title}</h3>
                  <p>{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Career Ready (6-month only) */}
      {type === '6-month' && internship.careerReady && (
        <div className="ip-section ip-gray">
          <div className="ip-container">
            <h2 className="ip-section-title">{internship.careerReady.title}</h2>
            <p className="ip-section-subtitle">{internship.careerReady.subtitle}</p>
            <div className="ip-career-ready-points">
              {internship.careerReady.points.map((point, idx) => (
                <span key={idx} className="ip-career-point">{point}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="ip-cta">
        <div className="ip-container">
          <h2>Ready to {type === '6-month' ? 'Build Your Career' : 'Start Your Internship Journey'}?</h2>
          <p>
            {type === '6-month' 
              ? 'Don\'t just prepare for a job. Build the skills. Gain the experience. Work on real projects. Get career-ready.'
              : 'Don\'t just add another certificate to your resume. Build real skills, work on real projects, and create real career opportunities.'
            }
          </p>
          
          <button className="ip-btn ip-btn-primary" onClick={handleApply}>
            Apply for {internship.title} <Icon icon="mdi:arrow-right" width={18} />
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="ip-modal-overlay" onClick={() => !isSubmitting && setShowApplyModal(false)}>
          <div className="ip-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ip-modal-close" onClick={() => !isSubmitting && setShowApplyModal(false)} disabled={isSubmitting}>
              <Icon icon="mdi:close" width={24} />
            </button>
            
            <h2>Apply for {internship.title}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              Fill in your details to proceed with the registration
            </p>
            
            <form onSubmit={handleSubmit} className="ip-form">
              <div className="ip-field">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              <div className="ip-field">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              <div className="ip-field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  disabled={isSubmitting}
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="ip-field">
                <label>Interested Domain *</label>
                <select
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1.5px solid #e2e5ee',
                    borderRadius: '10px',
                    fontSize: '14.5px',
                    fontFamily: "'Inter', sans-serif",
                    color: '#1a2036',
                    backgroundColor: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select domain</option>
                  {activeCourses.map((course) => (
                    <option key={course.id} value={course.title}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ip-field">
                <label>College Name *</label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                  disabled={isSubmitting}
                  placeholder="Enter your college/university name"
                />
              </div>

              <button type="submit" className="ip-btn ip-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Proceed to Payment'}
                {!isSubmitting && <Icon icon="mdi:arrow-right" width={18} />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="ip-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="ip-modal ip-success-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ip-modal-close" onClick={() => setShowSuccessModal(false)}>
              <Icon icon="mdi:close" width={24} />
            </button>
            
            <div className="ip-success-content">
              <div className="ip-success-icon">
                <Icon icon="mdi:check-circle" width={80} />
              </div>
              
              <h2 className="ip-success-title">Payment Successful!</h2>
              
              <div className="ip-success-details">
                <div className="ip-success-row">
                  <span className="ip-success-label">Program:</span>
                  <span className="ip-success-value">{internship.title}</span>
                </div>
                <div className="ip-success-row">
                  <span className="ip-success-label">Amount Paid:</span>
                  <span className="ip-success-value">{internship.registrationFee}</span>
                </div>
                <div className="ip-success-row">
                  <span className="ip-success-label">Student:</span>
                  <span className="ip-success-value">{formData.name}</span>
                </div>
                <div className="ip-success-row">
                  <span className="ip-success-label">Email:</span>
                  <span className="ip-success-value">{formData.email}</span>
                </div>
                <div className="ip-success-divider"></div>
                <div className="ip-success-row ip-success-highlight">
                  <span className="ip-success-label">Application ID:</span>
                  <span className="ip-success-value ip-success-app-id">{applicationId}</span>
                </div>
              </div>

              <div className="ip-success-message">
                <Icon icon="mdi:email-check" width={24} />
                <p>Your application has been submitted successfully! You will receive a confirmation email shortly.</p>
              </div>

              <button 
                className="ip-btn ip-btn-primary" 
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/dashboard');
                }}
              >
                Go to Dashboard
                <Icon icon="mdi:arrow-right" width={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ip-inline-apply {
          width: 100%;
          padding: 18px 0 8px;
        }

        .ip-inline-apply-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .ip-inline-apply-btn {
          position: relative;
          overflow: hidden;
          min-width: 190px;
          animation: ipApplyPulse 2.2s ease-in-out infinite;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .ip-inline-apply-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 70%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );
          transform: skewX(-20deg);
          animation: ipApplyShine 2.8s ease-in-out infinite;
          pointer-events: none;
        }

        .ip-inline-apply-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
        }

        .ip-inline-apply-btn:active {
          transform: translateY(0) scale(0.98);
        }

        @keyframes ipApplyPulse {
          0%, 100% {
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.10);
          }
          50% {
            box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
          }
        }

        @keyframes ipApplyShine {
          0% {
            left: -120%;
          }
          55%, 100% {
            left: 140%;
          }
        }

        @media (max-width: 640px) {
          .ip-inline-apply {
            padding: 14px 16px 6px;
          }

          .ip-inline-apply-btn {
            width: 100%;
            min-width: 0;
            max-width: 360px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ip-inline-apply-btn,
          .ip-inline-apply-btn::before {
            animation: none;
          }

          .ip-inline-apply-btn {
            transition: none;
          }
        }
      `}</style>

      <Footerpage />
    </div>
  );
};

export default InternshipPage;