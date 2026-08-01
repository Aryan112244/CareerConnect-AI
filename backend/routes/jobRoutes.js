const express = require("express");

const router = express.Router();

const {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

const {
    isRecruiter
} = require("../middleware/roleMiddleware");

// =======================
// Create Job
// =======================
router.post(
    "/create",
    verifyToken,
    isRecruiter,
    createJob
);

// =======================
// Get All Jobs
// =======================
router.get("/", getAllJobs);

// =======================
// Get Single Job
// =======================
router.get("/:id", getSingleJob);

// =======================
// Update Job
// =======================
router.put(
    "/:id",
    verifyToken,
    isRecruiter,
    updateJob
);

// =======================
// Delete Job
// =======================
router.delete(
    "/:id",
    verifyToken,
    isRecruiter,
    deleteJob
);

module.exports = router;