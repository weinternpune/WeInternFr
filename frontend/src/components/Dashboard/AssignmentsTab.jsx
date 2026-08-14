import React, { useEffect, useState } from 'react';
import {
  getStudentMentorAssignments,
  submitStudentMentorAssignment
} from '../../utils/api';

const AssignmentsTab = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected assignment for details modal
  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  // Submission form
  const [answer, setAnswer] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);


  // =========================================================
  // LOAD ASSIGNMENTS
  // =========================================================

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError('');

      const response =
        await getStudentMentorAssignments();

      console.log(
        'ASSIGNMENTS API RESPONSE:',
        response.data
      );

      setAssignments(
        response.data?.data || []
      );

    } catch (err) {

      console.error(
        'ASSIGNMENTS ERROR:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Unable to load assignments'
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadAssignments();
  }, []);


  // =========================================================
  // OPEN ASSIGNMENT
  // =========================================================

  const openAssignment = (assignment) => {

    setSelectedAssignment(assignment);

    // Load previous submission if it exists
    setAnswer(
      assignment.submission?.answer || ''
    );

    setGithubUrl(
      assignment.submission?.githubUrl || ''
    );

    setFileUrl(
      assignment.submission?.fileUrl || ''
    );
  };


  // =========================================================
  // CLOSE ASSIGNMENT
  // =========================================================

  const closeAssignment = () => {

    setSelectedAssignment(null);

    setAnswer('');
    setGithubUrl('');
    setFileUrl('');
  };


  // =========================================================
  // SUBMIT ASSIGNMENT
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!selectedAssignment) {
      return;
    }

    if (
      !answer.trim() &&
      !githubUrl.trim() &&
      !fileUrl.trim()
    ) {
      alert(
        'Please provide your answer or a GitHub/file link.'
      );

      return;
    }

    try {

      setSubmitting(true);

      const response =
        await submitStudentMentorAssignment(
          selectedAssignment._id,
          {
            answer,
            githubUrl,
            fileUrl
          }
        );

      console.log(
        'SUBMISSION RESPONSE:',
        response.data
      );

      alert(
        'Assignment submitted successfully!'
      );

      closeAssignment();

      // Refresh assignment list
      await loadAssignments();

    } catch (err) {

      console.error(
        'SUBMISSION ERROR:',
        err
      );

      alert(
        err.response?.data?.message ||
        'Unable to submit assignment.'
      );

    } finally {

      setSubmitting(false);
    }
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="assignments-page">

        <div className="assignment-loading">
          <div className="assignment-spinner"></div>

          <p>
            Loading assignments...
          </p>
        </div>

      </div>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <div className="assignments-page">

        <div className="assignment-error">

          <div className="assignment-error-icon">
            !
          </div>

          <h3>
            Unable to load assignments
          </h3>

          <p>
            {error}
          </p>

          <button
            onClick={loadAssignments}
            className="assignment-refresh-btn"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="assignments-page">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="assignments-header">

        <div>

          <h2>
            My Assignments
          </h2>

          <p>
            Assignments given to you by your mentor.
          </p>

        </div>

        <button
          onClick={loadAssignments}
          className="assignment-refresh-btn"
        >
          ↻ Refresh
        </button>

      </div>


      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {assignments.length === 0 ? (

        <div className="assignment-empty">

          <div className="assignment-empty-icon">
            <span>📄</span>
          </div>

          <h3>
            No assignments yet
          </h3>

          <p>
            Your mentor has not assigned any
            assignments to you.
          </p>

        </div>

      ) : (


        /* ===================================================
           ASSIGNMENT LIST
        ==================================================== */

        <div className="assignment-list">

          {assignments.map((assignment) => {

            const submission =
              assignment.submission;

            let status = 'Pending';

            if (submission) {

              if (
                submission.status === 'reviewed'
              ) {
                status = 'Reviewed';

              } else if (
                submission.status === 'approved'
              ) {
                status = 'Approved';

              } else if (
                submission.status === 'submitted'
              ) {
                status = 'Submitted';

              } else if (
                submission.status ===
                'changes_requested'
              ) {
                status = 'Changes Requested';
              }
            }


            return (

              <div
                key={assignment._id}
                className="assignment-card"
              >

                {/* LEFT ICON */}
                <div className="assignment-card-icon">

                  <div className="document-icon">

                    <div className="document-fold"></div>

                    <div className="document-line"></div>
                    <div className="document-line"></div>
                    <div className="document-line short"></div>

                  </div>

                </div>


                {/* CONTENT */}
                <div className="assignment-card-content">

                  <div className="assignment-card-header">

                    <div>

                      <h3>
                        {assignment.title}
                      </h3>

                      <p>
                        {assignment.description}
                      </p>

                    </div>

                    <span
                      className={`assignment-status ${status
                        .toLowerCase()
                        .replace(
                          / /g,
                          '-'
                        )}`}
                    >
                      {status}
                    </span>

                  </div>


                  {/* META */}
                  <div className="assignment-meta">

                    <div>

                      <span>
                        Mentor
                      </span>

                      <strong>
                        {assignment.mentor?.name ||
                          'Assigned Mentor'}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Course
                      </span>

                      <strong>
                        {assignment.course ||
                          '—'}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Due Date
                      </span>

                      <strong>
                        {assignment.dueDate
                          ? new Date(
                              assignment.dueDate
                            ).toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }
                            )
                          : '—'}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Maximum Score
                      </span>

                      <strong>
                        {assignment.maxScore ||
                          100}
                      </strong>

                    </div>

                  </div>


                  {/* BUTTON */}
                  <div className="assignment-card-footer">

                    <button
                      className="view-assignment-btn"
                      onClick={() =>
                        openAssignment(
                          assignment
                        )
                      }
                    >
                      View Assignment →
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}


      {/* =====================================================
          ASSIGNMENT DETAILS MODAL
      ====================================================== */}

      {selectedAssignment && (

        <div
          className="assignment-modal-overlay"
          onClick={(e) => {

            if (
              e.target === e.currentTarget
            ) {
              closeAssignment();
            }

          }}
        >

          <div className="assignment-modal">

            {/* MODAL HEADER */}

            <div className="assignment-modal-header">

              <div className="modal-title-area">

                <div className="modal-document-icon">
                  📄
                </div>

                <div>

                  <span>
                    ASSIGNMENT
                  </span>

                  <h2>
                    {selectedAssignment.title}
                  </h2>

                </div>

              </div>


              <button
                className="modal-close-btn"
                onClick={closeAssignment}
              >
                ×
              </button>

            </div>


            {/* ASSIGNMENT DETAILS */}

            <div className="assignment-modal-body">

              <div className="modal-info-grid">

                <div>
                  <span>
                    Mentor
                  </span>

                  <strong>
                    {selectedAssignment.mentor?.name ||
                      'Assigned Mentor'}
                  </strong>
                </div>


                <div>
                  <span>
                    Course
                  </span>

                  <strong>
                    {selectedAssignment.course ||
                      '—'}
                  </strong>
                </div>


                <div>
                  <span>
                    Batch
                  </span>

                  <strong>
                    {selectedAssignment.batch ||
                      '—'}
                  </strong>
                </div>


                <div>
                  <span>
                    Due Date
                  </span>

                  <strong>
                    {selectedAssignment.dueDate
                      ? new Date(
                          selectedAssignment.dueDate
                        ).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }
                        )
                      : '—'}
                  </strong>
                </div>


                <div>
                  <span>
                    Maximum Score
                  </span>

                  <strong>
                    {selectedAssignment.maxScore ||
                      100}
                  </strong>
                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="modal-section">

                <h3>
                  Assignment Description
                </h3>

                <div className="assignment-description-box">

                  <p>
                    {selectedAssignment.description ||
                      'No description provided.'}
                  </p>

                </div>

              </div>


              {/* EXISTING REVIEW */}

              {selectedAssignment.submission &&
                selectedAssignment.submission.status ===
                  'reviewed' && (

                <div className="mentor-review-box">

                  <h3>
                    Mentor Review
                  </h3>

                  <div className="review-score">

                    <span>
                      Score
                    </span>

                    <strong>
                      {selectedAssignment.submission.score ??
                        '—'}
                      /
                      {selectedAssignment.maxScore ||
                        100}
                    </strong>

                  </div>


                  {selectedAssignment.submission.feedback && (

                    <div>

                      <span>
                        Feedback
                      </span>

                      <p>
                        {
                          selectedAssignment
                            .submission
                            .feedback
                        }
                      </p>

                    </div>
                  )}

                </div>
              )}


              {/* SUBMISSION FORM */}

              <form
                onSubmit={handleSubmit}
                className="assignment-submission-form"
              >

                <h3>
                  Submit Your Assignment
                </h3>

                <p className="submission-help">
                  Complete your assignment and
                  submit your answer below.
                </p>


                {/* ANSWER */}

                <label>

                  Your Answer / Explanation

                  <textarea
                    value={answer}
                    onChange={(e) =>
                      setAnswer(
                        e.target.value
                      )
                    }
                    placeholder="Write your solution, explanation, or notes here..."
                    rows={7}
                  />

                </label>


                {/* GITHUB */}

                <label>

                  GitHub Repository URL
                  <span className="optional">
                    (optional)
                  </span>

                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) =>
                      setGithubUrl(
                        e.target.value
                      )
                    }
                    placeholder="https://github.com/username/project"
                  />

                </label>


                {/* FILE */}

                <label>

                  File / Google Drive URL
                  <span className="optional">
                    (optional)
                  </span>

                  <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) =>
                      setFileUrl(
                        e.target.value
                      )
                    }
                    placeholder="https://drive.google.com/..."
                  />

                </label>


                {/* ACTIONS */}

                <div className="submission-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={
                      closeAssignment
                    }
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="submit-assignment-btn"
                    disabled={submitting}
                  >
                    {submitting
                      ? 'Submitting...'
                      : selectedAssignment
                          .submission
                          ?.status ===
                        'submitted'
                        ? 'Update Submission'
                        : 'Submit Assignment'}
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