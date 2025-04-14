const admin = require('firebase-admin');
const serviceAccount = require('../freelance-studio-c3ee1-firebase-adminsdk-fbsvc-2dc3372ab3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
