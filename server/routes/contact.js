import express from 'express';
import rateLimit from 'express-rate-limit';
import Message from '../models/Message.js';
import { sendContactEmail } from '../utils/mailer.js';

const router = express.Router();

const MAX_LENGTHS = { name: 100, email: 254, message: 5000 };

// 5 submissions per IP per hour. Enough for a real person who mistypes,
// useless for a spam bot.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent from this address. Please try again later.'
  }
});

// Guards the admin-only inbox route. Without ADMIN_TOKEN set in the
// environment the route stays closed rather than falling open.
function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;
  const provided = req.get('x-admin-token');

  if (!expected || !provided || provided !== expected) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  next();
}

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, message, website } = req.body;

    // Honeypot: a hidden field no human ever fills in. Bots fill everything.
    // Answer 201 so the bot believes it succeeded and doesn't retry.
    if (website) {
      return res.status(201).json({ success: true, message: 'Message sent successfully!' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    for (const [field, limit] of Object.entries(MAX_LENGTHS)) {
      if (String(req.body[field]).length > limit) {
        return res.status(400).json({
          success: false,
          message: `${field} must be ${limit} characters or fewer`
        });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    });

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

// GET /api/contact — admin inbox. This returns the name and email address of
// everyone who has ever used the contact form, so it requires ADMIN_TOKEN.
router.get('/', requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

export default router;
