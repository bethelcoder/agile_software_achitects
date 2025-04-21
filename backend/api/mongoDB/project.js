const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clientID: { type: Number },
    title: { type: String },
    description: { type: String },
    minPay: {type:Number},
    applicableSkills:{type:String},
    deadline:{type:String},
    status:{type:String}
});

const project = mongoose.model('clientProjects', userSchema);

module.exports = project;
