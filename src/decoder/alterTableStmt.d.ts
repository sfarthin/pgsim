import { Decoder } from "decoders";
import { Relation, ColumnDef } from "./createStmt";
import { Constraint } from "./constraint";
export declare enum AlterTableCmdSubType {
    ADD_COLUMN = 0,
    SET_DEFAULT = 3,
    DROP_NOT_NULL = 4,
    SET_NOT_NULL = 5,
    ALTER_COLUMN_TYPE = 25,
    DROP = 10,
    ADD_CONSTRAINT = 14,
    DROP_CONSTRAINT = 22,
    OWNER = 27,
    INDEX = 36,
    ROW_LEVEL_SECURITY = 56,
    INHERIT = 51,
    RESET = 37,
    CLUSTER = 28,
    SET_WITHOUT_CLUSTER = 29,
    RESTRICT = 22,
    ATTACH_PARTITION = 61
}
/**
 * Add Column
 */
export declare type AlterTableAddColumn = {
    subtype: AlterTableCmdSubType.ADD_COLUMN;
    def: {
        ColumnDef: ColumnDef;
    };
    behavior: number;
};
export declare const alterTableAddColumnDecoder: Decoder<AlterTableAddColumn>;
/**
 * Drop Column
 */
export declare type AlterTableDropColumn = {
    subtype: AlterTableCmdSubType.DROP;
    behavior: number;
    name?: string;
};
export declare const alterTableDropColumnDecoder: Decoder<AlterTableDropColumn>;
/**
 * Add Constraint
 */
export declare type AlterTableAddConstraint = {
    subtype: AlterTableCmdSubType.ADD_CONSTRAINT;
    def: {
        Constraint: Constraint;
    };
    behavior: number;
};
export declare const alterTableAddConstraintDecoder: Decoder<AlterTableAddConstraint>;
/**
 * Drop Constraint
 */
export declare type AlterTableDropConstraint = {
    subtype: AlterTableCmdSubType.DROP_CONSTRAINT;
    name: string;
    behavior: number;
};
export declare const alterTableDropConstraintDecoder: Decoder<AlterTableDropConstraint>;
/**
 * Alter Column Type
 */
export declare type AlterTableColumnType = {
    subtype: AlterTableCmdSubType.ALTER_COLUMN_TYPE;
    name: string;
    def?: unknown;
    behavior: number;
};
export declare const alterTableColumnDecoder: Decoder<AlterTableColumnType>;
/**
 * Row Security
 */
export declare type AlterTableRowSecurity = {
    subtype: AlterTableCmdSubType.ROW_LEVEL_SECURITY;
    behavior: number;
};
export declare const alterTableRowSecurityDecoder: Decoder<AlterTableRowSecurity>;
/**
 * INHERIT
 */
export declare type AlterTableInherit = {
    subtype: AlterTableCmdSubType.INHERIT;
    def?: unknown;
    behavior: number;
};
export declare const alterTableInheritDecoder: Decoder<AlterTableInherit>;
/**
 * Index
 */
export declare type AlterTableIndex = {
    subtype: AlterTableCmdSubType.INDEX;
    def?: unknown;
    behavior: number;
};
export declare const alterTableIndexDecoder: Decoder<AlterTableIndex>;
/**
 * Owner
 */
export declare type AlterTableOwner = {
    subtype: AlterTableCmdSubType.OWNER;
    newowner?: unknown;
    behavior: number;
};
export declare const alterTableOwnerDecoder: Decoder<AlterTableOwner>;
/**
 * Reset
 */
export declare type AlterTableReset = {
    subtype: AlterTableCmdSubType.RESET;
    def?: unknown;
    behavior: number;
};
export declare const alterTableResetDecoder: Decoder<AlterTableReset>;
/**
 * Cluster
 */
export declare type AlterTableCluster = {
    subtype: AlterTableCmdSubType.CLUSTER;
    name?: unknown;
    behavior: number;
};
export declare const alterTableClusterDecoder: Decoder<AlterTableCluster>;
/**
 * Set Without Cluster
 */
export declare type AlterTableSetWithoutCluster = {
    subtype: AlterTableCmdSubType.SET_WITHOUT_CLUSTER;
    behavior: number;
};
export declare const alterTableSetWithoutClusterDecoder: Decoder<AlterTableSetWithoutCluster>;
/**
 * Restrict
 */
export declare type AlterTableRestrict = {
    subtype: AlterTableCmdSubType.RESTRICT;
    name: string;
    behavior: number;
};
export declare const alterTableRestrictDecoder: Decoder<AlterTableRestrict>;
/**
 * ATTACH_PARTITION
 */
export declare type AlterTableAttachPartition = {
    subtype: AlterTableCmdSubType.ATTACH_PARTITION;
    def?: unknown;
    behavior: number;
};
export declare const alterTableAttachPartitionDecoder: Decoder<AlterTableAttachPartition>;
/**
 * SET_DEFAULT
 */
export declare type AlterTableSetDefault = {
    subtype: AlterTableCmdSubType.SET_DEFAULT;
    name: string;
    def?: unknown;
    behavior: number;
};
export declare const alterTableSetDefaultDecoder: Decoder<AlterTableSetDefault>;
/**
 * DROP_NOT_NULL
 */
export declare type AlterTableDropNotNull = {
    subtype: AlterTableCmdSubType.DROP_NOT_NULL;
    name: string;
    behavior: number;
};
export declare const alterTableDropNotNullDecoder: Decoder<AlterTableDropNotNull>;
/**
 * SET_NOT_NULL
 */
export declare type AlterTableSetNotNull = {
    subtype: AlterTableCmdSubType.SET_NOT_NULL;
    name: string;
    behavior: number;
};
export declare const alterTableSetNotNullDecoder: Decoder<AlterTableSetNotNull>;
/**
 * Wrapper
 */
export declare type AlterTableCmd = AlterTableAddColumn | AlterTableDropColumn | AlterTableAddConstraint | AlterTableDropConstraint | AlterTableRowSecurity | AlterTableInherit | AlterTableIndex | AlterTableOwner | AlterTableReset | AlterTableCluster | AlterTableSetWithoutCluster | AlterTableRestrict | AlterTableColumnType | AlterTableAttachPartition | AlterTableSetDefault | AlterTableDropNotNull | AlterTableSetNotNull;
export declare const alterTableCmdDecoder: Decoder<AlterTableCmd>;
export declare type AlterTableStmt = {
    relation: Relation;
    cmds: Array<{
        AlterTableCmd: AlterTableCmd;
    }>;
    relkind: number;
};
export declare const alterTableStmtDecoder: Decoder<AlterTableStmt>;
