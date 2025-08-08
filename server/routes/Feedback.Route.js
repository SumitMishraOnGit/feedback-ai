const express = require('express');
const feedbackController = require('../controllers/feedback.controller.js');

const router = express.Router();

router.get('/', feedbackController.getAllFeedback);

router.post('/', feedbackController.createFeedback);

module.exports = router;