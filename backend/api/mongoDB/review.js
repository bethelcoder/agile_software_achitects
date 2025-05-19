const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'clientProjects',
    required: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  reviewText: {
    type: String,
    trim: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
