const admin = require('firebase-admin');


const serviceAccount = require('./database.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  
});

const db = admin.firestore();
const User = db.collection("Users");

module.exports = User;