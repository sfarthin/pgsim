"use strict";
exports.__esModule = true;
exports.verifySelectStatement = exports.selectStmtDecoder = exports.verifyResTarget = exports.resTargetDecoder = void 0;
var decoders_1 = require("decoders");
var targetValue_1 = require("./targetValue");
exports.resTargetDecoder = decoders_1.exact({
    name: decoders_1.optional(decoders_1.string),
    val: targetValue_1.targetValueDecoder,
    location: decoders_1.number
});
exports.verifyResTarget = decoders_1.guard(exports.resTargetDecoder);
exports.selectStmtDecoder = decoders_1.either3(decoders_1.exact({
    targetList: decoders_1.array(decoders_1.exact({ ResTarget: decoders_1.unknown })),
    fromClause: decoders_1.optional(decoders_1.array(decoders_1.unknown)),
    whereClause: decoders_1.unknown,
    groupClause: decoders_1.unknown,
    intoClause: decoders_1.unknown,
    withClause: decoders_1.unknown,
    limitOffset: decoders_1.unknown,
    limitCount: decoders_1.unknown,
    havingClause: decoders_1.unknown,
    distinctClause: decoders_1.unknown,
    lockingClause: decoders_1.unknown,
    sortClause: decoders_1.unknown,
    op: decoders_1.number
}), decoders_1.exact({
    valuesLists: decoders_1.unknown,
    fromClause: decoders_1.optional(decoders_1.array(decoders_1.unknown)),
    whereClause: decoders_1.unknown,
    sortClause: decoders_1.unknown,
    op: decoders_1.number
}), decoders_1.exact({
    op: decoders_1.number,
    larg: decoders_1.unknown,
    rarg: decoders_1.unknown,
    all: decoders_1.unknown,
    sortClause: decoders_1.unknown,
    lockingClause: decoders_1.unknown,
    limitCount: decoders_1.unknown
}));
exports.verifySelectStatement = decoders_1.guard(decoders_1.exact({ SelectStmt: exports.selectStmtDecoder }));
