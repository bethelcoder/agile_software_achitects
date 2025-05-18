const express = require('express');
const mongoose = require('mongoose');
const User = require('../api/mongoDB/User');
const router = express.Router();
const Application = require('../api/mongoDB/Freelancer_Application');
const Project = require('../api/mongoDB/project');

function skillsMatch(requiredSkillsString, freelancerSkillsString, threshold = 0.2) {
  const requiredSkills = requiredSkillsString
    .toLowerCase()
    .split(',')
    .map(s => s.trim());
  const freelancerSkills = freelancerSkillsString
    .toLowerCase()
    .split(',')
    .map(s => s.trim());

  // Count how many required skills the freelancer has
  const matchCount = requiredSkills.filter(skill => freelancerSkills.includes(skill)).length;

  // Calculate match ratio
  const matchRatio = matchCount / requiredSkills.length;

  // Return true if matchRatio >= threshold (e.g., 50%)
  return matchRatio >= threshold;
}


router.post('/hire-by-ai', async (req, res) => {
  const { applicationId } = req.body;

  try {
    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const project = await Project.findById(application.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (skillsMatch(application.Skills, project.applicableSkills)) {
      application.Status = 'Hired';
      await application.save();

      return res.status(200).json({ message: 'Freelancer hired successfully by AI.' });
    } else {
      return res.status(200).json({ message: 'Skills do not match. AI cannot hire.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error during AI hiring.' });
  }
});

module.exports = router;
