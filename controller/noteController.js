'use strict';

var mongoose = require('mongoose'),
    Note = mongoose.model('Message'),
    UserSession = mongoose.model('UserSessionModel'),
    constants = require('../objs/constants'),
    aws_sns = require('./aws_sns'),
    BaseResult = require('../objs/BaseResult');
var userID;

exports.validSession = function(req, res, next){

    UserSession.findOne({ sessionID: req.query.sessionid }, function (err, session) {
        if (err || session == null) {
            console.log("validateSession unknow error 1")
            return res.json(constants.RESULT_TIMEOUT);
        }
        if (Math.abs(new Date() - session.timeStamp) / 86400000 <= 2) {
            UserSession.findOneAndUpdate({ sessionID: req.query.sessionid }, { timeStamp: new Date() }, { new: true }, function (err, sesion) {
                if (err) {
                    console.log("validateSession unknow error 2")
                    return res.json(constants.RESULT_TIMEOUT);
                }
                userID = sesion.userID;
                console.log("the userID at the validsession is: " + userID); 
                next();
            });
            
        } else {
            UserSession.remove({
                sessionID: req.query.sessionid
            }, function (err, session) {
                if (err) {
                    console.log("validateSession unknow error 3")
                    return res.json(constants.RESULT_TIMEOUT);
                }
            });
            return res.json(constants.RESULT_TIMEOUT);
        }      
    });
}

var list_notes_by_date = function (req, res) {
    Note.find({ created: req.query.date, userID: userID }, function (err, note) {
        if (err) {
            console.log("list_notes_by_date unknow error 1")
            return res.json(constants.RESULT_UNKNOWN);
        } 
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_toWhom = function (req, res) {
    Note.find({ toWhom: req.query.to, userID: userID }, function (err, note) {
        if (err) {
            console.log("list_notes_by_toWhom unknow error 1")
            return res.json(constants.RESULT_UNKNOWN);
        }
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_fromWhom = function (req, res) {
    Note.find({fromWhom: req.query.from, userID: userID}, function (err, note) {
        if (err) {
            console.log("list_notes_by_fromWhom unknow error 1")
            return res.json(constants.RESULT_UNKNOWN);
        }
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_fromTo = function (req, res) {
    Note.find({fromWhom: req.query.from, toWhom: req.query.to, userID: userID}, function (err, note) {
        if (err) {
            console.log("list_notes_by_fromTo unknow error 1")
            return res.json(constants.RESULT_UNKNOWN);
        }
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_fromDate = function (req, res) {
    Note.find({fromWhom: req.query.from, created: req.query.date, userID: userID}, function (err, note) {
        if (err) {
            console.log("list_notes_by_fromDate unknow error 1")
            return res.json(constants.RESULT_UNKNOWN);
        }
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_toDate = function (req, res) {
    Note.find({ toWhom: req.query.to, created: req.query.date, userID: userID}, function (err, note) {
        if (err) {
            console.log("list_notes_by_toDate unknow error 1")
            return res.json(constants.RESULT_UNKNOWN);
        }
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

var list_notes_by_fromToDate = function (req, res) {
    Note.find({fromWhom: req.query.from, toWhom: req.query.to, created: req.query.date, userID: userID}, function (err, note) {
        if (err) {
            console.log("list_notes_by_fromToDate unknow error 1")
            return res.json(constants.RESULT_UNKNOWN);
        }
        if (note == null) return res.json(constants.RESULT_NULL);
        return res.json(new BaseResult(0, note));
    });
};

exports.list_notes_by_search = function (req, res) {
    var from = req.query.from;
    var to = req.query.to;
    var date = req.query.date;

    if (from == "All") {
        from = "";
    }

    if (to == "All") {
        to = "";
    }
    
    if (date == "Today") {
        date = Date().toString();
        console.log("today's date is: " + date);
    }
    if (from && !to && !date) {
        list_notes_by_fromWhom(req, res);
    } else if (!from && to && !date) {
        list_notes_by_toWhom(req, res);
    } else if (!from && !to && date) {
        list_notes_by_date(req, res);
    } else if (from && to && !date) {
        list_notes_by_fromTo(req, res);
    } else if (from && !to && date) {
        console.log("from date");
        list_notes_by_fromDate(req, res);
    } else if (!from && to && date) {
        console.log("to date");
        list_notes_by_toDate(req, res);
    } else if (from && to && date) {
        console.log("from date to")
        list_notes_by_fromToDate(req, res);
    }
   
};

exports.create_a_note = function (req, res) {
    var new_note = new Note(req.body);
    new_note.save(function (err, note) {
        if (err) {
            console.log("save error save error vvvvvvvvv");
            return res.json(constants.RESULT_UNKNOWN);
        }
        console.log("the deviceid is: " + req.query.deviceid);
        aws_sns.sendNotification(note.noteBody, req.query.deviceid, userID);
        if (note == null) return res.json(constants.RESULT_NULL);
        console.log("now the note has been saved");
        return res.json(constants.RESULT_SUCCESS);
    });
};

exports.read_notes_by_keywords = function (req, res) {
    var keyword = req.params.keywords;
    //var regex = RegExp(".*" + keyword + ".*");
    var regex = new RegExp(keyword, "i")
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