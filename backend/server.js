const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express(); 


// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); 
// Test Route
app.get("/", (req, res) => {
  res.send("🚀 CareerConnect AI Backend is Running...");
});

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});