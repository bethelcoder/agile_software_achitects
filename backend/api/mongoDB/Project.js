const mongoose = require('mongoose');

const clientProjectSchema = new mongoose.Schema({
    clientID: { type: Number },
    title: { type: String },
    description: { type: String },
    minPay: { type: Number },
    applicableSkills: { type: String },
    deadline: { type: String },
    status: { type: String, default: 'posted' }
});

// Avoid OverwriteModelError
const ClientProject = mongoose.models.clientProjects || mongoose.model('clientProjects', clientProjectSchema);

module.exports = ClientProject;
