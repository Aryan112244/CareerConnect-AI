const express = require("express");

const router = express.Router();

const {
    applyJob,
    myApplications,
    viewApplicants,
    updateApplicationStatus
} = require("../controllers/applicationController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

const {
    isStudent,
    isRecruiter
} = require("../middleware/roleMiddleware");

// =======================
// Apply Job
// =======================
router.post(
    "/apply/:jobId",
    verifyToken,
    isStudent,
    applyJob
);

// =======================
// My Applications
// =======================
router.get(
    "/my-applications",
    verifyToken,
    isStudent,
    myApplications
);

// =======================
// View Applicants
// =======================
router.get(
    "/job/:jobId",
    verifyToken,
    isRecruiter,
    viewApplicants
);

// =======================
// Update Application Status
// =======================
router.put(
    "/status/:applicationId",
    verifyToken,
    isRecruiter,
    updateApplicationStatus
);

module.exports = router;