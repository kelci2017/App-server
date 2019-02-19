"use strict";
var BaseResult = require('./BaseResult');
class TokenSessionResult extends BaseResult {
    constructor(resultCode, resultDesc, userID, token, sessionID) {
        super(resultCode, resultDesc);
        this.token = token;
        this.sessionID = sessionID;
        this.userID = userID;
    }
    getToken() {
        return this.token;
    }
    setToken(token) {
        this.token = token;
    }
    getUserID() {
        return this.userID;
    }
    setUserID(userID) {
        this.userID = userID;
    }

    getSessionID() {
        return this.sessionID;
    }
    setSessionID(sessionID) {
        this.sessionID = sessionID;
    }
}
module.exports = TokenSessionResult;