"use strict";
exports.__esModule = true;
exports.createSeqStmtDecoder = void 0;
var decoders_1 = require("decoders");
var rangeVar_1 = require("./rangeVar");
var defElem_1 = require("./defElem");
exports.createSeqStmtDecoder = decoders_1.exact({
    sequence: decoders_1.exact({ RangeVar: rangeVar_1.rangeVarDecoder }),
    options: decoders_1.optional(decoders_1.array(decoders_1.exact({ DefElem: defElem_1.defElemDecoder })))
});
