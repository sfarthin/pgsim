"use strict";
exports.__esModule = true;
exports.aExprDecoder = void 0;
var decoders_1 = require("decoders");
var constant_1 = require("./constant");
exports.aExprDecoder = decoders_1.exact({
    kind: decoders_1.number,
    name: decoders_1.array(constant_1.stringDecoder),
    lexpr: decoders_1.unknown,
    rexpr: decoders_1.unknown,
    location: decoders_1.number
});
