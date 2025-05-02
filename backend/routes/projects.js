const express = require('express');
const router = express.Router();
const Application = require('../api/mongoDB/Freelancer_Application');
const Project = require('../api/mongoDB/Freelancer_Project');
const middleware = require('../middlewares');
const controller = require('../controller/controller');
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



router.get('/milestones/:milestoneId/tasks', controller.viewMilestones);
router.get('/projects/:projectId/complete',controller.markProjectasCompleted);
router.get('/reviews', controller.review);


module.exports = router;