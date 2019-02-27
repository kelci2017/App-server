'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserFamilyMembers = new Schema({
    userID: {
        type: String,
        unique: true
    },
    familyMembers: {
        type: Array
    },
});


module.exports = mongoose.model('UserFamilyMembers', UserFamilyMembers);