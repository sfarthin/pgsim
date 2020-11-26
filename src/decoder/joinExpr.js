"use strict";
exports.__esModule = true;
exports.joinExprDecoder = void 0;
var decoders_1 = require("decoders");
exports.joinExprDecoder = decoders_1.exact({
    jointype: decoders_1.number,
    larg: decoders_1.unknown,
    rarg: decoders_1.unknown,
    quals: decoders_1.unknown,
    isNatural: decoders_1.unknown,
    usingClause: decoders_1.unknown,
    alias: decoders_1.unknown
});
