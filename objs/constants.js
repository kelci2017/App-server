var BaseResult = require('./BaseResult');

function constants() { }

constants.prototype.RESULT_UNKNOWN = new BaseResult(1, "unknown error");
constants.prototype.RESULT_NETWORK = new BaseResult(2, "network error");
constants.prototype.RESULT_SUCCESS = new BaseResult(0, "success");
constants.prototype.RESULT_NOTE_NULL = new BaseResult(100, "null");
constants.prototype.RESULT_WRONG_PASSWORD = new BaseResult(12, "wrong password");
constants.prototype.RESULT_USER_NOTFOUND = new BaseResult(13, 'user not found');
constants.prototype.RESULT_REQUEST_KEY_INVALID = new BaseResult(14, 'Request key invalid');
constants.prototype.RESULT_SCHEME_NOTCORRECT = new BaseResult(15, 'token sheme not correct');
constants.prototype.RESULT_APPLICATION_NOTFOUND = new BaseResult(16, 'application not found');
constants.prototype.RESULT_EMAIL_NOTFOUND = new BaseResult(16, 'email not found');

module.exports = constants.prototype;