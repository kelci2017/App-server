'user strict'

var mongose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require("bcrypt"),
    User = mongose.model('User');
    auth_config = require('../auth/auth_config'),
    authController = require('../auth/auth_controller'),
    UserSession = mongose.model('UserSessionModel'),
    constants = require('../objs/constants'),
    UUID = require('uuid'),
    BaseResult = require('../objs/BaseResult');

var TokenSessionResult = require('../objs/TokenSessionResult');



exports.register = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (user) return res.json(constants.RESULT_USER_EXISTED);
    });
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
            var userID = req.body.userID;
            console.log("the useris from body is: " + req.body.userid);
            if(bcrypt.compareSync(req.body.password, user.hash_password)) {
                console.log("logged in here");           
                requestToken(user, userID, res);
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
                                    return res.json(new TokenSessionResult(body.resultCode, body.resultDesc, body.token, sessionID));
                                });
                                
                                
                            }
    
                        });
}