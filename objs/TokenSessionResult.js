"use strict";
var BaseResult = require('./BaseResult');
class TokenSessionResult extends BaseResult {
    constructor(resultCode, resultDesc, token, sessionID) {
        super(resultCode, resultDesc);
        this.token = token;
        this.sessionID = sessionID;
    }
    getToken() {
        return this.token;
    }
    setToken(token) {
        this.token = token;
    }

    getSessionID() {
        return this.sessionID;
    }
    setSessionID(sessionID) {
        this.sessionID = sessionID;
    }
}
module.exports = TokenSessionResult;