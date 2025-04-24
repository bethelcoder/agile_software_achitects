// routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../api/mongoDB/Freelancer_Application');
const Project = require('../api/mongoDB/Freelancer_Project');
const middleware = require('../middlewares');
// Middleware to check if freelancer is logged in
// function isFreelancer(req, res, next) {
//     console.log("Session check:", req.session.user);
//     if (req.session.user && req.session.user.roles === 'freelancer') return next();
//     return res.redirect('/users/login');
//   }
function isFreelancer(req, res, next) {
    const roles = req.session?.user?.roles;

    if (roles && roles.includes('freelancer')) {
        return next();
    }

    return res.status(403).redirect('/users/login');
}


// POST /apply
router.post('/apply', async (req, res) => {
  const { projectId, freelancerId, projectTitle, message } = req.body;

  try {
    // Check if the freelancer already applied to this project
    const existingApplication = await Application.findOne({
      'freelancerId.userID': freelancerId,
      projectId
    });

    if (existingApplication) {
      req.flash('error_msg', 'You have already applied for this job.');
      return res.redirect('/users/dashboard'); // Or wherever your projects are listed
    }

    // Save new application
    const newApplication = new Application({
      projectId,
      title: projectTitle, // Store title at time of application
      freelancerId: { userID: freelancerId },
      Message: message
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
      // Fetch the applicants for the given project
      const applications = await Application.find({ projectId })
        .populate('freelancerId', 'userName')  // Populate the freelancer's details
        .populate('projectId', 'title'); // Optional: to get project details
      
      if (applications.length === 0) {
        // return res.render('no_applicants', { message: "No freelancers have applied yet." });
        return res.redirect('/users/dashboard');
      }

      res.render('applicants', { applications });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching applicants.");
    }
});


module.exports = router;
