exports.sendNotification = function(message, deviceid, userID) {
    var AWS = require('aws-sdk'),
        mongoose = require('mongoose'),
        TokenDeviceModel = mongoose.model('TokenDeviceModel');

        AWS.config.loadFromPath('./Config.json');
        var sns = new AWS.SNS();

        TokenDeviceModel.find({userID: userID}, function (err, tokenDevices) {
            console.log("now get to the tokendevicemodel find");
            if (err) {
                console.log("tokendevicemodel find error");
            }
            if (tokenDevices == null) console.log("no devicetoken was found in the database");
            var i;
           for (i = 0; i < tokenDevices.length; i++) { 
              console.log("user id is: " + tokenDevices[i]["userID"]);
              if (tokenDevices[i]["deviceID"] != deviceid) {
                if (tokenDevices[i]["deviceType"] == "Android") {
                    console.log("sending notifications to android devices");
                   sendAndroidNotification(sns, tokenDevices[i]["token"], tokenDevices[i]["deviceType"], message)
                } else if (tokenDevice.deviceType == "iOS") {
                    sendiOSnotification(sns, tokenDevices[i]["token"], tokenDevices[i]["deviceType"], message)
                }
            }
           }
        });      
}

var sendAndroidNotification = function(sns, token, deviceid, message) {
    sns.createPlatformEndpoint({
        PlatformApplicationArn: "arn:aws:sns:us-east-1:495241948028:app/GCM/FamilyNoteApp",
        Token: token
      }, function(err, data) {
        if (err) {
          console.log(err.stack);
          return;
        }
      
        var endpointArn = data.EndpointArn;
      
        var payloadAndroid = {
          default: 'Hello World',
              GCM:{
                 data:{
                    message:message
                 }
              }    
        };
      
        payloadAndroid.GCM = JSON.stringify(payloadAndroid.GCM);
        payloadAndroid = JSON.stringify(payloadAndroid);
      
        console.log('android sending push');
        sns.publish({
          Message: payloadAndroid,
          MessageStructure: 'json',
          TargetArn: endpointArn
        }, function(err, data) {
          if (err) {
            console.log(err.stack);
            return;
          }
      
          console.log('android push sent');
          console.log(data);
        });
      });
}

var sendiOSnotification = function(sns, token, deviceid, message) {
    sns.createPlatformEndpoint({
        PlatformApplicationArn: '{APPLICATION_ARN}',
        Token: token
      }, function(err, data) {
        if (err) {
          console.log(err.stack);
          return;
        }
      
        var endpointArn = data.EndpointArn;
      
        var payload = {
          default: 'Hello World',
          APNS: {
            aps: {
              alert: message,
              sound: 'default',
              badge: 1
            }
          }
        };
      
        // first have to stringify the inner APNS object...
        payload.APNS = JSON.stringify(payload.APNS);
        // then have to stringify the entire message payload
        payload = JSON.stringify(payload);
      
        console.log('ios sending push');
        sns.publish({
          Message: payload,
          MessageStructure: 'json',
          TargetArn: endpointArn
        }, function(err, data) {
          if (err) {
            console.log(err.stack);
            return;
          }
      
          console.log('ios push sent');
          console.log(data);
        });
      });
}