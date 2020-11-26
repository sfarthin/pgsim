"use strict";
exports.__esModule = true;
exports.typeCastDecoder = exports.typeNameDecoder = void 0;
var decoders_1 = require("decoders");
var constant_1 = require("./constant");
var tuple1_1 = require("./tuple1");
exports.typeNameDecoder = decoders_1.exact({
    names: decoders_1.array(constant_1.stringDecoder),
    typemod: decoders_1.number,
    typmods: decoders_1.optional(decoders_1.either(tuple1_1.tuple1(decoders_1.exact({ A_Const: constant_1.aConstDecoder })), tuple1_1.tuple2(decoders_1.exact({ A_Const: constant_1.aConstDecoder })))),
    location: decoders_1.number,
    arrayBounds: decoders_1.unknown
});
exports.typeCastDecoder = decoders_1.exact({
    arg: decoders_1.unknown,
    typeName: decoders_1.exact({ TypeName: exports.typeNameDecoder }),
    location: decoders_1.number
});
