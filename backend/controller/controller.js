const passport = require('passport');
const User = require('../api/mongoDB/User');


//controllers for registration and login
const Project = require('../api/mongoDB/Project');
const Application = require('../api/mongoDB/Application');


const regPage = (req, res) => {
    res.render('register');
};

const logPage = (req, res) => {
    res.render('login');
};

const submitUsername = async (req, res) => {
    const userName = req.body.username;
    const googleId = req.session.tempUser?.userId;
    const roles = req.body.roles;

    if (!googleId) {
        return res.status(400).send('Session expired. Please re-login.');
    }

    if (!roles || (Array.isArray(roles) && roles.length === 0)) {
        return res.status(400).send('Please select at least one role.');
    }

    const userData = {
        userID: googleId,
        userName,
        roles: Array.isArray(roles) ? roles : [roles],
    };

    console.log('Ready to save user data:', userData);

    let errors = [];
    try {
        const existingUser = await User.findOne({ userName: userData.userName });
        if (existingUser) {
            errors.push({ message: "Username already exists. Please come up with a new one" });
            return res.render('usernamepage', {
                errors,
                userName: userData.userName,
                roles: userData.roles
            });
        }

        const newUser = new User(userData);
        await newUser.save();
        console.log('User data successfully saved to MongoDB.');
        if(roles.length == 1 && roles[0] == 'Client'){
            return res.status(200).render('clientDashboard', {userName: userData.userName});
        }
        
        // res.status(200).render('welcome', { userName });

    } catch (error) {
        console.error("Error saving user:", error.message);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ message: "Error saving user" });
    }
};






const getProjectsByStatus = async (req, res) => {
    try {
        const projects = await Project.find({ status: req.params.status });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get projects' });
    }
};
const getPostedProjectsByClients = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'posted' });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get posted projects' });
    }
};


const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create project' });
    }
};


const getApplicationsByFreelancer = async (req, res) => {
    const apps = await Application.find({ "freelancerId.userID": req.params.freelancerId })
      .populate('projectId', 'title status description');
    res.json(apps);
  };

const createApplication = async (req, res) => {
    try {
        const app = await Application.create(req.body);
        res.status(201).json(app);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create application' });
    }
};

module.exports = {
  
    regPage,
    logPage,
    submitUsername,



    getProjectsByStatus,
    createProject,

    getPostedProjectsByClients,
    getApplicationsByFreelancer,
    createApplication
};
