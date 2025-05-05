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
      // description: { type: String, required: true },
      status: { type: Boolean, default: false }
    }
  ],
  projectStatus: {
    type: Boolean,
    default: false // overall project completion status
  }
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
