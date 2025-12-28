const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const feedbackRoutes = require('./routes/Feedback.Route.js');
require("dotenv").config();

const port = process.env.PORT || 5001;
const app = express();

// ===== Middleware (ORDER MATTERS!) =====
app.use(cors());           // Enable CORS for frontend requests
app.use(express.json());   // Parse JSON bodies BEFORE routes

// ===== Routes =====
app.use("/api/feedback", feedbackRoutes);

// ===== Health Check =====
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Start Server =====
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});