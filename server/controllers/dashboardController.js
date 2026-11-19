const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");

const getDashboardStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();

    const totalApplications = await Application.countDocuments();

    const totalEmployers = await User.countDocuments({
      role: "employer",
    });

    const totalJobSeekers = await User.countDocuments({
      role: "jobseeker",
    });

    res.status(200).json({
      success: true,
      totalJobs,
      totalApplications,
      totalEmployers,
      totalJobSeekers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};