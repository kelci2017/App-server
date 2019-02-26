'user strict'

module.exports = function (app) {
    var noteController = require('../controller/noteController.js'),
        userController = require('../controller/userController.js'),
        authController = require('../auth/auth_controller');

    app.route('/notes/search/')
        .get(authController.verify_token, noteController.validSession, noteController.list_notes_by_search);

    app.route('/notes/globalSearch/:keywords')
        .get(authController.verify_token, noteController.validSession, noteController.read_notes_by_keywords);

   app.route('/notes/create')
        .post(authController.verify_token, noteController.validSession, noteController.create_a_note);

   app.route('/auth/sign_in')
        .post(userController.sign_in);

   app.route('/auth/sessionCheck')
        .get(noteController.validSession, userController.sessionCheck);

   app.route('/auth/sign_out')
        .get(authController.verify_token, noteController.validSession, userController.sign_out);
   
   app.route('/auth/register')
        .post(userController.register);

   app.route('/auth/deregister/:userName')
        .delete(userController.deregister);

   app.route('/auth/getToken')
        .get(authController.getToken);

   app.route('/auth/getPassword')
        .post(userController.send_password);
    
}