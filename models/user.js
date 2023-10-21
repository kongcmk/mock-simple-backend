const mongoose = require('mongoose');
const uuid4 = require('uuid4');

const userSchema = new mongoose.Schema({

    uuid: {
        type: String,
        required: true,
        default: uuid4()
    },
    username: {
        type: String,
        required: true,
        unique: true,
        min: 6,
        max: 32
    },
    first_name: {
        type: String,
        default: null
    },
    last_name: {
        type: String,
        default: null
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        default: null
    },
    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }],
    deactivated: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: null
    },
    last_login: {
        type: Date,
        default: null
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;