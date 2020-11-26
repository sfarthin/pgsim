"use strict";
exports.__esModule = true;
exports.alterTableStmtDecoder = exports.alterTableCmdDecoder = exports.alterTableSetNotNullDecoder = exports.alterTableDropNotNullDecoder = exports.alterTableSetDefaultDecoder = exports.alterTableAttachPartitionDecoder = exports.alterTableRestrictDecoder = exports.alterTableSetWithoutClusterDecoder = exports.alterTableClusterDecoder = exports.alterTableResetDecoder = exports.alterTableOwnerDecoder = exports.alterTableIndexDecoder = exports.alterTableInheritDecoder = exports.alterTableRowSecurityDecoder = exports.alterTableColumnDecoder = exports.alterTableDropConstraintDecoder = exports.alterTableAddConstraintDecoder = exports.alterTableDropColumnDecoder = exports.alterTableAddColumnDecoder = exports.AlterTableCmdSubType = void 0;
var decoders_1 = require("decoders");
var createStmt_1 = require("./createStmt");
var constraint_1 = require("./constraint");
var AlterTableCmdSubType;
(function (AlterTableCmdSubType) {
    AlterTableCmdSubType[AlterTableCmdSubType["ADD_COLUMN"] = 0] = "ADD_COLUMN";
    AlterTableCmdSubType[AlterTableCmdSubType["SET_DEFAULT"] = 3] = "SET_DEFAULT";
    AlterTableCmdSubType[AlterTableCmdSubType["DROP_NOT_NULL"] = 4] = "DROP_NOT_NULL";
    AlterTableCmdSubType[AlterTableCmdSubType["SET_NOT_NULL"] = 5] = "SET_NOT_NULL";
    AlterTableCmdSubType[AlterTableCmdSubType["ALTER_COLUMN_TYPE"] = 25] = "ALTER_COLUMN_TYPE";
    AlterTableCmdSubType[AlterTableCmdSubType["DROP"] = 10] = "DROP";
    AlterTableCmdSubType[AlterTableCmdSubType["ADD_CONSTRAINT"] = 14] = "ADD_CONSTRAINT";
    AlterTableCmdSubType[AlterTableCmdSubType["DROP_CONSTRAINT"] = 22] = "DROP_CONSTRAINT";
    AlterTableCmdSubType[AlterTableCmdSubType["OWNER"] = 27] = "OWNER";
    AlterTableCmdSubType[AlterTableCmdSubType["INDEX"] = 36] = "INDEX";
    //INHERIT = 51,
    AlterTableCmdSubType[AlterTableCmdSubType["ROW_LEVEL_SECURITY"] = 56] = "ROW_LEVEL_SECURITY";
    // ALTER TABLE t1c INHERIT t1;
    AlterTableCmdSubType[AlterTableCmdSubType["INHERIT"] = 51] = "INHERIT";
    AlterTableCmdSubType[AlterTableCmdSubType["RESET"] = 37] = "RESET";
    AlterTableCmdSubType[AlterTableCmdSubType["CLUSTER"] = 28] = "CLUSTER";
    AlterTableCmdSubType[AlterTableCmdSubType["SET_WITHOUT_CLUSTER"] = 29] = "SET_WITHOUT_CLUSTER";
    AlterTableCmdSubType[AlterTableCmdSubType["RESTRICT"] = 22] = "RESTRICT";
    AlterTableCmdSubType[AlterTableCmdSubType["ATTACH_PARTITION"] = 61] = "ATTACH_PARTITION";
})(AlterTableCmdSubType = exports.AlterTableCmdSubType || (exports.AlterTableCmdSubType = {}));
exports.alterTableAddColumnDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.ADD_COLUMN),
    def: decoders_1.exact({
        ColumnDef: createStmt_1.columnDefDecoder
    }),
    behavior: decoders_1.number
});
exports.alterTableDropColumnDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.DROP),
    behavior: decoders_1.number,
    name: decoders_1.optional(decoders_1.string)
});
exports.alterTableAddConstraintDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.ADD_CONSTRAINT),
    def: decoders_1.exact({ Constraint: constraint_1.constraintDecoder }),
    behavior: decoders_1.number
});
exports.alterTableDropConstraintDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.DROP_CONSTRAINT),
    name: decoders_1.string,
    behavior: decoders_1.number
});
exports.alterTableColumnDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.ALTER_COLUMN_TYPE),
    name: decoders_1.string,
    def: decoders_1.unknown,
    behavior: decoders_1.number
});
exports.alterTableRowSecurityDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.ROW_LEVEL_SECURITY),
    behavior: decoders_1.number
});
exports.alterTableInheritDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.INHERIT),
    def: decoders_1.unknown,
    behavior: decoders_1.number
});
exports.alterTableIndexDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.INDEX),
    def: decoders_1.unknown,
    behavior: decoders_1.number
});
exports.alterTableOwnerDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.OWNER),
    newowner: decoders_1.unknown,
    behavior: decoders_1.number
});
exports.alterTableResetDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.RESET),
    def: decoders_1.unknown,
    behavior: decoders_1.number
});
exports.alterTableClusterDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.CLUSTER),
    name: decoders_1.unknown,
    behavior: decoders_1.number
});
exports.alterTableSetWithoutClusterDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.SET_WITHOUT_CLUSTER),
    behavior: decoders_1.number
});
exports.alterTableRestrictDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.RESTRICT),
    name: decoders_1.string,
    behavior: decoders_1.number
});
exports.alterTableAttachPartitionDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.ATTACH_PARTITION),
    def: decoders_1.unknown,
    behavior: decoders_1.number
});
exports.alterTableSetDefaultDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.SET_DEFAULT),
    name: decoders_1.string,
    def: decoders_1.unknown,
    behavior: decoders_1.number
});
exports.alterTableDropNotNullDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.DROP_NOT_NULL),
    name: decoders_1.string,
    behavior: decoders_1.number
});
exports.alterTableSetNotNullDecoder = decoders_1.exact({
    subtype: decoders_1.constant(AlterTableCmdSubType.SET_NOT_NULL),
    name: decoders_1.string,
    behavior: decoders_1.number
});
exports.alterTableCmdDecoder = decoders_1.either9(exports.alterTableAddColumnDecoder, exports.alterTableDropColumnDecoder, exports.alterTableAddConstraintDecoder, exports.alterTableDropColumnDecoder, exports.alterTableRowSecurityDecoder, exports.alterTableInheritDecoder, exports.alterTableIndexDecoder, exports.alterTableOwnerDecoder, decoders_1.either9(exports.alterTableResetDecoder, exports.alterTableClusterDecoder, exports.alterTableSetWithoutClusterDecoder, exports.alterTableRestrictDecoder, exports.alterTableColumnDecoder, exports.alterTableAttachPartitionDecoder, exports.alterTableSetDefaultDecoder, exports.alterTableDropNotNullDecoder, exports.alterTableSetNotNullDecoder));
exports.alterTableStmtDecoder = decoders_1.exact({
    relation: createStmt_1.relationDecoder,
    cmds: decoders_1.array(decoders_1.exact({ AlterTableCmd: exports.alterTableCmdDecoder })),
    relkind: decoders_1.number
});
