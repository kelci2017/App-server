'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
    ifProd: {
        type: Number
    },
    orgid: {
        type: String
    },
    parampath: {
        type: String
    },
    path: {
        type: String
    },
    port: {
        type: Number
    },
    protocol: {
        type: String
    },
    server: {
        type: String
    },
    sattuscode: {
        type: Number
    }
});


module.exports = mongoose.model('Configlist', ConfigSchema);