const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResumeSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: Array,
        required: false
    },
    pno: {
        type: Array,
        required: false
    },
    linked: {
        type: Array,
        required: false
    },
    lines: {
        type: Number,
        required: true
    },
    chars: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('resumes', ResumeSchema);