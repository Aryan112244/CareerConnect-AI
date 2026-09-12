const Application = require("../models/Application");
const Job = require("../models/Job");

// =======================
// Apply Job
// =======================
exports.applyJob = async (req, res) => {
    try {

        // Check Job Exists
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job Not Found"
            });
        }

        // Check Already Applied
        const alreadyApplied = await Application.findOne({
            student: req.user.id,
            job: req.params.jobId
        });

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: "Already Applied"
            });
        }

        // Create Application
        const application = await Application.create({
            student: req.user.id,
            job: req.params.jobId
        });

        res.status(201).json({
            success: true,
            message: "Job Applied Successfully",
            application
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
// My Applications
// =======================
exports.myApplications = async (req, res) => {

    try {

        const applications = await Application.find({
            student: req.user.id
        })
        .populate({
            path: "job",
            populate: {
                path: "recruiter",
                select: "name email"
            }
        });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
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
// View Applicants
// =======================
exports.viewApplicants = async (req, res) => {

    try {

        const applications = await Application.find({
            job: req.params.jobId
        })
       .populate("student", "name email resume")
        .populate("job", "title company");

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
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
// Update Application Status
// =======================
exports.updateApplicationStatus = async (req, res) => {

    try {

        const application = await Application.findById(req.params.applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application Not Found"
            });
        }

        application.status = req.body.status;

        await application.save();

        res.status(200).json({
            success: true,
            message: "Application Status Updated Successfully",
            application
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};