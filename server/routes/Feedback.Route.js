const express = require('express');
const router = express.Router();

const feedbackController = require('../controllers/feedback.controller.js');

router.get('/', feedbackController.getAllFeedback);

router.post('/', feedbackController.createFeedback);

module.exports = router;