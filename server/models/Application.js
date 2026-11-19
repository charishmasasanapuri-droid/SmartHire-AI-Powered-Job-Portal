const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: String,
      required: true,
    },

    status: {
  type: String,
  enum: [
    "Applied",
    "Shortlisted",
    "Rejected",
    "Offer Sent",
    "Offer Accepted",
    "Offer Declined",
  ],
  default: "Applied",
},

    // Interview Details
interview: {
  date: {
    type: String,
    default: "",
  },

  time: {
    type: String,
    default: "",
  },

  mode: {
    type: String,
    enum: ["", "Online", "Offline"],
    default: "",
  },

  meetingLink: {
    type: String,
    default: "",
  },

  offer: {
    joiningDate: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined"],
      default: "Pending",
    },
  },
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);