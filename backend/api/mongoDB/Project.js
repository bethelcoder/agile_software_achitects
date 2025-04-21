const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['posted', 'active', 'completed'], default: 'posted' },
  clientId: { 
    userID: { type: Number, required: true }      
  },
  freelancerId: { 
    userID: { type: Number, required: true }         
  },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
