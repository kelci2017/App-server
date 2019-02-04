'use strict';

exports.get_json_obj = function (req, res) {
    var jsonObj = require('../json_objs/jsonObj');
    res.json(jsonObj);
};