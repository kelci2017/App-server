var BaseResult = require('./BaseResult');

function constants() { }

constants.prototype.RESULT_UNKNOWN = new BaseResult(1, "unknown error");
constants.prototype.RESULT_NETWORK = new BaseResult(2, "network error");
constants.prototype.RESULT_SUCCESS = new BaseResult(0, "success");
constants.prototype.RESULT_NULL = new BaseResult(100, "null");
constants.prototype.RESULT_WRONG_PASSWORD = new BaseResult(12, "wrong password");
constants.prototype.RESULT_USER_NOTFOUND = new BaseResult(13, 'user not found');
constants.prototype.RESULT_USER_EXISTED = new BaseResult(14, 'user has registered');
constants.prototype.RESULT_ACCESS_DENIED = new BaseResult(15, 'access denied');
constants.prototype.RESULT_TIMEOUT = new BaseResult(16, 'session timeout');
constants.prototype.RESULT_EMAIL_NOTFOUND = new BaseResult(17, 'email not found');

module.exports = constants.prototype;