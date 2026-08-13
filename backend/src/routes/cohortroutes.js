const express = require("express");
const router = express.Router();
const { protect, studentOnly, adminOnly } = require("../middleware/auth");

const {
  createCohortBooking,
  updateCohortStatus,
} = require("../controllers/cohortController");

// Create cohort booking
router.post("/book", protect, studentOnly, createCohortBooking);
// Admin: update cohort booking status
router.patch(
  "/book/:id/status",
  protect,
  adminOnly,
  updateCohortStatus
);

module.exports = router;
