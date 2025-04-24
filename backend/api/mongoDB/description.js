const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID:{type: Number, unique: true, required: true},
    Organisation: { type: String},
    Position: {type:String},
    Location:{type:String},
    About:{type:String}
});

const clientDes = mongoose.model('ClientDescription', userSchema);

module.exports = clientDes;