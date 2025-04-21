//app config
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
app.use(express.json());
const passport = require('passport');
const session = require('express-session');
const PORT = process.env.PORT || 4000;
const description=  require('./backend/api/mongoDB/description');
const Project =  require('./backend/api/mongoDB/project');
const User=require('./backend/api/mongoDB/User')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// View and static config
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'frontend', 'view'));//if views is located in another folder called frontend!!
app.use(express.static('public'));
app.use("/config", express.static("config"));
const userRoutes = require('./backend/routes/routes');
require('./backend/api/passport');

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }));
  
  // Initialize passport and session
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });
  // Google authentication routes
    app.use('/auth', userRoutes);

    app.get('/g-profile', (req, res) => {

        const googleId = req.user.id;

        req.session.tempUser = {
            userId: googleId,
          };
        res.render('usernamepage');
    });

    app.get('/github-profile', (req, res) => {

        const githubId = req.user.id;
        console.log(req.user);
        req.session.tempUser = {
            userId: githubId,
          };
        res.render('usernamepage');
    });




    app.get('/submit-clientProfile',async(req, res)=>{
      const userID = req.query.userID;
      const projects = await Project.find({});
      
    
  
    try {
      const profile = await description.findOne({ userID })|| null;
      if (profile){
      res.render('clientProfile', {
        userID,
        profile,projects
      });
    }
    else{
      res.render('clientProfile', { userID, profile,projects });
    }
    
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).send('Server error');
    }
      
    })




    app.get('/post-project',async(req, res)=>{
      const userID = req.query.userID;
      const title = req.query.title;
      const description = req.query.description;
      const minPay = req.query.minPay;
      const deadline = req.query.deadline;
      const skills = req.query.skills;
      
      const Clientlis={
        clientID: userID,
        title: title,
        description:description,
        minPay: minPay,
        applicableSkills:skills,
        deadline:deadline,
        status:"Active"
    }

    const projects = await Project.find({});
      

    let errors= [];
    try{

    const Listing = new Project(Clientlis);
    await Listing.save();
    const user = await User.findOne({ userID });
    const userName= user.userName; 
    res.render('clientDashboard',{ userName  , userID, projects})
    }
    catch (error){
        res.status(500).json({ message: "Error adding Project" }); 
        console.log(error);
    }
      
    })

    app.get('/delete-project', async(req,res)=>{
      const project = req.query.project;
      const projects = await Project.find({});
      try{
        await Project.deleteOne(project);
        
        const userId=req.query.userId;
        const userID=Number(userId);
        const user = await User.findOne({ userID });
        const userName= user.userName; 
        res.render('clientDashboard',{ userName  , userID, projects})
        
        
      }
      catch(error){
        res.status(500).json({ message: "Error removing Project" }); 
        console.log(error);
      }
    })

    app.get('/logout', (req, res) => {
        req.logout(function(err) {
          if (err) {
            console.error("Logout error:", err);
            return res.redirect('/error'); // Or handle as needed
          }
      
          req.session.destroy((err) => {
            if (err) {
              console.error("Session destruction error:", err);
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.redirect('/'); // Redirect to homepage or login page
          });
        });
      });
      

app.get('/', (req, res) => {
    res.render('index');
});

  

app.use('/users', userRoutes);
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));

module.exports = app;