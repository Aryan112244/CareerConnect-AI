const Job = require("../models/Job");

// =======================
// Create Job
// =======================
exports.createJob = async (req, res) => {
    try {

        const { title, company, location, salary, description } = req.body;

        const job = await Job.create({
            title,
            company,
            location,
            salary,
            description,
            recruiter: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Job Posted Successfully",
            job
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// =======================
// Get All Jobs
// =======================
exports.getAllJobs = async (req, res) => {
    try {

        const jobs = await Job.find().populate("recruiter", "name email");

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// =======================
// Get Single Job
// =======================
exports.getSingleJob = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id)
            .populate("recruiter", "name email");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job Not Found"
            });
        }

        res.status(200).json({
            success: true,
            job
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// =======================
// Update Job
// =======================
exports.updateJob = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job Not Found"
            });
        }

        // Sirf recruiter hi update kar sakta hai
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this job"
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Job Updated Successfully",
            job: updatedJob
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// =======================
// Delete Job
// =======================
exports.deleteJob = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job Not Found"
            });
        }

        // Sirf recruiter hi delete kar sakta hai
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this job"
            });
        }

        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Job Deleted Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};