const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: Object,
    }
    
}, {
    timestamps: true
});

const user = mongoose.model('user', userSchema);

module.exports = user;
