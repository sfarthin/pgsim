import * as d from "decoders";
import { ColumnDef, columnDefDecoder } from "./createStmt";
import { Constraint, constraintDecoder } from "./constraint";
import { rawValueDecoder } from "./rawExpr";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { String } from "./constant";
import { DropBehavior, dropBehaviorDecoder } from "./dropBehavior";

export enum AlterTableCmdSubType {
  /* 01 */ AT_AddColumn = "AT_AddColumn" /* add column */,
  // /* 02 */ AT_AddColumnRecurse = "AT_AddColumnRecurse" /* internal to commands/tablecmds.c */,
  // /* 03 */ AT_AddColumnToView = "AT_AddColumnToView" /* implicitly via CREATE OR REPLACE VIEW */,
  /* 04 */ AT_ColumnDefault = "AT_ColumnDefault" /* alter column default */,
  // /* 05 */ AT_CookedColumnDefault = "AT_CookedColumnDefault" /* add a pre-cooked column default */,
  /* 06 */ AT_DropNotNull = "AT_DropNotNull" /* alter column drop not null */,
  /* 07 */ AT_SetNotNull = "AT_SetNotNull" /* alter column set not null */,
  // /* 08 */ AT_DropExpression = "AT_DropExpression" /* alter column drop expression */,
  // /* 09 */ AT_CheckNotNull = "AT_CheckNotNull" /* check column is already marked not null */,
  // /* 10 */ AT_SetStatistics = "AT_SetStatistics" /* alter column set statistics */,
  // /* 11 */ AT_SetOptions = "AT_SetOptions" /* alter column set ( options ) */,
  /* 12 */ AT_ResetOptions = "AT_ResetOptions" /* alter column reset ( options ) */,
  // /* 13 */ AT_SetStorage = "AT_SetStorage" /* alter column set storage */,
  // /* 14 */ AT_SetCompression = "AT_SetCompression" /* alter column set compression */,
  /* 15 */ AT_DropColumn = "AT_DropColumn" /* drop column */,
  // /* 16 */ AT_DropColumnRecurse = "AT_DropColumnRecurse" /* internal to commands/tablecmds.c */,
  /* 17 */ AT_AddIndex = "AT_AddIndex" /* add index */,
  // /* 18 */ AT_ReAddIndex = "AT_ReAddIndex" /* internal to commands/tablecmds.c */,
  /* 19 */ AT_AddConstraint = "AT_AddConstraint" /* add constraint */,
  // /* 20 */ AT_AddConstraintRecurse = "AT_AddConstraintRecurse" /* internal to commands/tablecmds.c */,
  // /* 21 */ AT_ReAddConstraint = "AT_ReAddConstraint" /* internal to commands/tablecmds.c */,
  // /* 22 */ AT_ReAddDomainConstraint = "AT_ReAddDomainConstraint" /* internal to commands/tablecmds.c */,
  // /* 23 */ AT_AlterConstraint = "AT_AlterConstraint" /* alter constraint */,
  // /* 24 */ AT_ValidateConstraint = "AT_ValidateConstraint" /* validate constraint */,
  // /* 25 */ AT_ValidateConstraintRecurse = "AT_ValidateConstraintRecurse" /* internal to commands/tablecmds.c */,
  // /* 26 */ AT_AddIndexConstraint = "AT_AddIndexConstraint" /* add constraint using existing index */,
  /* 27 */ AT_DropConstraint = "AT_DropConstraint" /* drop constraint */,
  // /* 28 */ AT_DropConstraintRecurse = "AT_DropConstraintRecurse" /* internal to commands/tablecmds.c */,
  // /* 29 */ AT_ReAddComment = "AT_ReAddComment" /* internal to commands/tablecmds.c */,
  /* 30 */ AT_AlterColumnType = "AT_AlterColumnType" /* alter column type */,
  // /* 31 */ AT_AlterColumnGenericOptions = "AT_AlterColumnGenericOptions" /* alter column OPTIONS (...) */,
  /* 32 */ AT_ChangeOwner = "AT_ChangeOwner" /* change owner */,
  /* 33 */ AT_ClusterOn = "AT_ClusterOn" /* CLUSTER ON */,
  /* 34 */ AT_DropCluster = "AT_DropCluster" /* SET WITHOUT CLUSTER */,
  // /* 35 */ AT_SetLogged = "AT_SetLogged" /* SET LOGGED */,
  // /* 36 */ AT_SetUnLogged = "AT_SetUnLogged" /* SET UNLOGGED */,
  // /* 37 */ AT_DropOids = "AT_DropOids" /* SET WITHOUT OIDS */,
  // /* 38 */ AT_SetAccessMethod = "AT_SetAccessMethod" /* SET ACCESS METHOD */,
  // /* 39 */ AT_SetTableSpace = "AT_SetTableSpace" /* SET TABLESPACE */,
  // /* 40 */ AT_SetRelOptions = "AT_SetRelOptions" /* SET (...) -- AM specific parameters */,
  // /* 41 */ AT_ResetRelOptions = "AT_ResetRelOptions" /* RESET (...) -- AM specific parameters */,
  // /* 42 */ AT_ReplaceRelOptions = "AT_ReplaceRelOptions" /* replace reloption list in its entirety */,
  // /* 43 */ AT_EnableTrig = "AT_EnableTrig" /* ENABLE TRIGGER name */,
  // /* 44 */ AT_EnableAlwaysTrig = "AT_EnableAlwaysTrig" /* ENABLE ALWAYS TRIGGER name */,
  // /* 45 */ AT_EnableReplicaTrig = "AT_EnableReplicaTrig" /* ENABLE REPLICA TRIGGER name */,
  // /* 46 */ AT_DisableTrig = "AT_DisableTrig" /* DISABLE TRIGGER name */,
  // /* 47 */ AT_EnableTrigAll = "AT_EnableTrigAll" /* ENABLE TRIGGER ALL */,
  // /* 48 */ AT_DisableTrigAll = "AT_DisableTrigAll" /* DISABLE TRIGGER ALL */,
  // /* 49 */ AT_EnableTrigUser = "AT_EnableTrigUser" /* ENABLE TRIGGER USER */,
  // /* 50 */ AT_DisableTrigUser = "AT_DisableTrigUser" /* DISABLE TRIGGER USER */,
  // /* 51 */ AT_EnableRule = "AT_EnableRule" /* ENABLE RULE name */,
  // /* 52 */ AT_EnableAlwaysRule = "AT_EnableAlwaysRule" /* ENABLE ALWAYS RULE name */,
  // /* 53 */ AT_EnableReplicaRule = "AT_EnableReplicaRule" /* ENABLE REPLICA RULE name */,
  // /* 54 */ AT_DisableRule = "AT_DisableRule" /* DISABLE RULE name */,
  /* 55 */ AT_AddInherit = "AT_AddInherit" /* INHERIT parent */,
  // /* 56 */ AT_DropInherit = "AT_DropInherit" /* NO INHERIT parent */,
  // /* 57 */ AT_AddOf = "AT_AddOf" /* OF <type_name> */,
  // /* 58 */ AT_DropOf = "AT_DropOf" /* NOT OF */,
  // /* 59 */ AT_ReplicaIdentity = "AT_ReplicaIdentity" /* REPLICA IDENTITY */,
  /* 60 */ AT_EnableRowSecurity = "AT_EnableRowSecurity" /* ENABLE ROW SECURITY */,
  // /* 61 */ AT_DisableRowSecurity = "AT_DisableRowSecurity" /* DISABLE ROW SECURITY */,
  // /* 62 */ AT_ForceRowSecurity = "AT_ForceRowSecurity" /* FORCE ROW SECURITY */,
  // /* 63 */ AT_NoForceRowSecurity = "AT_NoForceRowSecurity" /* NO FORCE ROW SECURITY */,
  // /* 64 */ AT_GenericOptions = "AT_GenericOptions" /* OPTIONS (...) */,
  /* 65 */ AT_AttachPartition = "AT_AttachPartition" /* ATTACH PARTITION */,
  // /* 66 */ AT_DetachPartition = "AT_DetachPartition" /* DETACH PARTITION */,
  // /* 67 */ AT_DetachPartitionFinalize = "AT_DetachPartitionFinalize" /* DETACH PARTITION FINALIZE */,
  // /* 68 */ AT_AddIdentity = "AT_AddIdentity" /* ADD IDENTITY */,
  // /* 69 */ AT_SetIdentity = "AT_SetIdentity" /* SET identity column options */,
  // /* 70 */ AT_DropIdentity = "AT_DropIdentity" /* DROP IDENTITY */,
  // /* 71 */ AT_ReAddStatistics = "AT_ReAddStatistics" /* internal to commands/tablecmds.c */,
}

/**
 * Add Column
 */
export type AlterTableAddColumn = {
  subtype: AlterTableCmdSubType.AT_AddColumn;
  def: {
    ColumnDef: ColumnDef;
  };
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableAddColumnDecoder: d.Decoder<AlterTableAddColumn> = d.exact(
  {
    subtype: d.constant(AlterTableCmdSubType.AT_AddColumn),
    def: d.exact({
      ColumnDef: columnDefDecoder,
    }),
    behavior: dropBehaviorDecoder,
    codeComment: d.optional(d.string),
  }
);

/**
 * Drop Column
 */
export type AlterTableDropColumn = {
  subtype: AlterTableCmdSubType.AT_DropColumn;
  behavior: DropBehavior;
  name?: string;
  codeComment?: string;
};

export const alterTableDropColumnDecoder: d.Decoder<AlterTableDropColumn> = d.exact(
  {
    subtype: d.constant(AlterTableCmdSubType.AT_DropColumn),
    behavior: dropBehaviorDecoder,
    name: d.optional(d.string),
    codeComment: d.optional(d.string),
  }
);

/**
 * Add Constraint
 */
export type AlterTableAddConstraint = {
  subtype: AlterTableCmdSubType.AT_AddConstraint;
  conname?: string;
  def: {
    Constraint: Constraint;
  };
  keys?: { String: String }[];
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableAddConstraintDecoder: d.Decoder<AlterTableAddConstraint> = d.exact(
  {
    subtype: d.constant(AlterTableCmdSubType.AT_AddConstraint),
    def: d.exact({ Constraint: constraintDecoder }),
    behavior: dropBehaviorDecoder,
    codeComment: d.optional(d.string),
  }
);

/**
 * Drop Constraint
 */
export const alterTableDropConstraintDecoder = d.exact({
  subtype: d.constant(AlterTableCmdSubType.AT_DropConstraint),
  name: d.string,
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});
export type AlterTableDropConstraint = d.DecoderType<
  typeof alterTableDropConstraintDecoder
>;

/**
 * Alter Column Type
 */

export const alterTableColumnDecoder = d.exact({
  subtype: d.constant(AlterTableCmdSubType.AT_AlterColumnType),
  name: d.string,
  def: d.exact({
    ColumnDef: columnDefDecoder,
  }),
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});
export type AlterTableColumnType = d.DecoderType<
  typeof alterTableColumnDecoder
>;

/**
 * Row Security
 */

export type AlterTableRowSecurity = {
  subtype: AlterTableCmdSubType.AT_EnableRowSecurity;
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableRowSecurityDecoder: d.Decoder<AlterTableRowSecurity> = d.exact(
  {
    subtype: d.constant(AlterTableCmdSubType.AT_EnableRowSecurity),
    behavior: dropBehaviorDecoder,
    codeComment: d.optional(d.string),
  }
);

/**
 * INHERIT
 */
export type AlterTableInherit = {
  subtype: AlterTableCmdSubType.AT_AddInherit;
  def?: unknown;
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableInheritDecoder: d.Decoder<AlterTableInherit> = d.exact({
  subtype: d.constant(
    AlterTableCmdSubType.AT_AddInherit
  ) as d.Decoder<AlterTableCmdSubType.AT_AddInherit>,
  def: d.unknown,
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});

/**
 * Index
 */
export type AlterTableIndex = {
  subtype: AlterTableCmdSubType.AT_AddIndex;
  def?: unknown;
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableIndexDecoder: d.Decoder<AlterTableIndex> = d.exact({
  subtype: d.constant(AlterTableCmdSubType.AT_AddIndex),
  def: d.unknown,
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});

/**
 * Owner
 */
export type AlterTableOwner = {
  subtype: AlterTableCmdSubType.AT_ChangeOwner;
  newowner?: unknown;
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableOwnerDecoder: d.Decoder<AlterTableOwner> = d.exact({
  subtype: d.constant(AlterTableCmdSubType.AT_ChangeOwner),
  newowner: d.unknown,
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});

/**
 * Reset
 */
export type AlterTableReset = {
  subtype: AlterTableCmdSubType.AT_ResetOptions;
  def?: unknown;
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableResetDecoder: d.Decoder<AlterTableReset> = d.exact({
  subtype: d.constant(AlterTableCmdSubType.AT_ResetOptions),
  def: d.unknown,
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});

/**
 * Cluster
 */
export type AlterTableCluster = {
  subtype: AlterTableCmdSubType.AT_ClusterOn;
  name?: unknown;
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableClusterDecoder: d.Decoder<AlterTableCluster> = d.exact({
  subtype: d.constant(AlterTableCmdSubType.AT_ClusterOn),
  name: d.unknown,
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});

/**
 * Set Without Cluster
 */
export type AlterTableSetWithoutCluster = {
  subtype: AlterTableCmdSubType.AT_DropCluster;
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableSetWithoutClusterDecoder: d.Decoder<AlterTableSetWithoutCluster> = d.exact(
  {
    subtype: d.constant(AlterTableCmdSubType.AT_DropCluster),
    behavior: dropBehaviorDecoder,
    codeComment: d.optional(d.string),
  }
);

// /**
//  * Restrict
//  */
// export type AlterTableRestrict = {
//   subtype: AlterTableCmdSubType.AT_Re;
//   name: string;
//   behavior: number;
//   codeComment?: string;
// };

// export const alterTableRestrictDecoder: d.Decoder<AlterTableRestrict> = d.exact(
//   {
//     subtype: d.constant(
//       AlterTableCmdSubType.RESTRICT
//     ) as d.Decoder<AlterTableCmdSubType.RESTRICT>,
//     name: d.string,
//     behavior: d.number,
//     codeComment: d.optional(d.string),
//   }
// );

/**
 * ATTACH_PARTITION
 */

export type AlterTableAttachPartition = {
  subtype: AlterTableCmdSubType.AT_AttachPartition;
  def?: unknown;
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableAttachPartitionDecoder: d.Decoder<AlterTableAttachPartition> = d.exact(
  {
    subtype: d.constant(AlterTableCmdSubType.AT_AttachPartition),
    def: d.unknown,
    behavior: dropBehaviorDecoder,
    codeComment: d.optional(d.string),
  }
);

/**
 * SET_DEFAULT
 */
export const alterTableSetDefaultDecoder = d.exact({
  subtype: d.constant(AlterTableCmdSubType.AT_ColumnDefault),
  name: d.string,
  def: d.optional((blob) => rawValueDecoder(blob)),
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});
export type AlterTableSetDefault = d.DecoderType<
  typeof alterTableSetDefaultDecoder
>;

/**
 * DROP_NOT_NULL
 */

export type AlterTableDropNotNull = {
  subtype: AlterTableCmdSubType.AT_DropNotNull;
  name: string;
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableDropNotNullDecoder: d.Decoder<AlterTableDropNotNull> = d.exact(
  {
    subtype: d.constant(AlterTableCmdSubType.AT_DropNotNull),
    name: d.string,
    behavior: dropBehaviorDecoder,
    codeComment: d.optional(d.string),
  }
);

/**
 * SET_NOT_NULL
 */

export type AlterTableSetNotNull = {
  subtype: AlterTableCmdSubType.AT_SetNotNull;
  name: string;
  behavior: DropBehavior;
  codeComment?: string;
};

export const alterTableSetNotNullDecoder: d.Decoder<AlterTableSetNotNull> = d.exact(
  {
    subtype: d.constant(AlterTableCmdSubType.AT_SetNotNull),
    name: d.string,
    behavior: dropBehaviorDecoder,
    codeComment: d.optional(d.string),
  }
);

/**
 * Wrapper
 */

export type AlterTableCmd =
  | AlterTableAddColumn
  | AlterTableDropColumn
  | AlterTableAddConstraint
  | AlterTableDropConstraint
  | AlterTableRowSecurity
  | AlterTableInherit
  | AlterTableIndex
  | AlterTableOwner
  | AlterTableReset
  | AlterTableCluster
  | AlterTableSetWithoutCluster
  // | AlterTableRestrict
  | AlterTableColumnType
  | AlterTableAttachPartition
  | AlterTableSetDefault
  | AlterTableDropNotNull
  | AlterTableSetNotNull;

export const alterTableCmdDecoder: d.Decoder<AlterTableCmd> = d.dispatch(
  "subtype",
  {
    [AlterTableCmdSubType.AT_AddColumn]: alterTableAddColumnDecoder,
    [AlterTableCmdSubType.AT_DropColumn]: alterTableDropColumnDecoder,
    [AlterTableCmdSubType.AT_AddConstraint]: alterTableAddConstraintDecoder,
    [AlterTableCmdSubType.AT_DropConstraint]: alterTableDropConstraintDecoder,
    [AlterTableCmdSubType.AT_DropColumn]: alterTableDropColumnDecoder,
    [AlterTableCmdSubType.AT_EnableRowSecurity]: alterTableRowSecurityDecoder,
    [AlterTableCmdSubType.AT_AddInherit]: alterTableInheritDecoder,
    [AlterTableCmdSubType.AT_AddIndex]: alterTableIndexDecoder,
    [AlterTableCmdSubType.AT_ChangeOwner]: alterTableOwnerDecoder,
    [AlterTableCmdSubType.AT_ResetOptions]: alterTableResetDecoder,
    [AlterTableCmdSubType.AT_ClusterOn]: alterTableClusterDecoder,
    [AlterTableCmdSubType.AT_DropCluster]: alterTableSetWithoutClusterDecoder,
    [AlterTableCmdSubType.AT_AlterColumnType]: alterTableColumnDecoder,
    [AlterTableCmdSubType.AT_AttachPartition]: alterTableAttachPartitionDecoder,
    [AlterTableCmdSubType.AT_ColumnDefault]: alterTableSetDefaultDecoder,
    [AlterTableCmdSubType.AT_DropNotNull]: alterTableDropNotNullDecoder,
    [AlterTableCmdSubType.AT_SetNotNull]: alterTableSetNotNullDecoder,
  }
);

export type AlterTableStmt = {
  relation: RangeVar;
  cmds: Array<{ AlterTableCmd: AlterTableCmd }>;
  relkind: "OBJECT_TABLE";
  codeComment?: string;
  missing_ok?: boolean;
};

export const alterTableStmtDecoder: d.Decoder<AlterTableStmt> = d.exact({
  relation: rangeVarDecoder,
  cmds: d.array(d.exact({ AlterTableCmd: alterTableCmdDecoder })),
  relkind: d.constant("OBJECT_TABLE"),
  missing_ok: d.optional(d.boolean),
  codeComment: d.optional(d.string),
});
