const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: { type: Number, unique: true, required: true },
    userName: { type: String, unique: true, required: true },
    roles: { type: [String], required: true }
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
