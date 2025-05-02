const express = require('express');
const router = express.Router();
const ClientProject = require('../api/mongoDB/Project');
const Project = require('../api/mongoDB/Freelancer_Project');
const middleware = require('../middlewares');

// Middleware to check if freelancer is logged in
function isFreelancer(req, res, next) {
    const roles = req.session?.user?.roles;

    if (roles && roles.includes('freelancer')) {
        return next();
    }

    return res.status(403).redirect('/users/login');
}

router.patch('/:projectId/accept', (req, res) => {
    res.send("Hello");
});

router.get('/activeProjects', middleware.ensureAuth, async (req, res) =>{
    const clientId = req.session.user.userID;

  try {
    // Fetch all active projects by this client
    const clientProjects = await ClientProject.find( {'clientID': clientId} );
    if (clientProjects.length === 0) {
      return res.render('activeProjects', { clientProjects: [] });
    }
      

    res.render('activeprojects', { clientProjects });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Projects.");
  }
});
router.get('/reviewForm', (req, res) => {
  res.render('reviewForm');
});

module.exports = router;