exports.isStudent = (req, res, next) => {

    if (req.user.role !== "student") {
        return res.status(403).json({
            success: false,
            message: "Only Student Can Access"
        });
    }

    next();
};

exports.isRecruiter = (req, res, next) => {

    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            success: false,
            message: "Only Recruiter Can Access"
        });
    }

    next();
};

exports.isAdmin = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Only Admin Can Access"
        });
    }

    next();
};