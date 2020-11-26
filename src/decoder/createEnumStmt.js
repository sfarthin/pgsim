"use strict";
exports.__esModule = true;
exports.createEnumStmtDecoder = void 0;
var decoders_1 = require("decoders");
var constant_1 = require("./constant");
var tuple1_1 = require("./tuple1");
exports.createEnumStmtDecoder = decoders_1.exact({
    typeName: decoders_1.either(tuple1_1.tuple1(decoders_1.exact({ String: constant_1.stringValueDecoder })), tuple1_1.tuple2(decoders_1.exact({ String: constant_1.stringValueDecoder }))),
    vals: decoders_1.array(decoders_1.exact({ String: constant_1.stringValueDecoder }))
});
