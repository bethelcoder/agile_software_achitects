const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../api/mongoDB/Freelancer_Application');
const clientProject = require('../api/mongoDB/project');
const Project = require('../api/mongoDB/Freelancer_Project');
const Milestone = require('../api/mongoDB/Milestone');
const middleware = require('../middlewares');
const Submission = require('../api/mongoDB/Submission');
const User = require('../api/mongoDB/User');


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
      
      const user = await User.findOne({ userName });
      const userID = user.userID;
      
      res.render('freelancerProjects', {
        title: 'My Projects',
        userName,
        userID,
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

router.get('/activeProjects/:projectId', middleware.ensureAuth, async (req, res) => {
  const projectId = req.params.projectId; // Correct way to get :projectId from URL

  try {
    // Fetch all milestones associated with this projectId
    const milestones = await Milestone.find({ projectId: projectId });

    if (milestones.length === 0) {
      return res.render('viewClientsMilestones', { milestones: [], projectId });
    }

    res.render('viewClientsMilestones', { milestones, projectId });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Projects.");
  }

});

router.get('/reviewForm', (req, res) => {
  res.render('reviewForm');
});

// PUT route to approve a milestone
router.get('/:projectId/milestones/:milestoneId/approve-and-pay', async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;

    const milestoneDoc = await Milestone.findOne({ projectId });
    if (!milestoneDoc) return res.status(404).send('Milestone document not found');

    const milestone = milestoneDoc.milestones.id(milestoneId);
    if (!milestone) return res.status(404).send('Milestone not found');

    milestone.status = 'approved';
    milestone.name = milestone.name.replace(/ - (Approved and Paid|Rejected)/g, '') + ' - Approved and Paid';

    await milestoneDoc.save();

    // Render payment.ejs and pass the milestone data
    res.render('payment', { projectId, milestone });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error: ' + err.message);
  }
});

router.put('/:projectId/milestones/:milestoneId/reject', async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;
    const { message } = req.body;

    const milestoneDoc = await Milestone.findOne({ projectId });
    if (!milestoneDoc) return res.status(404).json({ message: 'Milestone document not found' });

    const milestone = milestoneDoc.milestones.id(milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    milestone.status = 'rejected';
    milestone.name = milestone.name.replace(/ - (Approved and Paid|Rejected)/g, '') + ' - Rejected';
    milestone.message = message?.trim() || 'No reason provided'; // <-- Store the message

    await milestoneDoc.save();
    res.json({ message: 'Milestone rejected', milestone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});




router.post("/:projectId/milestone/submit", async (req, res) => {
   const { projectId } = req.params;
  const { submittedWorkLink, userName, userID, milestoneId } = req.body;

  if (!submittedWorkLink) {
    return res.status(400).json({ error: "Submitted work link is required." });
  }

  if (!userID || !userName) {
    return res.status(401).json({ error: "Unauthorized. Freelancer info missing." });
  }

  if (!milestoneId) {
    return res.status(400).json({ error: "Milestone ID is required." });
  }

  try {
    // Step 1: Validate freelancer is hired for the project
    const application = await Application.findOne({
      projectId,
      "freelancerId.userID": userID,
      Status: "Hired"
    });

    if (!application) {
      return res.status(403).json({ error: "You are not hired for this project or application not found." });
    }

    // Step 2: Update the milestone's submittedWorkLink
    const updateResult = await Milestone.updateOne(
      { projectId },
      { $set: { "milestones.$[elem].submittedWorkLink": submittedWorkLink } },
      {
        arrayFilters: [{ "elem._id": milestoneId }],
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ error: "Milestone not found or update failed." });
    }

    // Create a submission linked to this application
    const submission = new Submission({
      applicationId: application._id,
      milestoneId,
      freelancerId: { userID, userName },
      submittedWorkLink
    });

    await submission.save();

    res.status(201).json({ message: "Submission saved successfully.", submission });
  } catch (error) {
    console.error("Error submitting milestone:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;