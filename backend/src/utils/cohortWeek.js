const getCohortWeek = () => {
  const now = new Date();

  // JavaScript:
  // Sunday = 0
  // Monday = 1
  // Tuesday = 2
  // Wednesday = 3
  // Thursday = 4
  // Friday = 5
  // Saturday = 6

  const day = now.getDay();

  // Find the Sunday of the current week
  const weekStart = new Date(now);

  weekStart.setDate(now.getDate() - day);
  weekStart.setHours(0, 0, 0, 0);

  // Saturday 11:59:59.999 PM
  const weekEnd = new Date(weekStart);

  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return {
    weekStart,
    weekEnd,
    currentDay: day,
  };
};

module.exports = getCohortWeek;