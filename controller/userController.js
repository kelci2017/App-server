'user strict'

var mongose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require("bcrypt"),
    User = mongose.model('User'),
    auth_config = require('../auth/auth_config'),
    authController = require('../auth/auth_controller'),
    UserSession = mongose.model('UserSessionModel'),
    TokenDeviceModel = mongose.model('TokenDeviceModel'),
    constants = require('../objs/constants'),
    UUID = require('uuid'),
    BaseResult = require('../objs/BaseResult'),
    TokenSessionResult = require('../objs/TokenSessionResult');



exports.register = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (user) return res.json(constants.RESULT_USER_EXISTED);
        console.log("the request body is: " + req.body.toString());
        var newUser = new User(req.body);
        newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
        var uuid4 = UUID.v4('String');
        newUser.userID = uuid4.toString();
        newUser.save(function (err, user) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (user == null) return res.json(constants.RESULT_NOTE_NULL);
        requestToken(user, user.userID, res);
        //return res.json(new BaseResult(97, user));
    });
    });
};

exports.sign_in = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (user) console.log("user name found is: " + user.userName);
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (!user) {
            return res.json(constants.RESULT_USER_NOTFOUND);
        } else if (user) {
            console.log("the useris from body is: " + req.body.userid);
            if(bcrypt.compareSync(req.body.password, user.hash_password)) {
                console.log("logged in here"); 
                console.log("userid after loggedin is: " + user.userID);          
                requestToken(user, user.userID, res);
               } else {
                return res.json(constants.RESULT_WRONG_PASSWORD);
                console.log('Comparison error: ', err);
               }
                        }
                    });
};


exports.sign_out = function (req, res) {
   
            UserSession.remove({
                sessionID: req.query.sessionid
            }, function (err, session) {
                if (err) return res.json(constants.RESULT_UNKNOWN);
                return res.json(constants.RESULT_SUCCESS);
            });
        
};

exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' })
    }
};

exports.deregister = function (req, res) {
    User.findOne({
        userName: req.params.userName,
    }, function (err, user) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (user) {
            User.remove({
                userName: user.userName,
                email: user.email,
            }, function (err, task) {
                if (err) return res.json(constants.RESULT_UNKNOWN);
                return res.json({ message: 'User successfully deleted' });
            });
        }
    });
};

exports.deleteDevice = function (req, res) {
    TokenDeviceModel.find({
        deviceType: req.params.deviceType,
    }, function (err, tokenDevices) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (tokenDevices) {
            var i;
           for (i = 0; i < tokenDevices.length; i++) { 
            TokenDeviceModel.remove({
                userID: tokenDevices[i]["userID"],
                deviceID: tokenDevices[i]["deviceID"],
                deviceType: tokenDevices[i]["deviceType"],
                token: tokenDevices[i]["token"]
            }, function (err, task) {
                if (err) console.log(err);
                console.log("success");
            });
           }
        }
    });
};

exports.sessionCheck = function (req, res) {
    return res.json(constants.RESULT_SUCCESS);
}

var requestToken = function(user, userID, res) {
    var request = require('request');
    request({
        url: "http://localhost:8080/auth/getToken",
        method: "GET",
        headers: {
            "requestkey": jwt.sign({ email: user.email }, auth_config.key),
            "applicationid":1987
        },
        json: true
    }, function (error, response, body) {
        if (error) return res.json(constants.RESULT_UNKNOWN);
        if (!body) return res.json(constants.RESULT_ACCESS_DENIED);
        if (body.resultCode != 0) {
            console.log('body resultCode is: ', body.resultCode );
            return res.json(body);
        }
        if (body.resultCode == 0) {
            var sessionID = UUID.v4('String');
            
            var new_session = new UserSession({timeStamp: new Date(), sessionID: sessionID, userID: userID,});
            
            new_session.save(function (err, session) {
                if (err) {
                    console.log("there is error when save");
                    return res.json(constants.RESULT_UNKNOWN);
                }
                return res.json(new TokenSessionResult(body.resultCode, body.resultDesc, userID, body.token, sessionID));
            });
            
            
        }

    });   
                        
}
  
  exports.postFamilyMembers = function(req, res) {
    var UserFamilyMembers = mongose.model('UserFamilyMembers'),
        UserSession = mongose.model('UserSessionModel');
        console.log("post post post -----------------" + req.body.familyMembers);
        
    UserSession.findOne({ sessionID: req.query.sessionid }, function (err, session) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (session == null) {
            return res.json(constants.RESULT_NULL);
        } 
        UserFamilyMembers.findOne({ userID: session.userID }, function (err, familyMembersModel) {
            if (err) {
                
                return res.json(constants.RESULT_UNKNOWN);
            }
            if (familyMembersModel == null) {
                var new_userFamilyMembers = new UserFamilyMembers(req.body);
                new_userFamilyMembers.save(function (err, familyMembersModel) {
                    if (err) {                       
                        return res.json(constants.RESULT_UNKNOWN);
                    }
                    if (familyMembersModel == null) return res.json(constants.RESULT_NULL);
                    console.log("now the family members has been saved");
                    //return res.json(new BaseResult(0, familyMembersModel.familyMembers));
                    return res.json(constants.RESULT_SUCCESS);
                });
            } else {
                UserFamilyMembers.findOneAndUpdate({ userID: session.userID }, { familyMembers: req.body.familyMembers }, { new: true }, function (err, familyMembers) {
                    if (err) {
                        console.log("error error");
                        return res.json(constants.RESULT_UNKNOWN);
                    }
                    return res.json(constants.RESULT_SUCCESS);
                });
            }
        }); 
            
    });   
                        
} 

exports.getFamilyMembers = function(req, res) {
    var UserFamilyMembers = mongose.model('UserFamilyMembers'),
        UserSession = mongose.model('UserSessionModel');

        console.log("get get .................")
        
    UserSession.findOne({ sessionID: req.query.sessionid }, function (err, session) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (session == null) {
            return res.json(constants.RESULT_NULL);
        } 
        UserFamilyMembers.findOne({ userID: session.userID }, function (err, userFamilyMembers) {
            if (err) return res.json(constants.RESULT_UNKNOWN);
            if (userFamilyMembers.familyMembers == null) return res.json(constants.RESULT_NULL);
            console.log("The family members got from databse is; " + userFamilyMembers.familyMembers);
            return res.json(new BaseResult(0, userFamilyMembers.familyMembers));
        });    
    });  
                        
} 

exports.registerNotification = function(req, res) {
    UserSession.findOne({ sessionID: req.query.sessionid }, function (err, session) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (session == null) {
            return res.json(constants.RESULT_NULL);
        } 
        TokenDeviceModel.findOneAndUpdate({ deviceID: req.body.deviceID }, { token: req.body.token }, { new: true }, function (err, tokenDevice) {
            if (err) {
                console.log("there is error when findoneandupdate in the tokendevicemodel");
                return res.json(constants.RESULT_UNKNOWN);
            }
            if (tokenDevice == null) {
                console.log("the tokendevice no found, new one would be created");
                console.log("the new created deviceID:" + req.body.deviceID + " deviceType: " + req.body.deviceType + " token: " + req.body.token)
                var token_device = new TokenDeviceModel({userID: session.userID, deviceID: req.body.deviceID, deviceType: req.body.deviceType, token: req.body.token});
            
                token_device.save(function (err, tokenDevice) {
                        if (err) {
                            console.log("there is error when save tokendevice model");
                            return res.json(constants.RESULT_UNKNOWN);
                        }
                        return res.json(constants.RESULT_SUCCESS);
                    });
            }
        });           
    });  
}
  