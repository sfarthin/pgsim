"use strict";
exports.__esModule = true;
exports.starDecoder = exports.stringDecoder = exports.aConstDecoder = exports.constantDecoder = exports.valueDecoder = exports.integerValueDecoder = exports.floatValueDecoder = exports.stringValueDecoder = void 0;
var decoders_1 = require("decoders");
exports.stringValueDecoder = decoders_1.exact({ str: decoders_1.string });
exports.floatValueDecoder = decoders_1.exact({ str: decoders_1.string });
exports.integerValueDecoder = decoders_1.exact({
    ival: decoders_1.number
});
exports.valueDecoder = decoders_1.either3(exports.stringValueDecoder, exports.floatValueDecoder, exports.integerValueDecoder);
exports.constantDecoder = decoders_1.exact({
    val: decoders_1.either3(exports.stringValueDecoder, exports.floatValueDecoder, exports.integerValueDecoder)
});
exports.aConstDecoder = decoders_1.exact({
    val: decoders_1.either4(decoders_1.exact({ Float: exports.floatValueDecoder }), decoders_1.exact({ String: exports.stringValueDecoder }), decoders_1.exact({ Integer: exports.integerValueDecoder }), decoders_1.exact({ Null: decoders_1.exact({}) })),
    location: decoders_1.number
});
exports.stringDecoder = decoders_1.exact({
    String: exports.stringValueDecoder
});
exports.starDecoder = decoders_1.exact({ A_Star: decoders_1.unknown });
