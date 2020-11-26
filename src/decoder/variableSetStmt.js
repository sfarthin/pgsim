"use strict";
exports.__esModule = true;
exports.variableSetStmtDecoder = void 0;
var decoders_1 = require("decoders");
var constant_1 = require("./constant");
var tuple1_1 = require("./tuple1");
exports.variableSetStmtDecoder = decoders_1.exact({
    kind: decoders_1.number,
    name: decoders_1.string,
    args: decoders_1.optional(tuple1_1.tuple1(decoders_1.exact({ A_Const: constant_1.aConstDecoder }))),
    is_local: decoders_1.optional(decoders_1.boolean)
});
