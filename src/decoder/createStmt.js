"use strict";
exports.__esModule = true;
exports.createStmtDecoder = exports.relationDecoder = exports.verifyColumnDef = exports.columnDefDecoder = void 0;
var decoders_1 = require("decoders");
var constraint_1 = require("./constraint");
var typeCast_1 = require("./typeCast");
var rangeVar_1 = require("./rangeVar");
exports.columnDefDecoder = decoders_1.exact({
    colname: decoders_1.string,
    typeName: decoders_1.exact({ TypeName: typeCast_1.typeNameDecoder }),
    constraints: decoders_1.optional(decoders_1.array(decoders_1.exact({ Constraint: constraint_1.constraintDecoder }))),
    is_local: decoders_1.boolean,
    collClause: decoders_1.unknown,
    location: decoders_1.number
});
exports.verifyColumnDef = decoders_1.guard(exports.columnDefDecoder);
exports.relationDecoder = decoders_1.exact({
    RangeVar: rangeVar_1.rangeVarDecoder
});
exports.createStmtDecoder = decoders_1.exact({
    relation: exports.relationDecoder,
    tableElts: decoders_1.optional(decoders_1.array(decoders_1.either(decoders_1.exact({ ColumnDef: decoders_1.unknown }), decoders_1.exact({ Constraint: decoders_1.unknown })))),
    oncommit: decoders_1.number,
    inhRelations: decoders_1.unknown,
    options: decoders_1.unknown,
    if_not_exists: decoders_1.optional(decoders_1.boolean),
    partspec: decoders_1.unknown,
    partbound: decoders_1.unknown
});
