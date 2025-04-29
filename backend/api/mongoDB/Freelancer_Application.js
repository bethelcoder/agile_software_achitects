const mongoose = require('mongoose');
const { link } = require('../../routes/routes');

const applicationSchema = new mongoose.Schema({
  projectId: {type: String, required: true},
  title: { type: String, required: true },
  freelancerId: { 
    userID: { type: Number, required: true }, 
    userName: {type: String, required: true} // Store userID directly
  },
  Skills: {type: String, required: true},
  links: String,
  Message: String,
  createdAt: { type: Date, default: Date.now },
  Status: { type: String, required: true, default: 'Submitted' }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
