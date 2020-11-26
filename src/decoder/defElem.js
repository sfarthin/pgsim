"use strict";
exports.__esModule = true;
exports.defElemDecoder = void 0;
var decoders_1 = require("decoders");
exports.defElemDecoder = decoders_1.either(decoders_1.exact({
    defname: decoders_1.either6(decoders_1.constant("start"), decoders_1.constant("increment"), decoders_1.constant("maxvalue"), decoders_1.constant("cache"), decoders_1.constant("minvalue"), decoders_1.constant("cycle")),
    arg: decoders_1.optional(decoders_1.exact({ Integer: decoders_1.exact({ ival: decoders_1.number }) })),
    defaction: decoders_1.number,
    location: decoders_1.number
}), decoders_1.exact({
    defname: decoders_1.constant("owned_by"),
    arg: decoders_1.array(decoders_1.exact({ String: decoders_1.exact({ str: decoders_1.string }) })),
    defaction: decoders_1.number,
    location: decoders_1.number
}));
