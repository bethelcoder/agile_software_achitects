const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  projectId: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  status: { type: String, enum: ['pending', 'in progress', 'submitted', 'approved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Milestone = mongoose.model('Milestone', milestoneSchema);
module.exports = Milestone;
