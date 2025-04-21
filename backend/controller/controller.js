const passport = require('passport');
const User = require('../api/mongoDB/User');
const Client = require('../api/mongoDB/Client');
const clientDes = require('../api/mongoDB/description');
//controllers for registration and login
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
        userID: googleId, // Ensure it's an INT for MongoDB
        userName,
        roles: Array.isArray(roles) ? roles : [roles], // Always an array
    };

    console.log('Ready to save user data:', userData);

    let errors = [];
    try {
        // Check if username already exists in the db
        const existingUser = await User.findOne({ userName: userData.userName });
        if (existingUser) {
            errors.push({ message: "Username already exists. Please come up with a new one" });
            return res.render('usernamepage', {
                errors,
                userName: userData.userName,
                roles: userData.roles
            });
        }

        // Save user data to MongoDB
        const newUser = new User(userData);
        await newUser.save();
        console.log('User data successfully saved to MongoDB.');

        res.status(200).render('welcome', { userName });

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

    const Listing = new Client(Clientlis);
    await Listing.save();

    }
    catch (error){
        res.status(500).json({ message: "Error adding Job Listing" }); 
    }

}

const clientProf = async (req, res) => {
    const { organisation, position, location, about, userID } = req.body;
  
    const profile = {
      userID,
      Organisation: organisation,
      Position: position,
      Location: location,
      About: about
    };
  
    console.log('Ready to save profile data:', profile);
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
    
        res.render('welcome', { userName: user.userName, userID });
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ message: "Error adding Client Profile" });
    }
  };


module.exports = {
    regPage,
    logPage,
    submitUsername,
    submitDetails,
    clientProf
}