"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.stmtDecoder = void 0;
var decoders_1 = require("decoders");
var createStmt_1 = require("./createStmt");
var alterTableStmt_1 = require("./alterTableStmt");
var selectStmt_1 = require("./selectStmt");
var createSeqStmt_1 = require("./createSeqStmt");
var alterSeqStmt_1 = require("./alterSeqStmt");
var insertStmt_1 = require("./insertStmt");
var variableSetStmt_1 = require("./variableSetStmt");
var createEnumStmt_1 = require("./createEnumStmt");
__exportStar(require("./aExpr"), exports);
__exportStar(require("./alias"), exports);
__exportStar(require("./alterSeqStmt"), exports);
__exportStar(require("./alterTableStmt"), exports);
__exportStar(require("./booleanTest"), exports);
__exportStar(require("./boolExpr"), exports);
__exportStar(require("./columnRef"), exports);
__exportStar(require("./constant"), exports);
__exportStar(require("./constraint"), exports);
__exportStar(require("./createEnumStmt"), exports);
__exportStar(require("./createSeqStmt"), exports);
__exportStar(require("./createStmt"), exports);
__exportStar(require("./defElem"), exports);
__exportStar(require("./dropTable"), exports);
__exportStar(require("./fromClause"), exports);
__exportStar(require("./funcCall"), exports);
__exportStar(require("./InsertStmt"), exports);
__exportStar(require("./joinExpr"), exports);
__exportStar(require("./nullTest"), exports);
__exportStar(require("./rangeVar"), exports);
__exportStar(require("./selectStmt"), exports);
__exportStar(require("./targetValue"), exports);
__exportStar(require("./tuple1"), exports);
__exportStar(require("./typeCast"), exports);
__exportStar(require("./variableSetStmt"), exports);
exports.stmtDecoder = decoders_1.inexact({
    RawStmt: decoders_1.inexact({
        stmt: decoders_1.either9(decoders_1.inexact({ CreateStmt: createStmt_1.createStmtDecoder }), decoders_1.inexact({ AlterTableStmt: alterTableStmt_1.alterTableStmtDecoder }), decoders_1.inexact({ InsertStmt: insertStmt_1.insertStmtDecoder }), decoders_1.inexact({ SelectStmt: selectStmt_1.selectStmtDecoder }), decoders_1.inexact({ CreateSeqStmt: createSeqStmt_1.createSeqStmtDecoder }), decoders_1.inexact({ VariableSetStmt: variableSetStmt_1.variableSetStmtDecoder }), decoders_1.inexact({ CreateEnumStmt: createEnumStmt_1.createEnumStmtDecoder }), decoders_1.inexact({ AlterSeqStmt: alterSeqStmt_1.alterSeqStmtDecoder }), decoders_1.either9(decoders_1.inexact({ IndexStmt: decoders_1.pojo }), decoders_1.inexact({ UpdateStmt: decoders_1.pojo }), decoders_1.inexact({ ViewStmt: decoders_1.pojo }), decoders_1.inexact({ DropStmt: decoders_1.pojo }), decoders_1.inexact({ DefineStmt: decoders_1.pojo }), decoders_1.inexact({ CreateFunctionStmt: decoders_1.pojo }), decoders_1.inexact({ CreateCastStmt: decoders_1.pojo }), decoders_1.inexact({ DeleteStmt: decoders_1.pojo }), decoders_1.either9(decoders_1.inexact({ CreateRangeStmt: decoders_1.pojo }), decoders_1.inexact({ TruncateStmt: decoders_1.pojo }), decoders_1.inexact({ ExplainStmt: decoders_1.pojo }), decoders_1.inexact({ CreateRoleStmt: decoders_1.pojo }), decoders_1.inexact({ DropRoleStmt: decoders_1.pojo }), decoders_1.inexact({ CreateTableAsStmt: decoders_1.pojo }), decoders_1.inexact({ TransactionStmt: decoders_1.pojo }), decoders_1.inexact({ VariableShowStmt: decoders_1.pojo }), decoders_1.either9(decoders_1.inexact({ DoStmt: decoders_1.pojo }), decoders_1.inexact({ VacuumStmt: decoders_1.pojo }), decoders_1.inexact({ AlterRoleStmt: decoders_1.pojo }), decoders_1.inexact({ CreateSchemaStmt: decoders_1.pojo }), decoders_1.inexact({ AlterDefaultPrivilegesStmt: decoders_1.pojo }), decoders_1.inexact({ GrantStmt: decoders_1.pojo }), decoders_1.inexact({ DeclareCursorStmt: decoders_1.pojo }), decoders_1.inexact({ CopyStmt: decoders_1.pojo }), decoders_1.either9(decoders_1.inexact({ CreateDomainStmt: decoders_1.pojo }), decoders_1.inexact({ FetchStmt: decoders_1.pojo }), decoders_1.inexact({ ClosePortalStmt: decoders_1.pojo }), decoders_1.inexact({ PrepareStmt: decoders_1.pojo }), decoders_1.inexact({ ExecuteStmt: decoders_1.pojo }), decoders_1.inexact({ RuleStmt: decoders_1.pojo }), decoders_1.inexact({ ReindexStmt: decoders_1.pojo }), decoders_1.inexact({ SecLabelStmt: decoders_1.pojo }), decoders_1.either9(decoders_1.inexact({ AlterRoleSetStmt: decoders_1.pojo }), decoders_1.inexact({ LockStmt: decoders_1.pojo }), decoders_1.inexact({ RenameStmt: decoders_1.pojo }), decoders_1.inexact({ NotifyStmt: decoders_1.pojo }), decoders_1.inexact({ ListenStmt: decoders_1.pojo }), decoders_1.inexact({ UnlistenStmt: decoders_1.pojo }), decoders_1.inexact({ DiscardStmt: decoders_1.pojo }), decoders_1.inexact({ AlterFunctionStmt: decoders_1.pojo }), decoders_1.either9(decoders_1.inexact({ AlterTSConfigurationStmt: decoders_1.pojo }), decoders_1.inexact({ AlterTSDictionaryStmt: decoders_1.pojo }), decoders_1.inexact({ CreateTrigStmt: decoders_1.pojo }), decoders_1.inexact({ AlterOpFamilyStmt: decoders_1.pojo }), decoders_1.inexact({ CreatePolicyStmt: decoders_1.pojo }), decoders_1.inexact({ CompositeTypeStmt: decoders_1.pojo }), decoders_1.inexact({ DeallocateStmt: decoders_1.pojo }), decoders_1.inexact({ CreateConversionStmt: decoders_1.pojo }), decoders_1.either9(decoders_1.inexact({ CommentStmt: decoders_1.pojo }), decoders_1.inexact({ AlterOwnerStmt: decoders_1.pojo }), decoders_1.inexact({ AlterObjectSchemaStmt: decoders_1.pojo }), decoders_1.inexact({ CreateFdwStmt: decoders_1.pojo }), decoders_1.inexact({ CreateForeignServerStmt: decoders_1.pojo }), decoders_1.inexact({ CreatePLangStmt: decoders_1.pojo }), decoders_1.inexact({ CreateOpFamilyStmt: decoders_1.pojo }), decoders_1.inexact({ CreateOpClassStmt: decoders_1.pojo }), decoders_1.either5(decoders_1.inexact({ CreateStatsStmt: decoders_1.pojo }), decoders_1.inexact({ AlterOperatorStmt: decoders_1.pojo }), decoders_1.inexact({ ClusterStmt: decoders_1.pojo }), decoders_1.inexact({ CreateEventTrigStmt: decoders_1.pojo }), decoders_1.inexact({ AlterEnumStmt: decoders_1.pojo }))))))))))
    })
});
