'use strict';

exports.verify_token = function (req, res, next) {
    var request = require('request'),
        token = req.headers['authorization'];
        

    request({
        url: "http://localhost:8080/auth/verifyToken",
        method: "GET",
        headers: {
            "authorization": token,
        },
        json: true
    }, function (error, response, body) {
        if (error) return res.json(constants.RESULT_UNKNOWN);
        if (!body) return res.status(401).send();
        if (body.resultCode != 0) {
            console.log('body resultCode is: ', body.resultCode);
            return res.send(body);
        }
        if (body.resultCode == 0) {
            console.log('body resultDesc is: ', body.resultDesc);
            next();
        }

    });
};

exports.getToken = function(req, res) {
    var UserSession = mongoose.model('UserSessionModel'),
        User = mongose.model('User'),
        TokenResult = require('../objs/TokenResult'),
        auth_config = require('./auth_config');
        
    var request = require('request');
    UserSession.findOne({ sessionID: req.query.sessionid }, function (err, session) {
        console.log("the sessionid is at the validate session: " + session.sessionID)
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (session == null) {
            console.log("session is null at the validate session");
            return res.json(constants.RESULT_NULL);
        } 
        User.findOne({
            userID: sesion.userID
        }, function (err, user) {
            if (err) return res.json(constants.RESULT_UNKNOWN);
            if (user) {
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
                        return res.json(new TokenResult(body.resultCode, body.resultDesc, body.token));
                    }
    
                });
            }
        });     
    });   
                        
}