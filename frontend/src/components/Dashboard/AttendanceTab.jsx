import React, { useEffect, useState, useMemo } from 'react';
import { getStudentMentorAttendance } from '../../utils/api';
import './AttendanceTab.css';

const AttendanceTab = ({ setTab }) => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getStudentMentorAttendance();
      if (res.data?.success) {
        setAttendanceList(res.data.data || []);
      }
    } catch (err) {
      console.error('Attendance fetch error:', err);
      setError(err.response?.data?.message || 'Unable to load attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const stats = useMemo(() => {
    const total = attendanceList.length;
    const present = attendanceList.filter((a) => a.status === 'present').length;
    const late = attendanceList.filter((a) => a.status === 'late').length;
    const absent = attendanceList.filter((a) => a.status === 'absent').length;
    const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

    return { total, present, late, absent, rate };
  }, [attendanceList]);

  const filteredList = useMemo(() => {
    if (filter === 'all') return attendanceList;
    return attendanceList.filter((a) => a.status === filter);
  }, [attendanceList, filter]);

  if (loading) {
    return (
      <div className="attendance-page-wrap">
        <div className="att-loading-box">
          <div className="att-spinner" />
          <p>Loading attendance records…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attendance-page-wrap">
        <div className="att-empty-state">
          <div className="att-empty-icon">⚠️</div>
          <h3>Unable to Load Attendance</h3>
          <p>{error}</p>
          <button onClick={loadAttendance} className="att-btn-primary">
            ↻ Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-page-wrap">
      {/* ── HEADER ── */}
      <div className="att-header">
        <div>
          <h2>Attendance Log & Progress</h2>
          <p>Real-time attendance record marked by your assigned mentor for live lectures & sessions.</p>
        </div>
        <button onClick={loadAttendance} className="att-btn-refresh">
          ↻ Refresh
        </button>
      </div>

      {/* ── KPI METRICS ── */}
      <div className="att-kpi-grid">
        <div
          className={`att-kpi-card rate-card ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span>Attendance Rate</span>
          <strong style={{ color: stats.rate >= 75 ? '#16a34a' : '#dc2626' }}>
            {stats.rate}%
          </strong>
          <small>{stats.rate >= 75 ? 'Excellent standing' : 'Needs improvement'}</small>
        </div>
        <div
          className={`att-kpi-card ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span>Total Sessions</span>
          <strong>{stats.total}</strong>
          <small>Conducted classes</small>
        </div>
        <div
          className={`att-kpi-card present-kpi ${filter === 'present' ? 'active' : ''}`}
          onClick={() => setFilter('present')}
        >
          <span>Present</span>
          <strong style={{ color: '#16a34a' }}>{stats.present}</strong>
          <small>On-time attendance</small>
        </div>
        <div
          className={`att-kpi-card late-kpi ${filter === 'late' ? 'active' : ''}`}
          onClick={() => setFilter('late')}
        >
          <span>Late</span>
          <strong style={{ color: '#d97706' }}>{stats.late}</strong>
          <small>Partial credit</small>
        </div>
        <div
          className={`att-kpi-card absent-kpi ${filter === 'absent' ? 'active' : ''}`}
          onClick={() => setFilter('absent')}
        >
          <span>Absent</span>
          <strong style={{ color: '#dc2626' }}>{stats.absent}</strong>
          <small>Missed classes</small>
        </div>
      </div>

      {/* ── ATTENDANCE LOG TABLE / LIST ── */}
      {filteredList.length === 0 ? (
        <div className="att-empty-state">
          <div className="att-empty-icon">🗓️</div>
          <h3>No Attendance Records Found</h3>
          <p>
            {attendanceList.length === 0
              ? 'No live class attendance has been logged by your mentor yet. Attendance will update automatically when mentor marks the session.'
              : 'No attendance records match the selected filter.'}
          </p>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="att-btn-primary">
              Show All Sessions
            </button>
          )}
        </div>
      ) : (
        <div className="att-table-card">
          <div className="att-table-responsive">
            <table className="att-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Session / Class Topic</th>
                  <th>Mentor</th>
                  <th>Status</th>
                  <th>Remarks / Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((row) => {
                  const classInfo = row.classId;
                  const sessionTitle = classInfo?.title || row.topic || 'Mentorship Lecture';
                  const dateStr = row.date || classInfo?.date || row.markedAt;
                  const formattedDate = dateStr
                    ? new Date(dateStr).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '—';

                  const timeStr =
                    classInfo?.startTime && classInfo?.endTime
                      ? `${classInfo.startTime} - ${classInfo.endTime}`
                      : row.markedAt
                      ? new Date(row.markedAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '—';

                  return (
                    <tr key={row._id}>
                      <td>
                        <div className="att-cell-date">
                          <strong>{formattedDate}</strong>
                          <small>{timeStr}</small>
                        </div>
                      </td>
                      <td>
                        <div className="att-cell-topic">
                          <strong>{sessionTitle}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="att-mentor-name">
                          {row.mentor?.name || 'Assigned Mentor'}
                        </span>
                      </td>
                      <td>
                        <span className={`att-badge ${row.status}`}>
                          {row.status === 'present'
                            ? '● Present'
                            : row.status === 'late'
                            ? '▲ Late'
                            : '✕ Absent'}
                        </span>
                      </td>
                      <td>
                        <span className="att-remarks">
                          {row.remarks || row.notes || '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;
