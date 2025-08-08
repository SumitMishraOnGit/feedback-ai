// server/controllers/feedback.controller.js
const Feedback = require('../models/Feedback.Model.js');

exports.createFeedback = async (req, res) => {
  try {
  const {content} = req.body
    if(!content) {
        res.json({ message: "feedback can't be empty"}).status(200)
    } 
    const newFeedback = new Feedback({
        content: content,
    })

    await newFeedback.save();
    res.status.json(newFeedback)

  } catch(error) {
    console.log(error)
    res.status(500).json({ message: 'Server error while creating feedback.' });
  }

};

exports.getAllFeedback = async function (req, res) {
  try {
    const allFeedback = await Feedback.find({}).sort({createdAt: -1});

    res.json(allFeedback).status(200)
  } catch (error) {
    console.log( "Error while fetching all feedbacks:", error )
    res.status(500).json({ message: 'Server error while fetching feedback.' });
  }
}

