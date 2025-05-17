const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'clientProjects', // this should match the model name you passed to mongoose.model()
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
    }
  ],
  projectStatus: {
    type: Boolean,
    default: false // overall project completion status
  },
  // dueDate: {
    
  // }
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
