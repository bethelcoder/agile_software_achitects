const mongoose = require('mongoose');


/**
 * REVIEW -> model
 * 
 * Note: Please check if the atttributes of this table is exactly
 * what is needed for the project
 */
const reviewSchema = new mongoose.Schema({
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Review = mongoose.model("Review", taskSchema);
module.exports = Review;

