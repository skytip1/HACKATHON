const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,  // Add email or communication field
    income: Number,
    studentStatus: String,
    roommates: Number,
    location: String,
    job: String,
    salary: Number
});

module.exports = mongoose.model('User', UserSchema);
