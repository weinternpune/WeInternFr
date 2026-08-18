const mongoose = require("mongoose");

const cohortApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    domain: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: String,
      default: "",
      trim: true,
    },

    day: {
      type: String,
      enum: ["Saturday", "Sunday"],
      required: true,
    },

    // ------------------------------------
    // WEEKLY COHORT REGISTRATION
    // ------------------------------------

    cohortWeekStart: {
      type: Date,
      required: true,
    },

    cohortWeekEnd: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },

    adminNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


// ------------------------------------
// ONE APPLICATION PER USER PER WEEK
// ------------------------------------

// ------------------------------------
// INDEX FOR WEEKLY APPLICATION QUERIES
// ------------------------------------

cohortApplicationSchema.index({
  user: 1,
  cohortWeekStart: 1,
});


module.exports = mongoose.model(
  "CohortApplication",
  cohortApplicationSchema
);