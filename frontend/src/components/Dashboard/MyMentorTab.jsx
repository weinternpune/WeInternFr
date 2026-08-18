import React, { useEffect, useState } from 'react';
import {
  getStudentMentorOverview,
  sendStudentMentorMessage
} from '../../utils/api';
import toast from 'react-hot-toast';
import './MyMentorTab.css';

const MyMentorTab = ({ user, setTab }) => {
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Message modal state
  const [messageOpen, setMessageOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const loadMentorOverview = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getStudentMentorOverview();
      if (res.data?.success) {
        setMentorData(res.data.data);
      }
    } catch (err) {
      console.error('Mentor overview fetch failed:', err);
      setError(err.response?.data?.message || 'Unable to load mentor details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMentorOverview();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !messageText.trim()) {
      toast.error('Please fill in both subject and message.');
      return;
    }

    setSendingMsg(true);
    try {
      await sendStudentMentorMessage({
        subject: subject.trim(),
        message: messageText.trim()
      });
      toast.success('Message sent to your mentor successfully!');
      setSubject('');
      setMessageText('');
      setMessageOpen(false);
      await loadMentorOverview();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="my-mentor-wrap">
        <div className="mm-loading-state">
          <div className="mm-spinner" />
          <p>Loading your mentor information…</p>
        </div>
      </div>
    );
  }

  if (error && !mentorData) {
    return (
      <div className="my-mentor-wrap">
        <div className="mm-empty-card">
          <div className="mm-empty-icon">⚠️</div>
          <h3>Unable to Load Mentor Info</h3>
          <p>{error}</p>
          <button onClick={loadMentorOverview} className="mm-btn-primary">
            ↻ Retry
          </button>
        </div>
      </div>
    );
  }

  const mentor = mentorData?.mentor;
  const classes = mentorData?.classes || [];
  const notifications = mentorData?.notifications || [];
  const stats = mentorData?.stats || {
    attendanceRate: 100,
    totalSessions: 0,
    presentCount: 0,
    totalAssignments: 0,
    completedAssignments: 0
  };

  return (
    <div className="my-mentor-wrap">
      {/* ── TOP HEADER ── */}
      <div className="mm-header">
        <div>
          <h2>My Mentor & Batches</h2>
          <p>Connect with your assigned mentor, view schedules, live sessions & announcements.</p>
        </div>
        <div className="mm-header-actions">
          {mentor && (
            <button onClick={() => setMessageOpen(true)} className="mm-btn-message">
              ✉️ Message Mentor
            </button>
          )}
          <button onClick={loadMentorOverview} className="mm-btn-refresh">
            ↻ Refresh
          </button>
        </div>
      </div>

      {!mentor ? (
        /* ── UNASSIGNED MENTOR EMPTY STATE ── */
        <div className="mm-empty-card">
          <div className="mm-empty-icon">👨‍🏫</div>
          <h3>Mentorship Allocation in Progress</h3>
          <p>
            Your mentor is currently being assigned by administration based on your enrolled domain and batch.
            Once allocated, you will see your mentor’s contact profile, live classes schedule, assignments, and announcements right here.
          </p>
          <div className="mm-empty-actions">
            <button onClick={() => setTab('overview')} className="mm-btn-outline">
              Back to Overview
            </button>
            <button onClick={() => setTab('allcourses')} className="mm-btn-primary">
              Explore Courses
            </button>
          </div>
        </div>
      ) : (
        /* ── MENTOR CONTENT GRID ── */
        <div className="mm-content-grid">
          {/* 1. MENTOR PROFILE CARD */}
          <div className="mm-card mm-profile-card">
            <div className="mm-profile-header">
              <div className="mm-avatar">
                {mentor.avatar ? (
                  <img src={mentor.avatar} alt={mentor.name} />
                ) : (
                  <span>{mentor.name?.charAt(0).toUpperCase() || 'M'}</span>
                )}
              </div>
              <div className="mm-profile-meta">
                <span className="mm-badge-role">Assigned Mentor</span>
                <h3>{mentor.name}</h3>
                <p className="mm-mentor-email">✉️ {mentor.email}</p>
                {mentor.phone && <p className="mm-mentor-phone">📞 {mentor.phone}</p>}
              </div>
            </div>

            <div className="mm-tags-row">
              {mentor.expertise && (
                <span className="mm-tag expertise">🎯 {mentor.expertise}</span>
              )}
              {mentor.experience && (
                <span className="mm-tag exp">⏱️ {mentor.experience} Exp</span>
              )}
              {Array.isArray(mentor.assignedBatches) && mentor.assignedBatches.length > 0 && (
                <span className="mm-tag batch">🏷️ Batch: {mentor.assignedBatches.join(', ')}</span>
              )}
            </div>

            {mentor.skills && Array.isArray(mentor.skills) && mentor.skills.length > 0 && (
              <div className="mm-skills-box">
                <span className="mm-skills-label">Specializations:</span>
                <div className="mm-skill-pills">
                  {mentor.skills.map((s, idx) => (
                    <span key={idx} className="mm-skill-pill">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {mentor.bio && (
              <div className="mm-bio-box">
                <span className="mm-bio-label">About Mentor:</span>
                <p>{mentor.bio}</p>
              </div>
            )}

            <div className="mm-quick-metrics">
              <div className="mm-metric" onClick={() => setTab('attendance')}>
                <span>Attendance</span>
                <strong>{stats.attendanceRate}%</strong>
                <small>{stats.presentCount}/{stats.totalSessions} Sessions</small>
              </div>
              <div className="mm-metric" onClick={() => setTab('assignments')}>
                <span>Assignments</span>
                <strong>{stats.completedAssignments}/{stats.totalAssignments}</strong>
                <small>Submitted</small>
              </div>
              <div className="mm-metric" onClick={() => setTab('sessions')}>
                <span>Live Classes</span>
                <strong>{classes.length}</strong>
                <small>Scheduled</small>
              </div>
            </div>
          </div>

          {/* 2. UPCOMING LIVE SESSIONS */}
          <div className="mm-card mm-classes-card">
            <div className="mm-card-head">
              <h3>📅 Live Sessions & Classes</h3>
              <button onClick={() => setTab('sessions')} className="mm-link-btn">
                View All
              </button>
            </div>

            {classes.length === 0 ? (
              <div className="mm-sub-empty">
                <span>🗓️</span>
                <p>No upcoming live sessions scheduled by your mentor.</p>
              </div>
            ) : (
              <div className="mm-classes-list">
                {classes.slice(0, 4).map((c) => {
                  const classDate = c.date
                    ? new Date(c.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })
                    : 'Upcoming';

                  return (
                    <div key={c._id} className="mm-class-item">
                      <div className="mm-class-date-badge">
                        <span>{classDate}</span>
                        <small>{c.startTime || 'TBA'} - {c.endTime || 'TBA'}</small>
                      </div>
                      <div className="mm-class-info">
                        <h4>{c.title}</h4>
                        <p>{c.topic || c.description || 'Live interactive session with mentor'}</p>
                      </div>
                      <div className="mm-class-action">
                        {c.status === 'live' ? (
                          <a
                            href={c.meetingLink || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="mm-btn-join live"
                          >
                            ● JOIN LIVE
                          </a>
                        ) : c.meetingLink ? (
                          <a
                            href={c.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mm-btn-join"
                          >
                            Meeting Link
                          </a>
                        ) : (
                          <span className="mm-badge-scheduled">Scheduled</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. MENTOR ANNOUNCEMENTS & NOTIFICATIONS */}
          <div className="mm-card mm-notifs-card">
            <div className="mm-card-head">
              <h3>📢 Announcements & Updates</h3>
            </div>

            {notifications.length === 0 ? (
              <div className="mm-sub-empty">
                <span>🔔</span>
                <p>No recent announcements from your mentor.</p>
              </div>
            ) : (
              <div className="mm-notifs-list">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n._id} className="mm-notif-item">
                    <div className="mm-notif-dot" />
                    <div className="mm-notif-content">
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <small>
                        {new Date(n.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MESSAGE MODAL ── */}
      {messageOpen && (
        <div
          className="mm-modal-overlay"
          onClick={(e) => {
            if (e.target.className === 'mm-modal-overlay') setMessageOpen(false);
          }}
        >
          <div className="mm-modal-box">
            <div className="mm-modal-top">
              <div>
                <span className="mm-modal-eyebrow">DIRECT COMMUNICATION</span>
                <h3>Message to {mentor?.name}</h3>
              </div>
              <button className="mm-modal-close" onClick={() => setMessageOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="mm-modal-form">
              <label>
                Subject / Query Title *
                <input
                  required
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Doubts regarding Project 2 submission"
                />
              </label>

              <label>
                Your Message *
                <textarea
                  required
                  rows={5}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Describe your query or update for your mentor..."
                />
              </label>

              <div className="mm-modal-actions">
                <button
                  type="button"
                  className="mm-btn-outline"
                  onClick={() => setMessageOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingMsg}
                  className="mm-btn-primary"
                >
                  {sendingMsg ? 'Sending...' : '✉️ Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMentorTab;
