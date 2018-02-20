'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    roles: [{
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    }],
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('User', schema);