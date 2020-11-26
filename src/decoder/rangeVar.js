"use strict";
exports.__esModule = true;
exports.rangeVarDecoder = void 0;
var decoders_1 = require("decoders");
var alias_1 = require("./alias");
exports.rangeVarDecoder = decoders_1.exact({
    schemaname: decoders_1.optional(decoders_1.string),
    relname: decoders_1.string,
    inhOpt: decoders_1.optional(decoders_1.number),
    relpersistence: decoders_1.string,
    location: decoders_1.number,
    inh: decoders_1.optional(decoders_1.boolean),
    alias: decoders_1.optional(decoders_1.exact({ Alias: alias_1.aliasDecoder }))
});
