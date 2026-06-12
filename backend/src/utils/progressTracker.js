const { UserActivity, UserProgress } = require('../models/UserActivity');

// Track user activity and update progress
const trackActivity = async (userId, activityType, details = {}) => {
  try {
    // Create activity record
    const activity = new UserActivity({
      user: userId,
      activityType,
      duration: details.duration || 0,
      details
    });
    await activity.save();

    // Update or create user progress
    let progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      progress = new UserProgress({ user: userId });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = new Date(progress.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    // Update streak
    if (lastActive.getTime() === today.getTime()) {
      // Same day, no streak change
    } else if (lastActive.getTime() === today.getTime() - 86400000) {
      // Yesterday, continue streak
      progress.currentStreak += 1;
    } else {
      // Gap in days, reset streak
      progress.currentStreak = 1;
    }

    progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
    progress.lastActiveDate = new Date();

    // Update specific metrics based on activity type
    switch (activityType) {
      case 'session_attended':
        progress.sessionsAttended += 1;
        if (details.duration) {
          progress.totalStudyHours += details.duration;
        }
        break;
      
      case 'practice_completed':
        progress.practiceProblems.solved += 1;
        if (details.duration) {
          progress.totalStudyHours += details.duration;
        }
        break;
      
      case 'assignment_completed':
        progress.assignmentsCompleted += 1;
        if (details.score) {
          // Recalculate average score
          const totalScore = progress.averageScore * (progress.assignmentsCompleted - 1) + details.score;
          progress.averageScore = Math.round(totalScore / progress.assignmentsCompleted);
        }
        if (details.duration) {
          progress.totalStudyHours += details.duration;
        }
        break;
      
      case 'course_progress':
        if (details.duration) {
          progress.totalStudyHours += details.duration;
        }
        break;
    }

    await progress.save();
    return { activity, progress };
  } catch (error) {
    console.error('Error tracking activity:', error);
    throw error;
  }
};

// Get user dashboard statistics
const getUserStats = async (userId) => {
  try {
    let progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      // Create initial progress record for new users
      progress = new UserProgress({ user: userId });
      await progress.save();
    }

    // Calculate attendance percentage
    const attendanceRate = progress.sessionsTotal > 0 
      ? Math.round((progress.sessionsAttended / progress.sessionsTotal) * 100)
      : 0;

    // Convert minutes to hours and format
    const totalHours = Math.round(progress.totalStudyHours / 60 * 10) / 10; // Round to 1 decimal

    return {
      totalStudyHours: totalHours,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      sessionsAttended: progress.sessionsAttended,
      attendanceRate,
      assignmentsCompleted: progress.assignmentsCompleted,
      averageScore: progress.averageScore,
      practiceProblems: progress.practiceProblems
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

// Initialize progress for existing users (migration helper)
const initializeUserProgress = async (userId) => {
  try {
    const existingProgress = await UserProgress.findOne({ user: userId });
    if (existingProgress) {
      return existingProgress;
    }

    const newProgress = new UserProgress({ user: userId });
    await newProgress.save();
    return newProgress;
  } catch (error) {
    console.error('Error initializing user progress:', error);
    throw error;
  }
};

module.exports = {
  trackActivity,
  getUserStats,
  initializeUserProgress
};