"use strict";
exports.__esModule = true;
exports.aliasDecoder = void 0;
var decoders_1 = require("decoders");
var constant_1 = require("./constant");
exports.aliasDecoder = decoders_1.exact({
    aliasname: decoders_1.string,
    colnames: decoders_1.optional(decoders_1.array(constant_1.stringDecoder))
});
