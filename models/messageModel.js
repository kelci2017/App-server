'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var MessageSchema = new Schema({
    fromWhom: {
        type: String,
        trim: true,
        required: true
    },
    toWhom: {
        type: String,
        trim: true
    },
    noteBody: {
        type: String,
        trim: true,
    },
    created: {
        type: Date,
        default: Date.now
    },
    userID: {
        type: String,
        required: true
    },
});


module.exports = mongoose.model('Message', MessageSchema);