const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim : true,
        maxlength: 15
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim : true,
        maxlength: 15,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isCreated: {
        type: Date,
        required: true,
        default: Date.now
    }
},{
    timestamps: true
})