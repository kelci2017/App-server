'use strict';

var mongoose = require('mongoose'),
    Task = mongoose.model('Tasks');



exports.list_all_tasks = function (req, res) {
    Task.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.create_a_task = function (req, res) {

    var new_task = new Task(req.body);
    console.log('todo list RESTful API server started on: ' + req.body);
    new_task.save(function (err, task) {
        if (err) return res.status(404).send();
        if (!task) return res.status(97).json({ message: 'task in DB is null' });
        res.json(task);
    });
};

exports.read_a_task = function (req, res) {
    Task.findById(req.params.taskId, function (err, task) {
        if (err) return res.send(err);
        res.json(task);
    });
};

exports.update_a_task = function (req, res) {
    Task.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};
// Task.remove({}).exec(function(){});
exports.delete_a_task = function (req, res) {

    Task.remove({
        _id: req.params.taskId
    }, function (err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Task successfully deleted' });
    });
};

exports.get_a_task = function (req, res) {

    Task.findById(req.params.taskId, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });

};