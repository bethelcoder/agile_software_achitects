const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clientProjects', // this should match the model name you passed to mongoose.model()
    required: true
  },
  title: { type: String, required: true },
  freelancerId: { 
    userID: { type: Number, required: true }, 
    userName: { type: String, required: true }
  },
  Skills: { type: String, required: true },
  links: String,
  Message: String,
  createdAt: { type: Date, default: Date.now },
  Status: { type: String, required: true, default: 'Submitted' }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
