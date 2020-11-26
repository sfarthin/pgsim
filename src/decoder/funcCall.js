"use strict";
exports.__esModule = true;
exports.funcCallDecoder = void 0;
var decoders_1 = require("decoders");
var constant_1 = require("./constant");
exports.funcCallDecoder = decoders_1.either3(decoders_1.exact({
    funcname: decoders_1.array(constant_1.stringDecoder),
    args: decoders_1.array(decoders_1.mixed),
    func_variadic: decoders_1.optional(decoders_1.boolean),
    agg_distinct: decoders_1.optional(decoders_1.boolean),
    over: decoders_1.optional(decoders_1.mixed),
    location: decoders_1.number
}), decoders_1.exact({
    funcname: decoders_1.array(constant_1.stringDecoder),
    agg_star: decoders_1.constant(true),
    func_variadic: decoders_1.optional(decoders_1.boolean),
    agg_distinct: decoders_1.optional(decoders_1.boolean),
    location: decoders_1.number
}), decoders_1.exact({
    funcname: decoders_1.array(constant_1.stringDecoder),
    location: decoders_1.number
}));
