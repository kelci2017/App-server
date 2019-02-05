'user strict'

var mongose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require("bcrypt"),
    User = mongose.model('User');
    auth_config = require('../auth/auth_config'),
    authController = require('../auth/auth_controller');



exports.register = function (req, res) {
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function (err, user) {
        if (err) return res.send(constants.RESULT_UNKNOWN);
        if (user == null) return res.json(constants.RESULT_NOTE_NULL);
        return res.json(new BaseResult(97, user));
    });
};

exports.sign_in = function (req, res) {
    User.findOne({
        userName: req.body.userName,
        email: req.body.email
    }, function (err, user) {
        if (user) console.log("user name found is: " + user.userName);
        if (err) throw err;
        if (!user) {
            return res.json(constants.RESULT_USER_NOTFOUND);
        } else if (user) {
            if(bcrypt.compareSync(req.body.password, user.hash_password)) {
                console.log("logged in here");           
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
                            if (error) return error;
                            if (!body) return res.status(401).send();
                            if (body.resultCode != 0) {
                                console.log('body resultCode is: ', body.resultCode );
                                return res.send(body);
                            }
                            if (body.resultCode == 0) {
                                return res.send(body);
                                console.log('body resultDesc is: ', body.resultDesc);
                            }
    
                        });
               } else {
                return res.json(constants.RESULT_WRONG_PASSWORD);
                console.log('Comparison error: ', err);
               }
                        }
                    });
};

exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' })
    }
};