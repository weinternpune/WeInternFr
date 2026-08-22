const CohortApplication = require("../models/CohortApplication");
const User = require("../models/User");
const getCohortWeek = require("../utils/cohortWeek");

// ============================================================
// CREATE COHORT BOOKING
// ============================================================

const createCohortBooking = async (req, res) => {
  try {
    // --------------------------------------------------------
    // 1. Get form data
    // --------------------------------------------------------

    const {
      college,
      domain,
      year,
      day,
    } = req.body;

    // --------------------------------------------------------
    // 2. Get logged-in user from database
    // --------------------------------------------------------

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // --------------------------------------------------------
    // 3. Validate required fields
    // --------------------------------------------------------

    if (!college || !domain || !day) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // --------------------------------------------------------
    // 4. Get current cohort week
    // --------------------------------------------------------

    const {
      weekStart,
      weekEnd,
      currentDay,
    } = getCohortWeek();

    // --------------------------------------------------------
    // 5. Saturday registration restriction
    // --------------------------------------------------------

    if (currentDay === 6) {
      return res.status(400).json({
        success: false,
        message:
          "Cohort registration is closed today. You can register again on Sunday.",
      });
    }

    // --------------------------------------------------------
    // 6. Check applications for current week
    // --------------------------------------------------------

    const applicationCount = await CohortApplication.countDocuments({
      user: req.user._id,
      cohortWeekStart: weekStart,
    });

    // --------------------------------------------------------
    // 7. Maximum 2 applications per week
    // --------------------------------------------------------

    if (applicationCount >= 2) {
      return res.status(409).json({
        success: false,
        message:
          "You have already submitted 2 cohort applications for this week.",
      });
    }

    // --------------------------------------------------------
    // 8. Create cohort application
    // --------------------------------------------------------

    const booking = await CohortApplication.create({
      user: req.user._id,

      // Always take these from the logged-in user's database
      name: user.name,
      email: user.email,
      phone: user.phone,

      // Form data
      college,
      domain,
      year: year || "",
      day,

      // Cohort week
      cohortWeekStart: weekStart,
      cohortWeekEnd: weekEnd,

      // Default status
      status: "pending",
    });

    // --------------------------------------------------------
    // 9. Success response
    // --------------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Cohort booking submitted successfully.",
      data: booking,
    });

  } catch (error) {
    console.error("Create cohort booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit cohort booking.",
    });
  }
};

// ============================================================
// GET ALL COHORT APPLICATIONS - ADMIN
// ============================================================

const getAdminCohortApplications = async (req, res) => {
  try {
    const applications = await CohortApplication.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Get admin cohort applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cohort applications.",
    });
  }
};
// ============================================================
// UPDATE COHORT STATUS - ADMIN
// ============================================================

const updateCohortStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "rejected",
    ];

    // --------------------------------------------------------
    // Validate status
    // --------------------------------------------------------

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cohort status.",
      });
    }

    // --------------------------------------------------------
    // Find and update application
    // --------------------------------------------------------

    const booking = await CohortApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Cohort application not found.",
      });
    }

    // --------------------------------------------------------
    // Success response
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Cohort status updated successfully.",
      data: booking,
    });

  } catch (error) {
    console.error("Update cohort status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cohort status.",
    });
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  createCohortBooking,
  getAdminCohortApplications,
  updateCohortStatus,
};