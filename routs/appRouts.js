'user strict'

module.exports = function (app) {
    var appController = require('../controller/appController.js'),
        authController = require('../auth/auth_controller');

    app.route('/getJsonObj')
        .get(authController.verify_token, appController.get_json_obj)
}