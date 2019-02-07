'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSessionSchema = new Schema({
    timeStamp: {
        type: Date,
        trim: true,
        required: true
    },
    sessionID: {
        type: String,
        unique: true
    },
    userID: {
        type: String,
    },
});


module.exports = mongoose.model('UserSessionModel', UserSessionSchema);