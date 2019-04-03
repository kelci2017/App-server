'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var TokenDeviceSchema = new Schema({
   
    userID: {
        type: String
    },
    deviceID: {
        type: String
    },
    deviceType: {
        type: String
    },
    token: {
        type: String
    }
});


module.exports = mongoose.model('TokenDeviceModel', TokenDeviceSchema);