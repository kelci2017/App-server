'use strict';

exports.verify_token = function (req, res, next) {
    var request = require('request'),
        token = req.headers['authorization'];

    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');

    request({
        url: "http://localhost:8080/auth/verifyToken",
        method: "GET",
        headers: {
            "authorization": token,
        },
        json: true
    }, function (error, response, body) {
        if (error) return error;
        if (!body) return res.status(401).send();
        if (body.resultCode != 0) {
            console.log('body resultCode is: ', body.resultCode + ' ' + new Date(dt.now()));
            return res.send(body);
        }
        if (body.resultCode == 0) {
            console.log('body resultDesc is: ', body.resultDesc + ' ' + new Date(dt.now()));
            next();
        }

    });
};