const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Shared handler function for both contact form routes
async function handleContactForm(req, res, source) {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (
      typeof name !== 'string' || name.trim().length < 2 ||
      typeof email !== 'string' || !/.+@.+\..+/.test(email.trim()) ||
      typeof subject !== 'string' || subject.trim() === '' ||
      typeof message !== 'string' || message.trim().length < 5
    ) {
      return res.status(400).json({ message: 'Please provide valid inputs for all fields.' });
    }

    // Save the message
    const newMessage = new Message({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      source // 'index' or 'contact'
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully.' });

  } catch (err) {
    console.error(`❌ Error in POST /api/contact/${source}:`, err.message);
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
}

// POST route for popup form on index.html
router.post('/contact/index', (req, res) => handleContactForm(req, res, 'index'));

// POST route for full contact.html page form
router.post('/contact/page', (req, res) => handleContactForm(req, res, 'contact'));

// GET all messages (admin dashboard)
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err.message);
    res.status(500).json({ message: 'Failed to fetch messages.', error: err.message });
  }
});

module.exports = router;
