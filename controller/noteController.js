'use strict';

var mongoose = require('mongoose'),
    Note = mongoose.model('Message'),
    UserSession = mongoose.model('UserSessionModel'),
    constants = require('../objs/constants'),
    BaseResult = require('../objs/BaseResult');
var userID;

exports.validSession = function(req, res, next){

    UserSession.findOne({ sessionID: req.query.sessionid }, function (err, session) {
        console.log("the sessionid is at the validate session: " + req.query.sessionid)
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (session == null) {
            console.log("session is null at the validate session");
            return res.json(constants.RESULT_NULL);
        }
        if (Math.abs(new Date() - session.timeStamp) / 86400000 <= 2) {
            UserSession.findOneAndUpdate({ sessionID: req.query.sessionid }, { timeStamp: new Date() }, { new: true }, function (err, sesion) {
                if (err) return res.json(constants.RESULT_UNKNOWN);
                userID = sesion.userID;
                console.log("the userID at the validsession is: " + userID); 
                next();
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

var list_notes_by_date = function (req, res) {
    Note.find({ created: req.query.date, userID: userID }, function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_toWhom = function (req, res) {
    Note.find({ toWhom: req.query.to, userID: userID }, function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_fromWhom = function (req, res) {
    Note.find({fromWhom: req.query.from, userID: userID}, function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_fromTo = function (req, res) {
    Note.find({fromWhom: req.query.from, toWhom: req.query.to, userID: userID}, function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_fromDate = function (req, res) {
    Note.find({fromWhom: req.query.from, created: req.query.date, userID: userID}, function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_toDate = function (req, res) {
    Note.find({ toWhom: req.query.to, created: req.query.date, userID: userID}, function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_fromToDate = function (req, res) {
    Note.find({fromWhom: req.query.from, toWhom: req.query.to, created: req.query.date, userID: userID}, function (err, note) {
        if (err) return res.json(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

exports.list_notes_by_search = function (req, res) {
    
    if (req.query.from && !req.query.to && !req.query.date) {
        list_notes_by_fromWhom(req, res);
    } else if (!req.query.from && req.query.to && !req.query.date) {
        list_notes_by_toWhom(req, res);
    } else if (!req.query.from && !req.query.to && req.query.date) {
        list_notes_by_date(req, res);
    } else if (req.query.from && req.query.to && !req.query.date) {
        list_notes_by_fromTo(req, res);
    } else if (req.query.from && !req.query.to && req.query.date) {
        console.log("from date");
        list_notes_by_fromDate(req, res);
    } else if (!req.query.from && req.query.to && req.query.date) {
        console.log("to date");
        list_notes_by_toDate(req, res);
    } else if (req.query.from && req.query.to && req.query.date) {
        console.log("from date to")
        list_notes_by_fromToDate(req, res);
    }
   
};

exports.create_a_note = function (req, res) {
    var new_note = new Note(req.body);
    new_note.save(function (err, note) {
        if (err) {
            console.log("save error save error");
            return res.json(constants.RESULT_UNKNOWN);
        }
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

exports.read_notes_by_keywords = function (req, res) {
    var keyword = req.params.keywords;
    var regex = RegExp(".*" + keyword + ".*");
    Note.find({noteBody: regex, userID: userID}, function (err, note) {
        console.log("the userid is: " + userID);
        if (err) {
            return res.send(constants.RESULT_UNKNOWN);
        }
        if (note == null) {
            return res.json(constants.RESULT_NULL);
        }
        return res.json(new BaseResult(0, note));
    });
   
};

