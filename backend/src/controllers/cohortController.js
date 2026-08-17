const CohortApplication = require("../models/CohortApplication");
const getCohortWeek = require("../utils/cohortWeek");

const createCohortBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      domain,
      year,
      day,
    } = req.body;

    // ----------------------------------------
    // 1. Validate required fields
    // ----------------------------------------

    if (
      !name ||
      !email ||
      !phone ||
      !college ||
      !domain ||
      !day
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // ----------------------------------------
    // 2. Get current cohort week
    // ----------------------------------------

    const {
      weekStart,
      weekEnd,
      currentDay,
    } = getCohortWeek();

    // ----------------------------------------
    // 3. Saturday registration restriction
    // ----------------------------------------

    // JavaScript:
    // Sunday = 0
    // Monday = 1
    // Tuesday = 2
    // Wednesday = 3
    // Thursday = 4
    // Friday = 5
    // Saturday = 6

    if (currentDay === 6) {
      return res.status(400).json({
        success: false,
        message:
          "Cohort registration is closed today. You can register again on Sunday.",
      });
    }

    // ----------------------------------------
    // 4. Check if user already applied
    //    during the current week
    // ----------------------------------------

    const existingBooking = await CohortApplication.findOne({
      user: req.user._id,
      cohortWeekStart: weekStart,
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message:
          "You have already submitted a cohort application for this week.",
        data: existingBooking,
      });
    }

    // ----------------------------------------
    // 5. Create new cohort application
    // ----------------------------------------

    const booking = await CohortApplication.create({
      user: req.user._id,

      name,
      email,
      phone,
      college,
      domain,
      year: year || "",
      day,

      cohortWeekStart: weekStart,
      cohortWeekEnd: weekEnd,

      status: "pending",
    });

    // ----------------------------------------
    // 6. Success response
    // ----------------------------------------

    return res.status(201).json({
      success: true,
      message: "Cohort booking submitted successfully.",
      data: booking,
    });

  } catch (error) {
    console.error("Create cohort booking error:", error);

    // ----------------------------------------
    // 7. Handle duplicate weekly application
    // ----------------------------------------

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "You have already submitted a cohort application for this week.",
      });
    }

    // ----------------------------------------
    // 8. Generic server error
    // ----------------------------------------

    return res.status(500).json({
      success: false,
      message: "Failed to submit cohort booking.",
    });
  }
};

const updateCohortStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "rejected",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cohort status.",
      });
    }

    // Find and update application
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



module.exports = {
  createCohortBooking,
  updateCohortStatus,
};