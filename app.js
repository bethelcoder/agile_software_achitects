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
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const html_to_pdf = require('html-pdf-node');
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
const Project =  require('./backend/api/mongoDB/Project');
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

app.post('/delete-project', async(req,res) => {
  const project = new mongoose.Types.ObjectId(req.body.projectID);
  const projects = await Project.find({});
  
  try{
    await Project.deleteOne(project._id);
  //  await Application.deleteMany({ project }); 
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

app.post('/delete-user', async(req,res)=>{
  const user= new mongoose.Types.ObjectId(req.body.userID);

  try{
    
    await User.deleteOne(user._id);
    res.redirect('/users/dashboard');
  }
  catch(error){
    res.status(500).json({ message: "Error removing User" }); 
    console.log(error);
  }

});

app.post('/delete-form', async(req,res)=>{
  const app= new mongoose.Types.ObjectId(req.body.formID);

  try{
    
    await Application.deleteOne(app._id);
    res.redirect('/users/dashboard');
  }
  catch(error){
    res.status(500).json({ message: "Error removing Application" }); 
    console.log(error);
  }

});

app.post('/reports/', async(req, res) => {
  const userID = parseInt(req.body.userID);
  

  const application= await Application.find({'freelancerId.userID': userID, Status:'Hired'});
  let projects = [];
  let payments=[];
  let n= application.length;
  let m=0;
  for (const item of application) {
    const projectid = item.projectId;
    const project = await Project.findById(projectid);
    
    const obj = {
      name: item.title,
      status: project?.status
    };

  //  projects.push(obj);

   

    let paymentStatus="Pending";
    if (project?.status!="Active"){
      paymentStatus="Received";
      m++;
    }

    const user= await User.findOne({userID: project.clientID});
    const obj2={
      client:user.userName,
      project: item.title,
      amount: project?.minPay,
      status: paymentStatus
    };

    if(req.body.status){
      
        if (req.body.status=="Completed" && project?.status=="Complete"){
          projects.push(obj);
          payments.push(obj2);
        }
        else if(req.body.status=="Active" && project?.status=="Active"){
            projects.push(obj);
            payments.push(obj2);
        }
        else if (req.body.status=="All"){
          projects.push(obj);
          payments.push(obj2);
        }
    }
    else{
       projects.push(obj);
       payments.push(obj2);
    }
    
    
   
  }
  let rate=0;
  if (n!=0){
    rate=m/n *100;
  } 

  res.render('reports', { projects, payments ,rate, userID});
});




app.post('/generateReport/', async (req, res) => {
  const userID = parseInt(req.body.userID);

  
  // 1. Fetch your data (reuse your logic or import it from your controller)
  const application = await Application.find({ 'freelancerId.userID': userID, Status: 'Hired' });
  let projects = [];
  let payments = [];
  let n = application.length;
  let m = 0;

  for (const item of application) {
    const projectid = item.projectId;
    const project = await Project.findById(projectid);
    
    const obj = {
      name: item.title,
      status: project?.status
    };
    let paymentStatus="Pending";
    if (project?.status!="Active"){
      paymentStatus="Received";
      m++;
    }
    const user= await User.findOne({userID: project.clientID});
    const obj2={
      client:user.userName,
      project: item.title,
      amount: project?.minPay,
      status: paymentStatus
    };
    projects.push(obj);
    payments.push(obj2);
   
  }

  const rate = n > 0 ? ((m / n) * 100).toFixed(1) : 0;

  // 2. Render the EJS to HTML string
  const html = await ejs.renderFile(path.join(__dirname, '/frontend/view', 'reports.ejs'), {
   projects, payments ,rate, userID
  });


  // 3. Generate PDF using Puppeteer
 // const browser = await puppeteer.launch();
  
 let options = { format: 'A4' };
let file={ content:html};
html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="report.pdf"',
    'Content-Length': pdfBuffer.length
  });

  res.send(pdfBuffer);
});
});

app.get('/admin/getUsers', async(req, res)=>{
 // const userID = req.session.user.userID;
  let users= await User.find({});
  try{
    if (req.query.Search){
      let userz=[];
      users.forEach((user)=>{
        if (user.userName==req.query.Search){
          userz.push(user);
        }
      })
      users=userz;
      res.render('user',{users});
    }
    else{
      res.render('user',{users});
    }
    
  }
  catch(error){
    console.error('Error checking user existence:', error);
      res.status(500).send("Error!");
  }

});

app.get('/admin/getApplications', async(req, res)=>{
 // const userID = req.session.user.userID;
  let applications= await Application.find({});
  try{
    if (req.query.Search){
      let appz=[];
      applications.forEach((app)=>{
        if (app.title==req.query.Search){
          appz.push(app);
        }
      })
      applications=appz;
      res.render('allapps',{applications});
    }
    else{
      res.render('allapps',{applications});
    }
    
  }
  catch(error){
    console.error('Error checking user existence:', error);
      res.status(500).send("Error!");
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
  res.render('landingPage2');
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
            success_url: "https://freelancestudioweb-f3dpbqgcf2d9dxdr.southafricanorth-01.azurewebsites.net/complete?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "https://freelancestudioweb-f3dpbqgcf2d9dxdr.southafricanorth-01.azurewebsites.net/cancel"
        });
        res.redirect(303, session.url);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong.");
    }
});

app.get('/complete', async (req, res) => {
  res.redirect("thank-you");
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
