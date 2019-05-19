'user strict'

exports.getPhotolist = function(req, res) {
    var photolist = require('./photolist.json'),
    constants = require('../objs/constants');
    // return res.json(constants.RESULT_UNKNOWN);
   return res.json(photolist);
}

exports.getPhotoDetail = function(req, res) {
    var Photodetail = require('../objs/PhotoDetail');
    var likes = Math.floor((Math.random() * 10000) + 1);
    var filter = Math.floor((Math.random() * 10000) + 1);
    var names = Array("Kelci","Arwin","Emma","Johny","Alisa", "Helen");
    var places = Array("Regina","Saskatoon","Calgary","Tulsa","Dubai", "Beijing");
    var dates = Array("2014-10-02","2015-01-05","2016-11-12","2017-12-02","2018-04-22", "2013-05-13");
    var photographer = names[Math.floor(Math.random()*names.length)];
    var location = places[Math.floor(Math.random()*places.length)];
    var date = dates[Math.floor(Math.random()*dates.length)];
    var photodetail = new Photodetail(photographer, location,likes, filter, date),
        BaseResult = require('../objs/BaseResult');
   return res.json(new BaseResult(0, photodetail));
}