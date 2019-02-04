'use strict';

var mongoose = require('mongoose'),
    Configlist = mongoose.model('Configlist');
    var path    = require("path");

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

exports.getConfiglist = function (req, res, next) {
    var request = require('request')

    request({
        url: "https://dynamic-mobile-adq.tls.liveblockauctions.com/bamgateway/rest/gateway/configEX?deviceid=com.liveblockauctions_qa_233033242&orgid=US",
        method: "GET",
        json: true
    }, function (error, response, body) {
        if (error) return error;
        if (!body) return res.status(404).send();
        var configlist = new Configlist(body);
        configlist.save(function (error, configlist) {
            if (error) return res.status(404).send();
            if (!configlist) return res.status(97).json({ message: 'configlist in DB is null' });
            res.json(configlist);
        });
    });
};

exports.getWsconfiglist = function (req, res) {
    var wsconfiglist = require('../json_objs/wsconfiglist');
    res.json(wsconfiglist);
}
exports.getRegionConfig = function (req, res) {
    var regionConfig = require('../json_objs/regionConfig');
    res.json(regionConfig);
}
exports.getAnnouncement = function (req, res) {
    var transitionMessage = require('../json_objs/transitionMessage');
    res.json(transitionMessage);
}
exports.getLotlist = function (req, res) {
    var lotlist = require('../json_objs/lotlist');

    if (!req.query.sessionid || !req.query.aucid || !req.query.refresh) return res.status(400).send('miss query parameters');

    if (req.query.sessionid == 9737 & req.query.aucid == 1208733 & req.query.refresh == 0) return res.json(lotlist);

    return res.status(400).send("the record is not found");
}

exports.getHtml = function (req, res) {
    // var html = require('../html_objs/html_res');

    // res.html(html);
    // res.sendFile(html);
    res.sendFile(path.join(__dirname+'/html_objs/vdp.html'));

}