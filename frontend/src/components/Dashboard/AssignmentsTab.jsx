import React, { useEffect, useState, useMemo } from 'react';
import {
  getStudentMentorAssignments,
  submitStudentMentorAssignment,
  uploadMentorFile
} from '../../utils/api';
import toast from 'react-hot-toast';
import './AssignmentsTab.css';

const AssignmentsTab = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected assignment for details modal
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Submission form state
  const [answer, setAnswer] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getStudentMentorAssignments();
      setAssignments(response.data?.data || []);
    } catch (err) {
      console.error('Assignments error:', err);
      setError(err.response?.data?.message || 'Unable to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const openAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setAnswer(assignment.submission?.answer || '');
    setGithubUrl(assignment.submission?.githubUrl || '');
    setFileUrl(assignment.submission?.fileUrl || '');
    setFileName('');
  };

  const closeAssignment = () => {
    setSelectedAssignment(null);
    setAnswer('');
    setGithubUrl('');
    setFileUrl('');
    setFileName('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await uploadMentorFile(formData);
      setFileUrl(res.data.fileUrl);
      setFileName(file.name);
      toast.success(`Uploaded ${file.name}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    if (!answer.trim() && !githubUrl.trim() && !fileUrl.trim()) {
      toast.error('Please provide your answer, GitHub repository, or file link.');
      return;
    }

    setSubmitting(true);
    try {
      await submitStudentMentorAssignment(selectedAssignment._id, {
        answer,
        githubUrl,
        fileUrl
      });
      toast.success('Assignment submitted successfully!');
      closeAssignment();
      await loadAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to submit assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    const total = assignments.length;
    let pending = 0;
    let submitted = 0;
    let reviewed = 0;

    assignments.forEach((a) => {
      const s = a.submission?.status;
      if (!s || s === 'pending') pending++;
      else if (s === 'submitted') submitted++;
      else if (['reviewed', 'approved', 'changes_requested'].includes(s)) reviewed++;
    });

    return { total, pending, submitted, reviewed };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    if (statusFilter === 'all') return assignments;
    return assignments.filter((a) => {
      const s = a.submission?.status || 'pending';
      if (statusFilter === 'pending') return !a.submission || s === 'pending';
      if (statusFilter === 'submitted') return s === 'submitted';
      if (statusFilter === 'reviewed') return ['reviewed', 'approved', 'changes_requested'].includes(s);
      return true;
    });
  }, [assignments, statusFilter]);

  if (loading) {
    return (
      <div className="assignments-page">
        <div className="assignment-loading-box">
          <div className="assignment-loading-spinner" />
          <p>Loading your assignments…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignments-page">
        <div className="assignment-empty-state">
          <div className="assignment-empty-icon">⚠️</div>
          <h3>Unable to load assignments</h3>
          <p>{error}</p>
          <button onClick={loadAssignments} className="assignment-refresh-btn">
            ↻ Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assignments-page">
      {/* Header & Quick Filter Bar */}
      <div className="assignments-header-row">
        <div>
          <h2>My Assigned Tasks & Projects</h2>
          <p>Practical assignments and reviews provided by your mentor.</p>
        </div>
        <button onClick={loadAssignments} className="assignment-refresh-btn">
          ↻ Refresh
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="assignment-kpi-grid">
        <div
          className={`assignment-kpi-card ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          <span>Total Tasks</span>
          <strong>{stats.total}</strong>
          <small>Assigned by mentor</small>
        </div>
        <div
          className={`assignment-kpi-card pending-kpi ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter('pending')}
        >
          <span>Pending</span>
          <strong style={{ color: '#d97706' }}>{stats.pending}</strong>
          <small>Awaiting your submission</small>
        </div>
        <div
          className={`assignment-kpi-card submitted-kpi ${statusFilter === 'submitted' ? 'active' : ''}`}
          onClick={() => setStatusFilter('submitted')}
        >
          <span>Submitted</span>
          <strong style={{ color: '#2563eb' }}>{stats.submitted}</strong>
          <small>Under mentor review</small>
        </div>
        <div
          className={`assignment-kpi-card reviewed-kpi ${statusFilter === 'reviewed' ? 'active' : ''}`}
          onClick={() => setStatusFilter('reviewed')}
        >
          <span>Reviewed</span>
          <strong style={{ color: '#16a34a' }}>{stats.reviewed}</strong>
          <small>Graded & evaluated</small>
        </div>
      </div>

      {/* Empty State */}
      {filteredAssignments.length === 0 ? (
        <div className="assignment-empty-state">
          <div className="assignment-empty-icon">📋</div>
          <h3>No assignments found</h3>
          <p>
            {assignments.length === 0
              ? 'Your mentor has not assigned any tasks to your batch yet.'
              : 'No assignments match the selected status filter.'}
          </p>
          {statusFilter !== 'all' && (
            <button onClick={() => setStatusFilter('all')} className="assignment-refresh-btn">
              Show All Tasks
            </button>
          )}
        </div>
      ) : (
        /* Compact Responsive Cards Grid */
        <div className="assignment-compact-grid">
          {filteredAssignments.map((assignment) => {
            const submission = assignment.submission;
            let statusLabel = 'Pending';
            let statusClass = 'pending';

            if (submission) {
              if (submission.status === 'reviewed') {
                statusLabel = 'Reviewed';
                statusClass = 'reviewed';
              } else if (submission.status === 'approved') {
                statusLabel = 'Approved';
                statusClass = 'approved';
              } else if (submission.status === 'submitted') {
                statusLabel = 'Submitted';
                statusClass = 'submitted';
              } else if (submission.status === 'changes_requested') {
                statusLabel = 'Changes Requested';
                statusClass = 'changes-requested';
              }
            }

            const formattedDue = assignment.dueDate
              ? new Date(assignment.dueDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              : 'Flexible';

            return (
              <div key={assignment._id} className="assignment-compact-card">
                <div className="assignment-card-topbar">
                  <span className="assignment-course-badge">
                    {assignment.course || 'Mentorship Task'}
                  </span>
                  <span className={`assignment-status-chip ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                <h3 className="assignment-card-heading">{assignment.title}</h3>
                <p className="assignment-card-summary">
                  {assignment.description || 'No additional instructions provided.'}
                </p>

                <div className="assignment-details-pills">
                  <div className="detail-pill">
                    <span>Mentor</span>
                    <strong>{assignment.mentor?.name || 'Assigned Mentor'}</strong>
                  </div>
                  <div className="detail-pill">
                    <span>Due Date</span>
                    <strong>{formattedDue}</strong>
                  </div>
                  <div className="detail-pill">
                    <span>Max Score</span>
                    <strong>{assignment.maxScore || 100} pts</strong>
                  </div>
                  {submission && submission.score !== undefined && (
                    <div className="detail-pill highlight">
                      <span>Your Score</span>
                      <strong style={{ color: '#16a34a' }}>
                        {submission.score} / {assignment.maxScore || 100}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="assignment-card-bottom">
                  <button
                    onClick={() => openAssignment(assignment)}
                    className={`assignment-action-btn ${submission ? 'view' : 'submit'}`}
                  >
                    {submission ? '📄 View Submission / Grade' : '✏️ Submit Solution →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ASSIGNMENT SUBMISSION MODAL ── */}
      {selectedAssignment && (
        <div
          className="assignment-modal-overlay"
          onClick={(e) => {
            if (e.target.className === 'assignment-modal-overlay') closeAssignment();
          }}
        >
          <div className="assignment-compact-modal">
            <div className="modal-top">
              <div>
                <span className="modal-eyebrow">TASK DETAILS & SUBMISSION</span>
                <h2>{selectedAssignment.title}</h2>
              </div>
              <button className="modal-close-x" onClick={closeAssignment}>
                ×
              </button>
            </div>

            <div className="modal-scroll-body">
              {/* Meta Grid */}
              <div className="modal-meta-row">
                <div>
                  <span>Mentor:</span>
                  <strong>{selectedAssignment.mentor?.name || 'Assigned Mentor'}</strong>
                </div>
                <div>
                  <span>Course / Batch:</span>
                  <strong>{selectedAssignment.course || 'Mentorship Program'}</strong>
                </div>
                <div>
                  <span>Due Date:</span>
                  <strong>
                    {selectedAssignment.dueDate
                      ? new Date(selectedAssignment.dueDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      : 'Flexible'}
                  </strong>
                </div>
                <div>
                  <span>Max Score:</span>
                  <strong>{selectedAssignment.maxScore || 100} Points</strong>
                </div>
              </div>

              {/* Instructions */}
              <div className="modal-desc-section">
                <h4>Assignment Description</h4>
                <div className="desc-content">
                  {selectedAssignment.description || 'No detailed description provided.'}
                </div>
                {/* Multiple Attachments Support */}
                {selectedAssignment.attachmentUrls && selectedAssignment.attachmentUrls.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <strong style={{ fontSize: '.75rem', color: '#516078' }}>
                      📎 Attached Files ({selectedAssignment.attachmentUrls.length}):
                    </strong>
                    {selectedAssignment.attachmentUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#f0fdf4',
                          color: '#166534',
                          border: '1px solid #bbf7d0',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '.75rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          width: 'fit-content'
                        }}
                      >
                        📄 {selectedAssignment.attachmentNames?.[index] || `Attachment ${index + 1}`}
                      </a>
                    ))}
                  </div>
                )}
                {/* Legacy single attachment support */}
                {selectedAssignment.attachmentUrl && (!selectedAssignment.attachmentUrls || selectedAssignment.attachmentUrls.length === 0) && (
                  <div style={{ marginTop: '12px' }}>
                    <a
                      href={selectedAssignment.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#f0fdf4',
                        color: '#166534',
                        border: '1px solid #bbf7d0',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '.75rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      📄 Download Attached Brief / Problem Statement (PDF)
                    </a>
                  </div>
                )}
              </div>

              {/* Mentor Feedback Box if Reviewed */}
              {selectedAssignment.submission?.status === 'reviewed' && (
                <div className="mentor-grade-callout">
                  <h4>👨‍🏫 Mentor Evaluation</h4>
                  <div className="grade-score-display">
                    Score:{' '}
                    <strong>
                      {selectedAssignment.submission.score ?? '—'} /{' '}
                      {selectedAssignment.maxScore || 100}
                    </strong>
                  </div>
                  {selectedAssignment.submission.feedback && (
                    <p className="grade-feedback-text">
                      "{selectedAssignment.submission.feedback}"
                    </p>
                  )}
                </div>
              )}

              {/* Submission Form */}
              <form onSubmit={handleSubmit} className="modal-submit-form">
                <h4>
                  {selectedAssignment.submission ? 'Update Your Solution' : 'Submit Your Solution'}
                </h4>

                <label>
                  Solution / Explanation *
                  <textarea
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Write your explanation, code snippets, or key findings..."
                    rows={4}
                  />
                </label>

                <div style={{ margin: '10px 0' }}>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Upload Solution PDF / ZIP / Document
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <label style={{
                      background: '#f8fafc',
                      border: '1.5px dashed #cbd5e1',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      fontSize: '.75rem',
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      📁 {uploading ? 'Uploading...' : 'Choose PDF / ZIP File'}
                      <input type="file" accept=".pdf,.doc,.docx,.zip,.png,.jpg" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading}/>
                    </label>
                    {(fileName || fileUrl) && (
                      <span style={{ fontSize: '.75rem', color: '#166534', fontWeight: 600 }}>
                        ✅ {fileName || 'File Attached'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-two-col">
                  <label>
                    GitHub Repo URL (optional)
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/project"
                    />
                  </label>
                  <label>
                    Or External Link (Drive/Docs)
                    <input
                      type="url"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                    />
                  </label>
                </div>

                <div className="modal-button-row">
                  <button type="button" className="btn-cancel" onClick={closeAssignment}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit-task"
                    disabled={submitting}
                  >
                    {submitting
                      ? 'Submitting...'
                      : selectedAssignment.submission?.status === 'submitted'
                      ? '✓ Update Submission'
                      : '✓ Submit Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsTab;