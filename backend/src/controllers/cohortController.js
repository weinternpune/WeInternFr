const CohortApplication = require("../models/CohortApplication");

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

    // 1. Validate required fields
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

    // 2. Check if user has already booked
    const existingBooking = await CohortApplication.findOne({
      user: req.user._id,
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a booking.",
        data: existingBooking,
      });
    }

    // 3. Create booking
    const booking = await CohortApplication.create({
      user: req.user._id,
      name,
      email,
      phone,
      college,
      domain,
      year: year || "",
      day,
      status: "pending",
    });

    // 4. Send response
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