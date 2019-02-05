'use strict';

var mongoose = require('mongoose'),
    Note = mongoose.model('Note'),
    constants = require('../objs/constants'),
    BaseResult = require('../objs/BaseResult');

exports.list_notes_by_date = function (req, res) {
    console.log("the date is: " + req.params.date);
    Note.findOne({ created: req.params.date }, function (err, note) {
        if (err) return res.send(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NOTE_NULL);
        return res.json(new BaseResult(97, note));
    });
};

exports.list_notes_by_toWhom = function (req, res) {
    Note.findOne({ toWhom: req.params.toWhom }, function (err, note) {
        if (err) return res.send(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NOTE_NULL);
        return res.json(new BaseResult(97, note));
    });
};

exports.list_notes_by_fromWhom = function (req, res) {
    Note.findOne({fromWhom: req.params.fromWhom}, function (err, note) {
        if (err) return res.send(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NOTE_NULL);
        return res.json(new BaseResult(97, note));
    });
};

exports.create_a_note = function (req, res) {

    var new_note = new Note(req.body);
    console.log('RESTful API server started on: ' + req.body);
    new_note.save(function (err, note) {
        if (err) return res.send(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NOTE_NULL);
        return res.json(new BaseResult(97, note));
    });
};

exports.read_notes_by_keywords = function (req, res) {
    Task.find({ "noteBody": /Alex/i }, function (err, note) {
        if (err) return res.send(constants.RESULT_UNKNOWN);
        if (note == null) return res.json(constants.RESULT_NOTE_NULL);
        return res.json(new BaseResult(97, note));
    });
};