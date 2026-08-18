const express = require("express");

const router = express.Router();

const {
  protect,
  studentOnly,
  adminOnly,
} = require("../middleware/auth");

const {
  createCohortBooking,
  getAdminCohortApplications,
  updateCohortStatus,
} = require("../controllers/cohortController");

// ============================================================
// STUDENT: Create cohort booking
// ============================================================

router.post(
  "/book",
  protect,
  studentOnly,
  createCohortBooking
);

// ============================================================
// ADMIN: Get all cohort applications
// ============================================================

router.get(
  "/admin/applications",
  protect,
  adminOnly,
  getAdminCohortApplications
);

// ============================================================
// ADMIN: Update cohort application status
// ============================================================

router.patch(
  "/book/:id/status",
  protect,
  adminOnly,
  updateCohortStatus
);

module.exports = router;