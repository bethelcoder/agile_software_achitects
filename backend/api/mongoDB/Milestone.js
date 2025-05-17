const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clientProjects',
    required: true
  },
  milestones: [
    {
      name: { type: String, required: true },
      submittedWorkLink: { type: String, default: "" },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      message: { type: String, default: "" }  // ✅ Added message field
    }
  ],
  projectStatus: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
