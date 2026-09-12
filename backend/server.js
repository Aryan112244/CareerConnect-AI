const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// Static Files
// =======================
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// =======================
// Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// =======================
// Test Route
// =======================
app.get("/", (req, res) => {
    res.send("🚀 CareerConnect AI Backend is Running...");
});

// =======================
// Database Connection
// =======================
connectDB();

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on Port ${PORT}`);
});