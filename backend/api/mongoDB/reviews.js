const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clientID: { type: Number},
    userID: { type: Number},
    title: { type: String },
    details:{type: String}
});

const reviews = mongoose.model('reviews', userSchema);

module.exports = reviews;
