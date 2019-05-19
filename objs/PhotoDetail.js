"use strict";
class PhotoDetail {
    constructor(photographer, location, likes, filter, date) {
        this.photographer = photographer;
        this.location = location;
        this.likes = likes;
        this.filter = filter;
        this.date = date;
    }
    getPhotographer() {
        return this.photographer;
    }
    setPhotographer(photographer) {
        this.photographer = photographer;
    }
}
module.exports = PhotoDetail;