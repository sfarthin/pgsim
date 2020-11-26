"use strict";
exports.__esModule = true;
exports.boolExprDecoder = exports.BoolOp = void 0;
var decoders_1 = require("decoders");
var BoolOp;
(function (BoolOp) {
    BoolOp[BoolOp["AND"] = 0] = "AND";
    BoolOp[BoolOp["OR"] = 1] = "OR";
    BoolOp[BoolOp["NOT"] = 2] = "NOT";
})(BoolOp = exports.BoolOp || (exports.BoolOp = {}));
exports.boolExprDecoder = decoders_1.exact({
    boolop: decoders_1.number,
    args: decoders_1.unknown,
    location: decoders_1.number
});
