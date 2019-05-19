'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 9108,
    bodyParser = require('body-parser'),
    Note = require('./models/messageModel'),
    User = require('./models/userModel'),
    UserSession = require('./models/UserSessionModel'),
    UserFamilyMembers = require('./models/UserFamilyMembersModel'),
    TokenDeviceModel = require('./models/TokenDeviceModel'),
    mongoose = require('mongoose');
var cors = require('cors');

app.use(cors());
app.use(express.static('public'));

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://127.0.0.1/Notedb', { useNewUrlParser: true });

run().catch(error => console.error(error));

async function run() {
  await mongoose.connect('mongodb://127.0.0.1/Notedb', {
    useNewUrlParser: true, 
    autoReconnect: true,
    reconnectTries: 1000000,
    reconnectInterval: 300,
    bufferMaxEntries: 0 // Disable node driver's buffering as well
  });
}

mongoose.connection.on('connected', function(){
    console.log("mongoose Connection connected")
});
mongoose.connection.on('error', function(){
    console.log("mongoose Connection error")
});
mongoose.connection.on("reconnected", () => {
    console.log("mongoose Connection Reestablished");
  });
  
mongoose.connection.on("disconnected", () => {
    console.log("mongoose Connection Disconnected");
  });
  
mongoose.connection.on("close", () => {
    console.log("mongoose Connection Closed");
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routs/appRouts');
routes(app);


app.listen(port);

console.log('app RESTful API server started on: ' + port);

module.exports = app;