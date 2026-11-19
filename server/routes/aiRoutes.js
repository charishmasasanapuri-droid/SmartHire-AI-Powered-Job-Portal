const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  analyzeResume,
  recommendJobs,
  uploadResume,
} = require("../controllers/aiController");

// Resume Analyzer (Text)
router.post("/analyze-resume", analyzeResume);

// Resume Upload (PDF/DOCX)
router.post(
  "/upload-resume",
  upload.single("resume"),
  uploadResume
);

// AI Job Recommendation
router.post("/recommend-jobs", recommendJobs);

module.exports = router;