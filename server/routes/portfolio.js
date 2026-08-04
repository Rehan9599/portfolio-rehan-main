import express from 'express';
import PersonalInfo from '../models/PersonalInfo.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Certificate from '../models/Certificate.js';
import Journey from '../models/Journey.js';

const router = express.Router();

// GET /api/portfolio — Returns portfolio data from DB, with fallback
router.get('/', async (req, res) => {
  try {
    // Run DB queries in parallel for faster response time
    const [personalInfo, projects, skillDocs, certificates, journey] = await Promise.all([
      PersonalInfo.findOne().lean(),
      Project.find().sort({ order: 1 }).lean(),
      Skill.find().lean(),
      Certificate.find().sort({ certId: 1 }).lean(),
      Journey.find().lean(),
    ]);

    // Group skills dynamically by category
    const skills = skillDocs.reduce((acc, skill) => {
      const category = skill.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {});

    // Safe extraction with fallback in case personalInfo is null/unseeded
    const journeyText = personalInfo?.journeyText || '';

    return res.json({
      success: true,
      source: 'database',
      data: {
        personalInfo: personalInfo || {},
        projects,
        skills,
        certificates,
        journey,
        journeyText
      }
    });

  } catch (error) {
    console.warn('DB error, serving default portfolio data:', error.message);
    
    // Always return a response in the catch block!
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve portfolio data',
      error: error.message
    });
  }
});

export default router;