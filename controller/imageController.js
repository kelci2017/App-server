'user strict'

exports.getPhotolist = function(req, res) {
    var photolist = require('./photolist.json'),
    constants = require('../objs/constants');
    // return res.json(constants.RESULT_UNKNOWN);
   return res.json(photolist);
}

exports.getPhotoDetail = function(res, req) {

}