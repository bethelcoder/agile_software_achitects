const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controller/controller');
const User = require('../api/mongoDB/User');
const middleware = require('../middlewares');
const description= require('../api/mongoDB/description');
const Project = require('../api/mongoDB/project');

router.get('/register', controller.regPage);
router.get('/login', controller.logPage);
router.post('/submit-username', controller.submitUsername);
router.post('/submit-jobDetails', controller.submitDetails);
router.post('/submit-clientProfile', controller.clientProf);

router.get('/dashboard', middleware.ensureAuth, async (req, res) => {
  const userID = req.user.profile.id;
  const userDoc = await User.findOne({ userID });
  const userName = userDoc.userName;
  const userRole = userDoc.roles;
  const allProjects = await Project.find({});
  if (userRole.length == 1 && userRole[0] == "client") {
    // ✅ Fetch projects before rendering
    const clientID = req.user.clientID; // or however you store it
    const projects = await Project.find({ clientID: userID });
    res.render('clientDashboard', { userName, userID, projects });
  } else if (userRole.length == 1 && userRole[0] == "freelancer") {
    res.render('freelancer_dashboard', { userName, allProjects, userID });
  } 
});

router.post('/submit-username', controller.submitUsername);
router.get('/submit-username', (req, res) => {
  res.redirect('/');
});


// 3rd Party Login: Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  async (req, res) => {
    const userID = req.user.profile.id;
    try {
      const userDoc = await User.findOne({ userID });
      if (userDoc) { 
          const userName = userDoc.userName;
          const userRole = userDoc.roles;
          // ✅ Store user in session (so your custom middleware can access it)
          req.session.user = {
            userID: userDoc.userID,
            username: userDoc.userName,
            roles: userDoc.roles,
          };

          req.session.save(() => {
            res.redirect('/users/dashboard');
          });
      } else {
        res.redirect('/g-profile');
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      res.status(500).send("Error!");
    }
  }
);

// 3rd Party Login: GitHub
router.get('/github', passport.authenticate('github', {
  scope: ['profile', 'email']
}));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/github' }),
  async (req, res) => {
    const userID = req.user.profile.id;
    try {
      const userDoc = await User.findOne({ userID });


      if (userDoc) { 
          const userName = userDoc.userName;
          const userRole = userDoc.roles;
          // ✅ Store user in session (so your custom middleware can access it)
          req.session.user = {
            userID: userDoc.userID,
            username: userDoc.userName,
            roles: userDoc.roles,
          };

          req.session.save(() => {
            res.redirect('/users/dashboard');
          });
      } else {
        res.redirect('/github-profile');
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      res.status(500).send("Error!");
    }
  }
);

router.get('/projects/:status', controller.getProjectsByStatus);
router.post('/projects', controller.createProject);
router.get('/applications/:freelancerId', controller.getApplicationsByFreelancer);
router.post('/applications', controller.createApplication);
router.get('/projects/clients',controller.getPostedProjectsByClients);

router.get('/projects', controller.getAssignedProjects);
router.get('/projects/:projectId/milestones',controller.getProjectMilestones);
router.patch('/milestones/:milestoneId/submit', controller.submitMilestoneWork);


module.exports = router;
