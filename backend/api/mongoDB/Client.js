const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clientID: { type: Number, unique: true, required: true },
    title: { type: String },
    description: { type: String, required: true },
    minPay: {type:Number, required:true},
    applicableSkills:{type:[String], required:true}
});

const Client = mongoose.model('Client', userSchema);

module.exports = Client;
