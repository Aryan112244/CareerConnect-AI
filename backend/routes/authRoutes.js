const express = require("express");

const router = express.Router();

const {
    signup,
    login,
    profile,
    studentDashboard,
    recruiterDashboard,
    adminDashboard,
    uploadResume
} = require("../controllers/authController");

const { verifyToken } = require("../middleware/authMiddleware");

const {
    isStudent,
    isRecruiter,
    isAdmin
} = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");

// =======================
// Authentication
// =======================
router.post("/signup", signup);
router.post("/login", login);

// =======================
// Profile
// =======================
router.get(
    "/profile",
    verifyToken,
    profile
);

// =======================
// Student Dashboard
// =======================
router.get(
    "/student/dashboard",
    verifyToken,
    isStudent,
    studentDashboard
);

// =======================
// Recruiter Dashboard
// =======================
router.get(
    "/recruiter/dashboard",
    verifyToken,
    isRecruiter,
    recruiterDashboard
);

// =======================
// Admin Dashboard
// =======================
router.get(
    "/admin/dashboard",
    verifyToken,
    isAdmin,
    adminDashboard
);

// =======================
// Upload Resume
// =======================
router.post(
    "/upload-resume",
    verifyToken,
    upload.single("resume"),
    uploadResume
);

module.exports = router;