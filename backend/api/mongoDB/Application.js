const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  freelancerId: { 
    userID: { type: Number, required: true },  // Store userID directly
  },
  Message: String,
  createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
