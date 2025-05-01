const mongoose = require('mongoose');


/**
 * TASK -> model
 * 
 * Note: Please check if the atttributes of this table is exactly
 * what is needed for the project
 */
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    milestoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "milestone"
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending"
    }
});


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;

