"use strict";
var BaseResult = require('./BaseResult');
class TokenResult extends BaseResult {
    constructor(resultCode, resultDesc, token) {
        super(resultCode, resultDesc);
        this.token = token;
    }
    getToken() {
        return this.token;
    }
    setToken(token) {
        this.token = token;
    }
}
module.exports = TokenResult;