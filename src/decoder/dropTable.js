"use strict";
exports.__esModule = true;
exports.dropStmtDecoder = void 0;
var tuple1_1 = require("./tuple1");
var decoders_1 = require("decoders");
var constant_1 = require("./constant");
exports.dropStmtDecoder = decoders_1.exact({
    objects: tuple1_1.tuple1(tuple1_1.tuple1(constant_1.stringDecoder)),
    removeType: decoders_1.number,
    behavior: decoders_1.number
});
