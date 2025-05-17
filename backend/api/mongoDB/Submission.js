const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: false
  },
  milestoneId: {
   type: mongoose.Schema.Types.ObjectId,
   required: true
  },
  freelancerId: {
    userID: { type: Number, required: true },
    userName: { type: String, required: true }
  },
  submittedWorkLink: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  remarks: String
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
