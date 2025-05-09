const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../api/mongoDB/Freelancer_Application');
const clientProject = require('../api/mongoDB/project');
const Project = require('../api/mongoDB/Freelancer_Project');
const Milestone = require('../api/mongoDB/Milestone');
const middleware = require('../middlewares');

// Middleware to check if freelancer is logged in
function isFreelancer(req, res, next) {
    const roles = req.session?.user?.roles;

    if (roles && roles.includes('freelancer')) {
        return next();
    }

    return res.status(403).redirect('/users/login');
}

router.patch('/:projectId/accept', async (req, res) => {
    const { projectId } = req.params;
    const { freelancerName } = req.query;
  
    try {
      const result = await Application.findOneAndUpdate(
        { 
          projectId, 
          "freelancerId.userName": freelancerName 
        },
        { $set: { Status: 'Hired' } },
        { new: true } // Returns the updated document
      );
  
      if (!result) {
        return res.status(404).json({ message: "Application not found" });
      }
  
      res.status(200).json({ message: "Freelancer hired", redirectTo: `/projects/${projectId}/milestones` });
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Route to check for a hired freelancer by project ID
router.get('/check-hired/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const hired = await Application.findOne({
      projectId,
      Status: 'Hired'
    });

    if (hired) {
      return res.json({ hired: true });
    } else {
      return res.json({ hired: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ hired: false, error: 'Server error' });
  }
});

module.exports = router;

  // Render the milestones creation page
router.get('/:projectId/milestones', (req, res) => {
    const { projectId } = req.params;
    res.render('milestones', { projectId });
  });
  
  // Save milestones to the database
router.post('/:projectId/milestones', async (req, res) => {
const { projectId } = req.params;
const { milestones } = req.body;

const formattedMilestones = milestones.map(name => ({ name }));

try {
    const newMilestone = new Milestone({
    projectId,
    milestones: formattedMilestones,
    projectStatus: false
    });

    await newMilestone.save();

    res.redirect('/users/dashboard');
} catch (error) {
    console.error('Error saving milestones:', error);
    res.status(500).send("Error saving milestones.");
}
});
  
router.get('/active-projects/:userName', async (req, res) => {
    const userName = req.params.userName;
  
    try {
      const hiredProjects = await Application.find({
        'freelancerId.userName': userName,
        Status: 'Hired'
      });
  
      const milestones = [];
  
      for (const project of hiredProjects) {
        const projectId = project.projectId;
      
        if (mongoose.Types.ObjectId.isValid(projectId)) {
          const milestone = await Milestone.findOne({
            projectId: new mongoose.Types.ObjectId(projectId)
          });
      
          if (milestone) {
            milestones.push(milestone);
          } else {
            console.log('❌ No milestone found for:', projectId);
          }
        } else {
          console.log('⚠️ Invalid ObjectId format for projectId:', projectId);
        }
      }
      console.log(milestones[0].milestones);
  
      res.render('freelancerProjects', {
        title: 'My Projects',
        userName,
        hiredProjects,
        milestones
      });
    } catch (error) {
      console.error('Error fetching hired projects:', error);
      res.status(500).send('Server Error');
    }
  });

  router.get('/activeProjects', middleware.ensureAuth, async (req, res) =>{
    const clientId = req.session.user.userID;

  try {
    // Fetch all active projects by this client
    const clientProjects = await clientProject.find( {'clientID': clientId} );
    if (clientProjects.length === 0) {
      return res.render('activeProjects', { clientProjects: [] });
    }
    const projectId = clientProjects.projectId;

    res.render('activeprojects', { clientProjects, projectId });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Projects.");
  }
});
router.get('/reviewForm', (req, res) => {
  res.render('reviewForm');
});

router.post("/:projectId/milestone/submit", async (req, res) => {
  
  res.redirect('/users/dashboard');
});

module.exports = router;