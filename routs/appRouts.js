'user strict'

module.exports = function (app) {
    var noteController = require('../controller/noteController.js'),
        userController = require('../controller/userController.js'),
        authController = require('../auth/auth_controller');

    app.route('/notes/to/:toWhom')
        .get(noteController.list_notes_by_toWhom);

    app.route('/notes/from/:fromWhom')
        .get(noteController.list_notes_by_fromWhom);

    app.route('/notes/search/:keywords')
        .get(noteController.read_notes_by_keywords);

    app.route('/notes/date/:date')
        .get(noteController.list_notes_by_date);

   app.route('/notes/create')
        .post(noteController.create_a_note);

   app.route('/auth/sign_in')
        .post(userController.sign_in);

   app.route('/auth/sign_out')
        .post(userController.sign_out);
   
   app.route('/auth/register')
        .post(userController.register);

   app.route('/auth/deregister/:userName')
        .delete(userController.deregister);
    

}