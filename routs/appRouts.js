'user strict'

module.exports = function (app) {
    var noteController = require('../controller/noteController.js'),
        userController = require('../controller/userController.js'),
        authController = require('../auth/auth_controller');

    app.route('/notes/search/')
        .get(noteController.validSession, authController.verify_token, noteController.list_notes_by_search);

    app.route('/notes/globalSearch/:keywords')
        .get( noteController.validSession, authController.verify_token, noteController.read_notes_by_keywords);

   app.route('/notes/create')
        .post(noteController.validSession, authController.verify_token, noteController.create_a_note);

   app.route('/auth/sign_in')
        .post(userController.sign_in);

   app.route('/auth/sessionCheck')
        .get(noteController.validSession, userController.sessionCheck);

   app.route('/auth/sign_out')
        .get(noteController.validSession, authController.verify_token, userController.sign_out);
   
   app.route('/auth/register')
        .post(userController.register);

   app.route('/auth/deregister/:userName')
        .delete(userController.deregister);

   app.route('/auth/getToken')
        .get(authController.getToken);

   app.route('/auth/familyMembers')
        .post(noteController.validSession, authController.verify_token, userController.postFamilyMembers)
        .get(noteController.validSession, authController.verify_token, userController.getFamilyMembers);

   app.route('/notes/createWithCron')
        .post(noteController.create_a_note);

    app.route('/auth/familyMembersPost')
        .post(userController.postFamilyMembers);
     
}