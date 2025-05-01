const passport = require('passport');
const User = require('../api/mongoDB/User');
const clientProject = require('../api/mongoDB/project');
const clientDes = require('../api/mongoDB/description');
const milestone = require('../api/mongoDB/milestone');
const reviews= require('../api/mongoDB/reviews');

//controllers for registration and login
const Project = require('../api/mongoDB/Freelancer_Project');
const Application = require('../api/mongoDB/Freelancer_Application');


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

        req.session.user = {
            userID: userData.userID,
            userName: userData.userName,
            roles: userData.roles
        };
        delete req.session.tempUser;
        console.log('User data successfully saved to MongoDB.');
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        console.error("Error saving user:", error.message);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ message: "Error saving user" });
    }
};

const submitDetails = async (req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const minPay = req.body.minPay;
    const skills= req.body.skills;

    const Clientlis={
        clientID: req.body.clientID,
        title: title,
        description:description,
        minPay: minPay,
        applicableSkills:skills
    }


    let errors= [];
    try{

    const Listing = new Project(Clientlis);
    await Listing.save();

    }
    catch (error){
        res.status(500).json({ message: "Error adding Project" }); 
    }

};

const clientProf = async (req, res) => {
    const { organisation, position, location, about, userID } = req.body;
    const projects = await Project.find({});
      
   
    const profile = {
      userID,
      Organisation: organisation,
      Position: position,
      Location: location,
      About: about
    };
  
    
    try {
        const updatedProfile = await clientDes.findOneAndUpdate(
          { userID },
          profile,
          { new: true, upsert: true } // upsert = create if not exist
        );
    
        const user = await User.findOne({ userID });
    
        if (!user) {
          return res.status(404).send("User not found");
        }
    
        res.render('clientDashboard', { userName: user.userName, userID ,projects});
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ message: "Error adding Client Profile" });
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


const getApplicationsByFreelancer = (req, res) => {
    res.render('freelancer_applications')
  };

const createApplication = async (req, res) => {
    try {
        const app = await Application.create(req.body);
        res.status(201).json(app);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create application' });
    }
};

const viewMilestones = async(req, res)=>{
    const projectId= req.body.projectId;
    try{
        const milestone= await milestone.findOne({projectId: projectId});
        res.send(milestone);

    }
    catch(err){
        res.status(500).json({ error: 'Failed to fetch milestone' });
    }
};


const markProjectasCompleted = async(req, res)=>{
    const projectId= req.body.projectID;

    try{
        await Project.updateOne({projectID: projectID},{$set: {status:"completed"}});
        res.send("Updated project status");
    }
    catch(err){
        res.status(500).json({ error: 'Failed to update project status' });
    }
}

const review = async(req, res)=>{
    const rev={ 
        clientID: req.body.clientID,
        userID: req.body.userID,
        title: req.body.title,
        details: req.body.details}

    try{
        const revs= new reviews(rev);
        await revs.save();
    }
    catch(err){
        res.status(500).json({ error: 'Failed to create review' });
    }
}

module.exports = {
  
    regPage,
    logPage,
    submitUsername,
    getProjectsByStatus,
    createProject,
    getPostedProjectsByClients,
    getApplicationsByFreelancer,
    createApplication,
    clientProf,
    submitDetails,
    viewMilestones,
    markProjectasCompleted,
    review
};
