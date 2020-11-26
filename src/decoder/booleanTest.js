"use strict";
exports.__esModule = true;
exports.booleanTestDecoder = void 0;
var decoders_1 = require("decoders");
exports.booleanTestDecoder = decoders_1.exact({
    arg: decoders_1.unknown,
    booltesttype: decoders_1.number,
    location: decoders_1.number
});
