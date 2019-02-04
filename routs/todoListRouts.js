'user strict'

module.exports = function (app) {
    var todoList = require('../controller/todoListController.js'),
        userHandlers = require('../controller/userController.js'),
        authController = require('../auth/auth_controller');

    app.route('/tasks')
        .get(todoList.list_all_tasks)
        .post(authController.verify_token, todoList.create_a_task);

    app.route('/tasks/:taskId')
        .get(authController.verify_token, todoList.read_a_task)
        .put(todoList.update_a_task)
        .delete(todoList.delete_a_task);

    app.route('/auth/register')
        .post(userHandlers.register);

    app.route('/auth/sign_in')
        .post(userHandlers.sign_in);

    app.route('/configlist/getConfiglist')
        .get(authController.getConfiglist);

    app.route('/configlist/getWsConfiglist')
        .get(authController.getWsconfiglist);

    app.route('/lotlist')
        .get(authController.getLotlist);

    app.route('/gethtml')
        .get(authController.getHtml);

    app.route('/getRegionConfig')
        .get(authController.getRegionConfig);
    
    app.route('/getAnnouncement')
        .get(authController.getAnnouncement);

}