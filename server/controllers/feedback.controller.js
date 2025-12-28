// server/controllers/feedback.controller.js
const Feedback = require('../models/Feedback.Model.js');

exports.createFeedback = async (req, res) => {
  try {
    const { content } = req.body;

    // Validation with proper return to stop execution
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Feedback content is required"
      });
    }

    const newFeedback = new Feedback({
      content: content.trim(),
    });

    await newFeedback.save();

    // Fixed: res.status(201).json() - 201 for resource creation
    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: newFeedback
    });

  } catch (error) {
    console.error("Error creating feedback:", error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating feedback.'
    });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const allFeedback = await Feedback.find({}).sort({ createdAt: -1 });

    // Fixed: status() before json()
    return res.status(200).json({
      success: true,
      count: allFeedback.length,
      data: allFeedback
    });
  } catch (error) {
    console.error("Error while fetching all feedbacks:", error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback.'
    });
  }
};

