const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  applyJob,
  getApplications,
  getMyApplications,
  updateApplicationStatus,
  scheduleInterview,
  sendOffer,
  acceptOffer,
  declineOffer,
} = require("../controllers/applicationController");

// ================= Apply for Job =================
router.post("/", upload.single("resume"), applyJob);

// ================= Employer: View All Applications =================
router.get("/", getApplications);

// ================= Job Seeker: View My Applications =================
router.get("/my/:userId", getMyApplications);

// ================= Update Status =================
router.put("/:id", updateApplicationStatus);

// ================= Schedule Interview =================
router.put("/:id/interview", scheduleInterview);

// ================= Send Offer Letter =================
router.put("/:id/offer", sendOffer);

// ================= Candidate: Accept Offer =================
router.put("/:id/accept", acceptOffer);

// ================= Candidate: Decline Offer =================
router.put("/:id/decline", declineOffer);

module.exports = router;