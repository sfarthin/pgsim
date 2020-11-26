"use strict";
exports.__esModule = true;
exports.verifyTargetValue = exports.targetValueDecoder = void 0;
var decoders_1 = require("decoders");
var constant_1 = require("./constant");
var typeCast_1 = require("./typeCast");
var funcCall_1 = require("./funcCall");
var columnRef_1 = require("./columnRef");
var boolExpr_1 = require("./boolExpr");
var aExpr_1 = require("./aExpr");
var booleanTest_1 = require("./booleanTest");
var nullTest_1 = require("./nullTest");
exports.targetValueDecoder = decoders_1.either9(decoders_1.exact({ ColumnRef: columnRef_1.columnRefDecoder }), decoders_1.exact({ FuncCall: funcCall_1.funcCallDecoder }), decoders_1.exact({ A_Const: constant_1.aConstDecoder }), decoders_1.exact({ TypeCast: typeCast_1.typeCastDecoder }), decoders_1.exact({ BoolExpr: boolExpr_1.boolExprDecoder }), decoders_1.exact({ A_Expr: aExpr_1.aExprDecoder }), decoders_1.exact({ BooleanTest: booleanTest_1.booleanTestDecoder }), // someting IS true
decoders_1.exact({ NullTest: nullTest_1.nullTestDecoder }), // something is NULL
decoders_1.either7(decoders_1.exact({ CaseExpr: decoders_1.unknown }), decoders_1.exact({ SubLink: decoders_1.unknown }), decoders_1.exact({ SQLValueFunction: decoders_1.unknown }), decoders_1.exact({ CoalesceExpr: decoders_1.unknown }), decoders_1.exact({ MinMaxExpr: decoders_1.unknown }), decoders_1.exact({ A_Indirection: decoders_1.unknown }), decoders_1.exact({ A_ArrayExpr: decoders_1.unknown })));
exports.verifyTargetValue = decoders_1.guard(exports.targetValueDecoder);
