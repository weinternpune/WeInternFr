const { UserActivity, UserProgress } = require('../models/UserActivity');
const { Enrollment } = require('../models/Enrollment');

const STUDY_ACTIVITY_TYPES = new Set([
  'course_progress',
  'practice_completed',
  'session_attended',
  'assignment_completed'
]);

const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;

  d.setDate(d.getDate() - diff);
  return d;
};

const getDashboardAnalytics = async (userId) => {
  const [progress, enrollments, activities] =
    await Promise.all([
      UserProgress.findOne({ user: userId }).lean(),

      Enrollment
        .find({ user: userId })
        .sort('-createdAt')
        .lean(),

      UserActivity
        .find({ user: userId })
        .sort('-createdAt')
        .lean()
    ]);

  const activitiesData = activities || [];

  // -----------------------------
  // Study time
  // -----------------------------
  // UserActivity is the source of truth.
  // duration is stored in minutes.
  const totalStudyMinutes =
    activitiesData.reduce(
      (total, activity) => {
        if (
          STUDY_ACTIVITY_TYPES.has(
            activity.activityType
          )
        ) {
          return (
            total +
            Number(activity.duration || 0)
          );
        }

        return total;
      },
      0
    );

  const totalStudyHours =
    Math.round(
      (totalStudyMinutes / 60) * 10
    ) / 10;

  const practiceStudyMinutes =
    activitiesData
      .filter(
        activity =>
          activity.activityType ===
          'practice_completed'
      )
      .reduce(
        (total, activity) =>
          total +
          Number(activity.duration || 0),
        0
      );

  const practiceHours =
    Math.round(
      (practiceStudyMinutes / 60) * 10
    ) / 10;

  // -----------------------------
  // Assignments
  // -----------------------------
  const assignmentActivities =
    activitiesData.filter(
      activity =>
        activity.activityType ===
        'assignment_completed'
    );

  const assignmentsCompleted =
    assignmentActivities.length;

  const assignmentScoresRaw =
    assignmentActivities
      .map(activity =>
        Number(activity.details?.score)
      )
      .filter(score =>
        Number.isFinite(score)
      );

  const averageScore =
    assignmentScoresRaw.length
      ? Math.round(
          assignmentScoresRaw.reduce(
            (sum, score) =>
              sum + score,
            0
          ) /
            assignmentScoresRaw.length
        )
      : 0;

  // -----------------------------
  // Attendance
  // -----------------------------
  const sessionsAttended =
    activitiesData.filter(
      activity =>
        activity.activityType ===
        'session_attended'
    ).length;

  const sessionsTotal =
    Number(progress?.sessionsTotal || 0) ||
    sessionsAttended;

  const attendanceRate =
    sessionsTotal > 0
      ? Math.round(
          (sessionsAttended /
            sessionsTotal) *
            100
        )
      : 0;

  // -----------------------------
  // Weekly activity - last 8 weeks
  // -----------------------------
  const weekStart = getWeekStart();

  const eightWeeksAgo =
    new Date(weekStart);

  eightWeeksAgo.setDate(
    eightWeeksAgo.getDate() - 56
  );

  const weeklyActivity =
    Array.from(
      { length: 8 },
      (_, index) => ({
        week: `W${index + 1}`,
        lectures: 0,
        practice: 0,
        sessions: 0
      })
    );

  // -----------------------------
  // Daily study hours - this week
  // -----------------------------
  const dailyHours = [
    { day: 'Mon', hours: 0 },
    { day: 'Tue', hours: 0 },
    { day: 'Wed', hours: 0 },
    { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 }
  ];

  for (const activity of activitiesData) {
    const date = new Date(
      activity.createdAt ||
      activity.date
    );

    if (Number.isNaN(date.getTime())) {
      continue;
    }

    if (date >= eightWeeksAgo) {
      const daysFromStart =
        Math.floor(
          (date - eightWeeksAgo) /
            86400000
        );

      const weekIndex = Math.min(
        7,
        Math.max(
          0,
          Math.floor(
            daysFromStart / 7
          )
        )
      );

      if (
        activity.activityType ===
        'course_progress'
      ) {
        weeklyActivity[
          weekIndex
        ].lectures++;
      }

      if (
        activity.activityType ===
        'practice_completed'
      ) {
        weeklyActivity[
          weekIndex
        ].practice++;
      }

      if (
        activity.activityType ===
        'session_attended'
      ) {
        weeklyActivity[
          weekIndex
        ].sessions++;
      }
    }

    if (
      date >= weekStart &&
      STUDY_ACTIVITY_TYPES.has(
        activity.activityType
      )
    ) {
      const jsDay = date.getDay();

      const dayIndex =
        jsDay === 0
          ? 6
          : jsDay - 1;

      dailyHours[
        dayIndex
      ].hours +=
        Number(activity.duration || 0) /
        60;
    }
  }

  dailyHours.forEach(item => {
    item.hours =
      Math.round(item.hours * 10) / 10;
  });

  // -----------------------------
  // Assignment scores
  // -----------------------------
  const assignmentScores =
    assignmentActivities
      .filter(activity =>
        Number.isFinite(
          Number(
            activity.details?.score
          )
        )
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      )
      .map(
        (activity, index) => ({
          num: `A${index + 1}`,
          score: Number(
            activity.details.score
          ),
          name:
            activity.details
              ?.assignmentName ||
            `Assignment ${index + 1}`,
          date: activity.createdAt
        })
      );

  // -----------------------------
  // Practice results
  // -----------------------------
  const practiceMap = new Map();

  activitiesData
    .filter(
      activity =>
        activity.activityType ===
          'practice_completed' &&
        activity.details?.challengeName
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .forEach(activity => {
      const name =
        activity.details.challengeName;

      if (!practiceMap.has(name)) {
        const score =
          Number(
            activity.details?.score
          );

        practiceMap.set(name, {
          name,
          score:
            Number.isFinite(score)
              ? score
              : null,
          date: activity.createdAt
        });
      }
    });

  const practiceResults =
    Array.from(
      practiceMap.values()
    );

  const practiceActivities =
    activitiesData.filter(
      activity =>
        activity.activityType ===
        'practice_completed'
    );

  const TOTAL_PRACTICE_PROBLEMS = 6;

  const practiceProblems = {
    solved: practiceActivities.length,
    total: TOTAL_PRACTICE_PROBLEMS
  };

  // -----------------------------
  // Course progress
  // -----------------------------
  const courseProgress =
    enrollments.map(enrollment => {
      const matchingActivities =
        activitiesData.filter(
          activity =>
            activity.activityType ===
              'course_progress' &&
            activity.details
              ?.courseName ===
              enrollment.courseName
        );

      const trackedProgress =
        matchingActivities.reduce(
          (max, activity) => {
            const value = Number(
              activity.details
                ?.progressPercentage || 0
            );

            return Math.max(
              max,
              Math.min(100, value)
            );
          },
          0
        );

      const progressPercentage =
        enrollment.status === 'completed'
          ? 100
          : trackedProgress;

      return {
        id: enrollment._id,
        name: enrollment.courseName,
        progress: progressPercentage,
        status: enrollment.status,
        paymentStatus:
          enrollment.paymentStatus,
        enrolledAt:
          enrollment.createdAt
      };
    });

  const completed =
    courseProgress.filter(
      course =>
        course.progress >= 100
    ).length;

  const inProgress =
    courseProgress.filter(
      course =>
        course.progress > 0 &&
        course.progress < 100
    ).length;

  const pending = Math.max(
    0,
    courseProgress.length -
      completed -
      inProgress
  );

  // -----------------------------
  // Recent activity
  // -----------------------------
  const recentActivities =
    activitiesData.slice(0, 20);

  // -----------------------------
  // Session history
  // -----------------------------
  const sessionHistory =
    activitiesData
      .filter(
        activity =>
          activity.activityType ===
          'session_attended'
      )
      .slice(0, 20)
      .map(activity => ({
        id: activity._id,
        topic:
          activity.details
            ?.sessionTopic ||
          'Live Session',
        duration: Number(
          activity.duration || 0
        ),
        date: activity.createdAt,
        status: 'attended',
        score: Number.isFinite(
          Number(
            activity.details?.score
          )
        )
          ? Number(
              activity.details.score
            )
          : null
      }));

  return {
    totalStudyHours,
    practiceHours,

    currentStreak:
      progress?.currentStreak || 0,

    longestStreak:
      progress?.longestStreak || 0,

    sessionsAttended,
    sessionsTotal,
    attendanceRate,

    assignmentsCompleted,
    averageScore,

    practiceProblems,

    courses: enrollments.length,
    hoursLogged: totalStudyHours,
    attendance: attendanceRate,
    assignments: assignmentsCompleted,
    dayStreak:
      progress?.currentStreak || 0,

    weeklyActivity,
    dailyHours,
    assignmentScores,
    practiceResults,
    courseProgress,

    overallProgress: [
      {
        name: 'Completed',
        value: completed
      },
      {
        name: 'In Progress',
        value: inProgress
      },
      {
        name: 'Pending',
        value: pending
      }
    ],

    recentActivities,
    sessionHistory
  };
};

module.exports = {
  getDashboardAnalytics
};
