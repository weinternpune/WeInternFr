const { UserActivity, UserProgress } = require('../models/UserActivity');

// =====================================================
// TRACK USER ACTIVITY
// =====================================================

const trackActivity = async (
  userId,
  activityType,
  details = {}
) => {
  try {
    // -------------------------------------------------
    // 1. Create activity record
    // -------------------------------------------------

    const activity = new UserActivity({
      user: userId,
      activityType,
      duration: Number(details.duration || 0),
      details
    });

    await activity.save();

    // -------------------------------------------------
    // 2. Find or create user progress
    // -------------------------------------------------

    let progress = await UserProgress.findOne({
      user: userId
    });

    const isNewProgress = !progress;

    if (!progress) {
      progress = new UserProgress({
        user: userId
      });
    }

    // -------------------------------------------------
    // 3. Update daily streak
    // -------------------------------------------------

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (
      isNewProgress ||
      !progress.lastActiveDate
    ) {
      // First activity ever
      progress.currentStreak = 1;

    } else {

      const lastActive = new Date(
        progress.lastActiveDate
      );

      lastActive.setHours(
        0,
        0,
        0,
        0
      );

      const yesterday = new Date(
        today
      );

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      // Same day
      if (
        lastActive.getTime() ===
        today.getTime()
      ) {
        // Do nothing
      }

      // Activity was yesterday
      else if (
        lastActive.getTime() ===
        yesterday.getTime()
      ) {
        progress.currentStreak =
          (progress.currentStreak || 0) + 1;
      }

      // Gap of more than one day
      else {
        progress.currentStreak = 1;
      }
    }

    // -------------------------------------------------
    // 4. Update longest streak
    // -------------------------------------------------

    progress.longestStreak = Math.max(
      progress.longestStreak || 0,
      progress.currentStreak || 0
    );

    // Update last active date
    progress.lastActiveDate = new Date();

    // -------------------------------------------------
    // 5. Update metrics according to activity type
    // -------------------------------------------------

    switch (activityType) {

      // =================================================
      // SESSION ATTENDED
      // =================================================

      case 'session_attended': {

        progress.sessionsAttended =
          (progress.sessionsAttended || 0) + 1;

        /*
         * duration is stored in minutes.
         *
         * Example:
         * 60 minutes → totalStudyHours = 60
         * The getUserStats() function converts this
         * into 1 hour for the frontend.
         */

        if (details.duration) {
          progress.totalStudyHours =
            (progress.totalStudyHours || 0) +
            Number(details.duration);
        }

        break;
      }

      // =================================================
      // PRACTICE COMPLETED
      // =================================================

      case 'practice_completed': {

        // Make sure practiceProblems exists
        if (!progress.practiceProblems) {
          progress.practiceProblems = {
            solved: 0,
            total: 6
          };
        }

        progress.practiceProblems.solved =
          (progress.practiceProblems.solved || 0) + 1;

        // Keep current total at 6 for now.
        // Later this will come from PracticeProblem
        // collection in MongoDB.

        progress.practiceProblems.total = 6;

        if (details.duration) {
          progress.totalStudyHours =
            (progress.totalStudyHours || 0) +
            Number(details.duration);
        }

        break;
      }

      // =================================================
      // ASSIGNMENT COMPLETED
      // =================================================

      case 'assignment_completed': {

        progress.assignmentsCompleted =
          (progress.assignmentsCompleted || 0) + 1;

        // Convert score to number
        const score = Number(
          details.score
        );

        if (Number.isFinite(score)) {

          const previousAssignments =
            progress.assignmentsCompleted - 1;

          const previousAverage =
            Number(
              progress.averageScore || 0
            );

          const totalScore =
            previousAverage *
              previousAssignments +
            score;

          progress.averageScore =
            Math.round(
              totalScore /
              progress.assignmentsCompleted
            );
        }

        if (details.duration) {
          progress.totalStudyHours =
            (progress.totalStudyHours || 0) +
            Number(details.duration);
        }

        break;
      }

      // =================================================
      // COURSE PROGRESS
      // =================================================

      case 'course_progress': {

        if (details.duration) {
          progress.totalStudyHours =
            (progress.totalStudyHours || 0) +
            Number(details.duration);
        }

        break;
      }

      // =================================================
      // DEFAULT
      // =================================================

      default:
        // Activity is saved above even if it does not
        // update a specific progress metric.
        break;
    }

    // -------------------------------------------------
    // 6. Save updated progress
    // -------------------------------------------------

    await progress.save();

    // -------------------------------------------------
    // 7. Return both records
    // -------------------------------------------------

    return {
      activity,
      progress
    };

  } catch (error) {

    console.error(
      'Error tracking activity:',
      error
    );

    throw error;
  }
};


// =====================================================
// GET USER DASHBOARD STATISTICS
// =====================================================

const getUserStats = async (userId) => {

  try {

    // -------------------------------------------------
    // 1. Find user progress
    // -------------------------------------------------

    let progress =
      await UserProgress.findOne({
        user: userId
      });

    // -------------------------------------------------
    // 2. Create progress if it doesn't exist
    // -------------------------------------------------

    if (!progress) {

      progress =
        new UserProgress({
          user: userId
        });

      await progress.save();
    }

    // -------------------------------------------------
    // 3. Calculate attendance percentage
    // -------------------------------------------------

    const sessionsAttended =
      progress.sessionsAttended || 0;

    const sessionsTotal =
      progress.sessionsTotal || 0;

    const attendanceRate =
      sessionsTotal > 0
        ? Math.round(
            (sessionsAttended /
              sessionsTotal) *
              100
          )
        : 0;

    // -------------------------------------------------
    // 4. Convert study minutes to hours
    // -------------------------------------------------

    const totalStudyMinutes =
      Number(
        progress.totalStudyHours || 0
      );

    const totalHours =
      Math.round(
        (totalStudyMinutes / 60) *
        10
      ) / 10;

    // -------------------------------------------------
    // 5. Practice statistics
    // -------------------------------------------------

    const practiceSolved =
      progress.practiceProblems?.solved || 0;

    /*
     * Your current Practice page has 6 hardcoded
     * problems.
     *
     * Later:
     *
     * total = await PracticeProblem.countDocuments({
     *   active: true
     * });
     */

    const practiceTotal = 6;

    // -------------------------------------------------
    // 6. Return dashboard statistics
    // -------------------------------------------------

    return {

      totalStudyHours:
        totalHours,

      currentStreak:
        progress.currentStreak || 0,

      longestStreak:
        progress.longestStreak || 0,

      sessionsAttended,

      attendanceRate,

      assignmentsCompleted:
        progress.assignmentsCompleted || 0,

      averageScore:
        progress.averageScore || 0,

      practiceProblems: {
        solved: practiceSolved,
        total: practiceTotal
      }
    };

  } catch (error) {

    console.error(
      'Error getting user stats:',
      error
    );

    throw error;
  }
};


// =====================================================
// INITIALIZE USER PROGRESS
// =====================================================

const initializeUserProgress = async (
  userId
) => {

  try {

    // -------------------------------------------------
    // Check whether progress already exists
    // -------------------------------------------------

    const existingProgress =
      await UserProgress.findOne({
        user: userId
      });

    if (existingProgress) {
      return existingProgress;
    }

    // -------------------------------------------------
    // Create initial progress
    // -------------------------------------------------

    const newProgress =
      new UserProgress({
        user: userId
      });

    await newProgress.save();

    return newProgress;

  } catch (error) {

    console.error(
      'Error initializing user progress:',
      error
    );

    throw error;
  }
};


// =====================================================
// EXPORT FUNCTIONS
// =====================================================

module.exports = {
  trackActivity,
  getUserStats,
  initializeUserProgress
};