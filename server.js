'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 4000,
    bodyParser = require('body-parser'),
    Note = require('./models/messageModel'),
    User = require('./models/userModel'),
    UserSession = require('./models/userSessionModel'),
    mongoose = require('mongoose');
var cors = require('cors');

app.use(cors());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Notedb', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routs/appRouts');
routes(app);


app.listen(port);

console.log('app RESTful API server started on: ' + port);

module.exports = app;