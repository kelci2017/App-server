'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 9110,
    bodyParser = require('body-parser'),
    Note = require('./models/messageModel'),
    User = require('./models/userModel'),
    UserSession = require('./models/UserSessionModel'),
    UserFamilyMembers = require('./models/UserFamilyMembersModel'),
    TokenDeviceModel = require('./models/TokenDeviceModel'),
    mongoose = require('mongoose');
var cors = require('cors');

app.use(cors());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/Notedb', { useNewUrlParser: true });

mongoose.connection.on('connected', function(){
    console.log("mongoose is connected successfully")
});
mongoose.connection.on('error', function(){
    console.log("mongoose is not connected..")
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routs/appRouts');
routes(app);


app.listen(port);

console.log('app RESTful API server started on: ' + port);

module.exports = app;