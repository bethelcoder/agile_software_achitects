const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controller/controller');
const User = require('../api/mongoDB/User');
const middleware = require('../middlewares');
const description= require('../api/mongoDB/description');
const Project = require('../api/mongoDB/Project');
const Application = require('../api/mongoDB/Freelancer_Application');
const mongoose = require('mongoose');

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
  const applications= await Application.find({});
  const users= await User.find({});
  userRole.forEach((role)=>{
    if (role=="admin"){
      const projects=allProjects;
    
      res.render('admin',{userName,userID,projects,users, applications});
    }
  })
  if (userRole.length == 1 && userRole[0] == "client") {
    // ✅ Fetch projects before rendering
    const clientID = req.user.clientID; // or however you store it
    const projects = await Project.find({ clientID: userID });
    res.render('clientDashboard', { userName, userID, projects });
  } else if (userRole.length == 1 && userRole[0] == "freelancer") {
    res.render('freelancer_dashboard', { userName, allProjects, userID });
  } 
  
});

router.get('/dashboard/client', async(req,res)=>{
  const userID = parseInt(req.query.userID);
  const userDoc = await User.findOne({ userID });
  const userName = userDoc.userName;
  const userRole = userDoc.roles;
  const projects = await Project.find({ clientID: userID });
  userRole.forEach((role)=>{
   
    if (role=="client"){
      res.render('clientDashboard', { userName, userID, projects });
    }
  })

});
router.get('/dashboard/freelancer', async (req, res, next) => {
  try {
    const userID = parseInt(req.query.userID);
    const userDoc = await User.findOne({ userID });

    if (!userDoc) {
      return res.status(404).send("User not found");
    }

    const userName = userDoc.userName;
    const userRole = userDoc.roles;
    const allProjects = await Project.find({});

    if (!userRole.includes("freelancer")) {
      userRole.push("freelancer");
      await User.updateOne({ userID: userID }, { $set: { roles: userRole } });
    }

    
    if (userRole.includes("freelancer")) {
      return res.render('freelancer_dashboard', { userName, allProjects, userID });
    }

   
    
  } catch (err) {
      console.error('Error checking user existence:', err);
      res.status(500).send("Error!");
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

router.get('/admin-page', async(req, res)=>{
  const userID = req.user.profile.id;
  const userDoc = await User.findOne({ userID });
  const userName = userDoc.userName;
  const userRole = userDoc.roles;
  const allProjects = await Project.find({});
  const users= await User.find({});
  const applications= await Application.find({});
  const projects=allProjects;
  res.render('admin',{userName,userID,projects,users, applications});

});

router.post('/mark-As-Admin', async(req,res)=>{
  const user= new mongoose.Types.ObjectId(req.body.userID);
  const userDoc = await User.findOne({ _id : user._id });
  try{
    userRole=userDoc.roles;
    userRole.push("admin");
    await User.updateOne({_id:user._id}, { $set: { roles: userRole } });
    res.redirect('/users/dashboard');
  }
  catch(error){
    res.status(500).json({ message: "Error removing User" }); 
    console.log(error);
  }

});

router.get('/projects/:status', controller.getProjectsByStatus);
router.post('/projects', controller.createProject);
router.get('/applications/:freelancerId', controller.getApplicationsByFreelancer);
router.post('/applications', controller.createApplication);
router.get('/projects/clients',controller.getPostedProjectsByClients)

module.exports = router;
