import express from 'express';
import Message from '../models/Message.js';
import { sendContactEmail } from '../utils/mailer.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const newMessage = await Message.create({ name, email, message });

    // Best-effort notification — the message is already saved above,
    // so a failed email shouldn't fail the whole request.
    try {
      await sendContactEmail({ name, email, message });
    } catch (mailErr) {
      console.error('Contact email failed to send:', mailErr);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: { id: newMessage._id }
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
});

// GET /api/contact — Retrieve all messages (for admin use)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

export default router;
