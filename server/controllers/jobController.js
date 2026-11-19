const Job = require("../models/Job");

// Create Job
const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: "Job Created Successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Jobs (Search + Filters + Sorting + Pagination)
const getAllJobs = async (req, res) => {
  try {
    const {
      keyword,
      company,
      location,
      salary,
      page = 1,
      sort = "newest",
    } = req.query;

    const limit = 5;
    const skip = (Number(page) - 1) * limit;

    let query = {};

    // Search by Job Title
    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    // Filter by Company
    if (company) {
      query.company = {
        $regex: company,
        $options: "i",
      };
    }

    // Filter by Location
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by Minimum Salary
    if (salary) {
      query.salary = {
        $gte: Number(salary),
      };
    }

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "salary-high":
        sortOption = { salary: -1 };
        break;

      case "salary-low":
        sortOption = { salary: 1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      jobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Job
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job Updated Successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};