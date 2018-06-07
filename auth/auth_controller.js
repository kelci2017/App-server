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
        if (error) return error;

        if (body.resultCode != 6) {
            console.log('body resultCode is: ', body.resultCode);
            return res.send(body);
        }
        if (body.resultCode == 6) {
            console.log('body resultDesc is: ', body.resultDesc);
            next();
        }
    });
};

