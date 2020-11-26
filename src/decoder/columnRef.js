"use strict";
exports.__esModule = true;
exports.columnRefDecoder = void 0;
var decoders_1 = require("decoders");
var tuple1_1 = require("./tuple1");
var constant_1 = require("./constant");
exports.columnRefDecoder = decoders_1.exact({
    fields: decoders_1.either4(tuple1_1.tuple1(constant_1.starDecoder), tuple1_1.tuple1(constant_1.stringDecoder), decoders_1.tuple2(constant_1.stringDecoder, constant_1.stringDecoder), decoders_1.tuple2(constant_1.stringDecoder, constant_1.starDecoder)),
    location: decoders_1.number
});
