"use strict";
class BaseResult {
    constructor(resultCode, resultDesc) {
        this.resultCode = resultCode;
        this.resultDesc = resultDesc;
    }
    getResultCode() {
        return this.resultCode;
    }
    setResultCode(resultCode) {
        this.resultCode = resultCode;
    }
    getResultDesc() {
        return this.resultDesc;
    }
    setResultDesc() {
        this.resultDesc = this.resultDesc;
    }
}
module.exports = BaseResult;