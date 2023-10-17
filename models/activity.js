const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    activity_type: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: new Date()
    },
    image_url: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_at: {
        type: Date,
        default: null
    }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;