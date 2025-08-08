const express = require('express');
const mongoose = require('mongoose');
const feedbackRoutes = require('./routes/Feedback.Route.js');
const port = 5001;
require("dotenv").config();

const app = express();

app.use("/api/feedback", feedbackRoutes);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
      console.log(`listening on port ${port}`);
});