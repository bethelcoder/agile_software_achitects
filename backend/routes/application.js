// routes/applications.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../api/mongoDB/User');
const Application = require('../api/mongoDB/Freelancer_Application');
const project = require('../api/mongoDB/project');
const middleware = require('../middlewares');
// Middleware to check if freelancer is logged in

function isFreelancer(req, res, next) {
    const roles = req.session?.user?.roles;

    if (roles && roles.includes('freelancer')) {
        return next();
    }

    return res.status(403).redirect('/users/login');
}


// POST /apply
router.post('/apply', async (req, res) => {
  const { projectId, freelancerId, userName, projectTitle, message, skills, portfolioLink } = req.body;

  try {
    const projectObjectId = new mongoose.Types.ObjectId(projectId);
    // Check if the freelancer already applied to this project
    const existingApplication = await Application.findOne({
      'freelancerId.userID': freelancerId,
      projectId: projectObjectId,
    });
    if (existingApplication) {
      req.flash('error_msg', 'You have already applied for this job.');
      return res.redirect('/users/dashboard'); // Or wherever your projects are listed
    }

    // Save new application
    const newApplication = new Application({
      projectId: projectObjectId,
      title: projectTitle, // Store title at time of application
      freelancerId: { userID: freelancerId, userName: userName },
      Message: message,
      Skills: skills,
      links: portfolioLink? portfolioLink: ""
    });

    await newApplication.save();
    req.flash('success_msg', 'Your application has been submitted!');
    res.redirect('/users/dashboard');

  } catch (err) {
    console.error('Application Error:', err);
    req.flash('error_msg', 'An error occurred. Please try again.');
    res.redirect('/users/dashboard');
  }
});

// GET /applications
router.get('/applications', isFreelancer, async (req, res) => {
    const userID = req.session.user.userID;
  
    try {
      const applications = await Application.find({ 'freelancerId.userID': userID }).populate('projectId');
      res.render('freelancer_applications', { applications });
      //res.redirect();
    } catch (err) {
      console.error(err);
      res.render('freelancer_applications', { applications: [], error_msg: 'Could not fetch your applications.' });
    }
  });

  router.get('/applicants/:projectId', middleware.ensureAuth, async (req, res) => {
    const projectId = req.params.projectId;
  
    try {
      // Fetch applications for this project where Status is not 'Active'
      const applications = await Application.find({ 
          projectId, 
          Status: { $ne: 'Hired' } // $ne means "not equal"
        })
        .populate('freelancerId', 'userName')
        .populate('projectId', 'title');
    
      const projects = await project.findById(projectId); 
      const userID = projects.clientID;
    
      const userDoc = await User.findOne({ userID });
      const clientName = userDoc.userName;
    
      if (applications.length === 0) {
        return res.redirect('/users/dashboard');
      }
    
      res.render('applicants', { applications, projectId, clientName });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching applicants.");
    }
});



module.exports = router;
