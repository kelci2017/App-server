'use strict';

var mongoose = require('mongoose'),
    Note = mongoose.model('Note'),
    UserSession = mongoose.model('UserSession'),
    constants = require('../objs/constants'),
    BaseResult = require('../objs/BaseResult');
var userID;

var validSession = function(req, res){

    UserSession.findOne({ sessionID: req.query.sessionid }, function (err, session) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (session == null) {
            console.log("nnnnnnnnnnnnnnnn");
            return res.json(constants.RESULT_NULL);
        }
        if (Math.abs(new Date() - session.timeStamp) / 86400000 <= 2) {
            userID = session.userID;
            UserSession.findOneAndUpdate({ sessionID: req.query.sessionid }, { timeStamp: new Date() }, { new: true }, function (err, sesion) {
                if (err) return res.json(constants.RESULT_UNKNOWN);
            });
            
        } else {
            UserSession.remove({
                sessionID: req.query.sessionid
            }, function (err, session) {
                if (err) return res.json(constants.RESULT_UNKNOWN);
            });
            return res.json(constants.RESULT_TIMEOUT);
        }      
    });
}

exports.list_notes_by_date = function (req, res) {
    console.log("the date is: " + req.params.date);
    validSession(req,res);
    Note.find({ created: req.params.date }, function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(97, note));
    });
};

exports.list_notes_by_toWhom = function (req, res) {
    validSession(req,res);
    Note.find({ toWhom: req.params.toWhom }, function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(97, note));
    });
};

exports.list_notes_by_fromWhom = function (req, res) {
    validSession(req,res);
    Note.find({fromWhom: req.params.fromWhom}, function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(97, note));
    });
};

exports.create_a_note = function (req, res) {
    validSession(req,res);
    var new_note = new Note(req.body);
    console.log('RESTful API server started on: ' + req.body);
    new_note.save(function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(97, note));
    });
};

exports.read_notes_by_keywords = function (req, res) {
    validSession(req,res);
    Note.find({ noteBody: req.params.keywords, userID: userID }, function (err, note) {
        if (err) return res.send(constants.RESULT_UNKNOWN);
        if (note == null) {
            console.log("aaaaaaaaaaaaaa");
            return res.json(constants.RESULT_NULL);
        }
        return res.json(new BaseResult(97, note));
    });
};

