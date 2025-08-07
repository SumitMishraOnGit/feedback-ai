// server/controllers/feedback.controller.js
const Feedback = require('../models/Feedback.Model.js');

exports.createFeedback = async (req, res) => {
  try {
    const { content } = req.body;

    if(!content) {
        res.json({ message: "feedback can't be empty"}).status(200)
    }
    const newFeedback = new Feedback({
        content: content,
    })

    await newFeedback.save();

    res.status.json(newFeedback)
  } catch(error) {
    console
    res.status(500).json({ message: 'Server error while creating feedback.' });
  }

};

exports.getAllFeedback = async (req, res) => {
  try {
    const allFeedback = await Feedback.find({}).sort({ createdAt: -1 });

    res.status(200).json(allFeedback);
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error while fetching feedback.' });
  }
};






















// if (!content) {
//       return res.status(400).json({ message: 'Feedback content cannot be empty.' });
//     }
//     const newFeedback = new Feedback({
//       content: content, 
//     });

//     await newFeedback.save();

//     res.status(201).json(newFeedback);

//   } catch (error) {
//     console.error('Error creating feedback:', error);
//     res.status(500).json({ message: 'Server error while creating feedback.' });