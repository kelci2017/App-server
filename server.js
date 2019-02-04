'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 4000,
    bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routs/appRouts');
routes(app);


app.listen(port);

console.log('app RESTful API server started on: ' + port);

module.exports = app;