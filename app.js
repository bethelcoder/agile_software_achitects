const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
require('dotenv').config();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
app.use(express.json());
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'frontend', 'view'));
app.use(express.static('public'));
app.use("/config", express.static("config"));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
const User=require('./backend/api/mongoDB/User')
const Project =  require('./backend/api/mongoDB/project');
const description=  require('./backend/api/mongoDB/description');
const Application = require('./backend/api/mongoDB/Freelancer_Application');

  
  // Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

require('./backend/api/passport');
const userRoutes = require('./backend/routes/routes');
const applicationRoute = require('./backend/routes/application');
const projectRoute = require('./backend/routes/projects');
const aiApplication = require('./backend/routes/aiApplication');

app.use('/auth', userRoutes);       
app.use('/users', userRoutes);      
app.use('/application', applicationRoute);
app.use('/projects', projectRoute);
app.use('/api', aiApplication);

app.get('/g-profile', (req, res) => {
  const googleId = req.user.profile.id;
  req.session.tempUser = 
  { 
    userId: googleId 
  };
  res.render('usernamepage');
});

app.get('/github-profile', (req, res) => {
  const githubId = req.user.profile.id;
  req.session.tempUser = 
  { 
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
      profile,
      projects
    });
  }
  else{
    res.render('clientProfile', { userID, profile, projects });
  }

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Server error');
  }
  
});

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
    res.redirect('/users/dashboard'); //changed this route
}
catch (error){
    res.status(500).json({ message: "Error adding Project" }); 
    console.log(error);
}
  
});

app.get('/delete-project', async(req,res) => {
  const project = req.query.projects_id;
  const projects = await Project.find({});
  
  try{
    await Project.deleteOne(project);
    await Application.deleteMany({ project }); 
    //const userId=req.quer;
    const userID=req.session.user.userID;
    const user = await User.findOne({ userID });
    const userName= user.userName; 
    res.redirect('/users/dashboard');
    } catch(error) {
    res.status(500).json({ message: "Error removing Project" }); 
    console.log(error);
  }
});



app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect('/error');
    }

    req.session.destroy((err) => {
      if (err) console.error("Session destruction error:", err);
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});


app.get('/', (req, res) => {
  res.render('landingPage');
});

app.post('/checkout', async (req, res) => {
    try {
        const amount = parseFloat(req.body.amount);
        if (!amount || amount <= 0) {
            return res.status(400).send("Invalid amount.");
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'zar',
                        product_data: {
                            name: 'Custom Payment'
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/cancel`
        });

        res.redirect(303, session.url);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong.");
    }
});

app.get('/complete', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id, {
            expand: ['payment_intent.payment_method']
        });
        const lineItems = await stripe.checkout.sessions.listLineItems(req.query.session_id);
        console.log(session);
        console.log(lineItems);
        res.redirect('/users/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving session details");
    }
});

app.get('/cancel', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;
