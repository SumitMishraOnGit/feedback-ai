const express = require('express');
const feedbackRoutes = require('./Feedback.Route.js');
const port = 3000;

const app = express();

app.use("/api/feedback", feedbackRoutes);

app.listen(port, () => {
      console.log(`listening on port ${port}`);
});