'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 4000,
    mongoose = require('mongoose'),
    Task = require('./modul/todoListModel'),
    User = require('./modul/userModle'),
    Configlist = require('./modul/configlistModel'),
    bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routs/todoListRouts');
routes(app);


app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

module.exports = app;