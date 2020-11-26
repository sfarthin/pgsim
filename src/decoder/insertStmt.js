"use strict";
exports.__esModule = true;
exports.insertStmtDecoder = exports.resTargetInsertDecoder = void 0;
var decoders_1 = require("decoders");
var rangeVar_1 = require("./rangeVar");
exports.resTargetInsertDecoder = decoders_1.exact({
    name: decoders_1.optional(decoders_1.string),
    location: decoders_1.number,
    indirection: decoders_1.unknown
});
exports.insertStmtDecoder = decoders_1.exact({
    relation: decoders_1.exact({ RangeVar: rangeVar_1.rangeVarDecoder }),
    cols: decoders_1.optional(decoders_1.array(decoders_1.exact({ ResTarget: exports.resTargetInsertDecoder }))),
    selectStmt: decoders_1.optional(decoders_1.exact({ SelectStmt: decoders_1.unknown })),
    returningList: decoders_1.unknown,
    override: decoders_1.unknown,
    onConflictClause: decoders_1.unknown
});
