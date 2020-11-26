"use strict";
exports.__esModule = true;
exports.nullTestDecoder = void 0;
var decoders_1 = require("decoders");
exports.nullTestDecoder = decoders_1.exact({
    arg: decoders_1.unknown,
    nulltesttype: decoders_1.number,
    location: decoders_1.number
});
