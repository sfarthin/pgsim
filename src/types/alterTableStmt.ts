import {
  array,
  string,
  exact,
  Decoder,
  number,
  constant,
  either9,
  optional,
  unknown,
  boolean,
} from "decoders";
import {
  Relation,
  relationDecoder,
  ColumnDef,
  columnDefDecoder,
} from "./createStmt";
import { Constraint, constraintDecoder } from "./constraint";
import { RawExpr, rawExprDecoder } from "./rawExpr";
import { PGString } from "./constant";

export enum AlterTableCmdSubType {
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
  //INHERIT = 51,
  ROW_LEVEL_SECURITY = 56,

  // ALTER TABLE t1c INHERIT t1;
  INHERIT = 51,
  RESET = 37,
  CLUSTER = 28,
  SET_WITHOUT_CLUSTER = 29,
  RESTRICT = 22,
  ATTACH_PARTITION = 61,
}

/**
 * Add Column
 */
export type AlterTableAddColumn = {
  subtype: AlterTableCmdSubType.ADD_COLUMN;
  def: {
    ColumnDef: ColumnDef;
  };
  behavior: number;
  codeComment?: string;
};

export const alterTableAddColumnDecoder: Decoder<AlterTableAddColumn> = exact({
  subtype: constant(
    AlterTableCmdSubType.ADD_COLUMN
  ) as Decoder<AlterTableCmdSubType.ADD_COLUMN>,
  def: exact({
    ColumnDef: columnDefDecoder,
  }),
  behavior: number,
  codeComment: optional(string),
});

/**
 * Drop Column
 */
export type AlterTableDropColumn = {
  subtype: AlterTableCmdSubType.DROP;
  behavior: number;
  name?: string;
  codeComment?: string;
};

export const alterTableDropColumnDecoder: Decoder<AlterTableDropColumn> = exact(
  {
    subtype: constant(
      AlterTableCmdSubType.DROP
    ) as Decoder<AlterTableCmdSubType.DROP>,
    behavior: number,
    name: optional(string),
    codeComment: optional(string),
  }
);

/**
 * Add Constraint
 */
export type AlterTableAddConstraint = {
  subtype: AlterTableCmdSubType.ADD_CONSTRAINT;
  conname?: string;
  def: {
    Constraint: Constraint;
  };
  keys?: PGString[];
  behavior: number;
  codeComment?: string;
};

export const alterTableAddConstraintDecoder: Decoder<AlterTableAddConstraint> = exact(
  {
    subtype: constant(
      AlterTableCmdSubType.ADD_CONSTRAINT
    ) as Decoder<AlterTableCmdSubType.ADD_CONSTRAINT>,
    def: exact({ Constraint: constraintDecoder }),
    behavior: number,
    codeComment: optional(string),
  }
);

/**
 * Drop Constraint
 */

export type AlterTableDropConstraint = {
  subtype: AlterTableCmdSubType.DROP_CONSTRAINT;
  name: string;
  behavior: number;
  codeComment?: string;
};

export const alterTableDropConstraintDecoder: Decoder<AlterTableDropConstraint> = exact(
  {
    subtype: constant(
      AlterTableCmdSubType.DROP_CONSTRAINT
    ) as Decoder<AlterTableCmdSubType.DROP_CONSTRAINT>,
    name: string,
    behavior: number,
    codeComment: optional(string),
  }
);

/**
 * Alter Column Type
 */

export type AlterTableColumnType = {
  subtype: AlterTableCmdSubType.ALTER_COLUMN_TYPE;
  name: string;
  def?: unknown;
  behavior: number;
  codeComment?: string;
};

export const alterTableColumnDecoder: Decoder<AlterTableColumnType> = exact({
  subtype: constant(
    AlterTableCmdSubType.ALTER_COLUMN_TYPE
  ) as Decoder<AlterTableCmdSubType.ALTER_COLUMN_TYPE>,
  name: string,
  def: unknown,
  behavior: number,
  codeComment: optional(string),
});

// {
//   subtype:
//     | AlterTableCmdSubType.INHERIT
//     | AlterTableCmdSubType.INDEX
//     | AlterTableCmdSubType.OWNER;
//   def: unknown;
//   behavior: number;
//   newowner?: unknown;
// }

// | AlterTableCmdSubType.ADD_CONSTRAINT

// exact({
//   subtype: either(constant(14), constant(AlterTableCmdSubType.PRIMARY_KEY)),
//   def: exact({
//     Constraint: constraintDecoder,
//   }),
//   behavior: number,
// }),
// alterTableDropConstraintDecoder,
// exact({
//   subtype: either3(constant(51), constant(36), constant(27)),
//   def: mixed,
//   behavior: number,
//   newowner: optional(mixed),
// })

/**
 * Row Security
 */

export type AlterTableRowSecurity = {
  subtype: AlterTableCmdSubType.ROW_LEVEL_SECURITY;
  behavior: number;
  codeComment?: string;
};

export const alterTableRowSecurityDecoder: Decoder<AlterTableRowSecurity> = exact(
  {
    subtype: constant(
      AlterTableCmdSubType.ROW_LEVEL_SECURITY
    ) as Decoder<AlterTableCmdSubType.ROW_LEVEL_SECURITY>,
    behavior: number,
    codeComment: optional(string),
  }
);

/**
 * INHERIT
 */
export type AlterTableInherit = {
  subtype: AlterTableCmdSubType.INHERIT;
  def?: unknown;
  behavior: number;
  codeComment?: string;
};

export const alterTableInheritDecoder: Decoder<AlterTableInherit> = exact({
  subtype: constant(
    AlterTableCmdSubType.INHERIT
  ) as Decoder<AlterTableCmdSubType.INHERIT>,
  def: unknown,
  behavior: number,
  codeComment: optional(string),
});

/**
 * Index
 */
export type AlterTableIndex = {
  subtype: AlterTableCmdSubType.INDEX;
  def?: unknown;
  behavior: number;
  codeComment?: string;
};

export const alterTableIndexDecoder: Decoder<AlterTableIndex> = exact({
  subtype: constant(
    AlterTableCmdSubType.INDEX
  ) as Decoder<AlterTableCmdSubType.INDEX>,
  def: unknown,
  behavior: number,
  codeComment: optional(string),
});

/**
 * Owner
 */
export type AlterTableOwner = {
  subtype: AlterTableCmdSubType.OWNER;
  newowner?: unknown;
  behavior: number;
  codeComment?: string;
};

export const alterTableOwnerDecoder: Decoder<AlterTableOwner> = exact({
  subtype: constant(
    AlterTableCmdSubType.OWNER
  ) as Decoder<AlterTableCmdSubType.OWNER>,
  newowner: unknown,
  behavior: number,
  codeComment: optional(string),
});

/**
 * Reset
 */
export type AlterTableReset = {
  subtype: AlterTableCmdSubType.RESET;
  def?: unknown;
  behavior: number;
  codeComment?: string;
};

export const alterTableResetDecoder: Decoder<AlterTableReset> = exact({
  subtype: constant(
    AlterTableCmdSubType.RESET
  ) as Decoder<AlterTableCmdSubType.RESET>,
  def: unknown,
  behavior: number,
  codeComment: optional(string),
});

/**
 * Cluster
 */
export type AlterTableCluster = {
  subtype: AlterTableCmdSubType.CLUSTER;
  name?: unknown;
  behavior: number;
  codeComment?: string;
};

export const alterTableClusterDecoder: Decoder<AlterTableCluster> = exact({
  subtype: constant(
    AlterTableCmdSubType.CLUSTER
  ) as Decoder<AlterTableCmdSubType.CLUSTER>,
  name: unknown,
  behavior: number,
  codeComment: optional(string),
});

/**
 * Set Without Cluster
 */
export type AlterTableSetWithoutCluster = {
  subtype: AlterTableCmdSubType.SET_WITHOUT_CLUSTER;
  behavior: number;
  codeComment?: string;
};

export const alterTableSetWithoutClusterDecoder: Decoder<AlterTableSetWithoutCluster> = exact(
  {
    subtype: constant(
      AlterTableCmdSubType.SET_WITHOUT_CLUSTER
    ) as Decoder<AlterTableCmdSubType.SET_WITHOUT_CLUSTER>,
    behavior: number,
    codeComment: optional(string),
  }
);

/**
 * Restrict
 */
export type AlterTableRestrict = {
  subtype: AlterTableCmdSubType.RESTRICT;
  name: string;
  behavior: number;
  codeComment?: string;
};

export const alterTableRestrictDecoder: Decoder<AlterTableRestrict> = exact({
  subtype: constant(
    AlterTableCmdSubType.RESTRICT
  ) as Decoder<AlterTableCmdSubType.RESTRICT>,
  name: string,
  behavior: number,
  codeComment: optional(string),
});

/**
 * ATTACH_PARTITION
 */

export type AlterTableAttachPartition = {
  subtype: AlterTableCmdSubType.ATTACH_PARTITION;
  def?: unknown;
  behavior: number;
  codeComment?: string;
};

export const alterTableAttachPartitionDecoder: Decoder<AlterTableAttachPartition> = exact(
  {
    subtype: constant(
      AlterTableCmdSubType.ATTACH_PARTITION
    ) as Decoder<AlterTableCmdSubType.ATTACH_PARTITION>,
    def: unknown,
    behavior: number,
    codeComment: optional(string),
  }
);

/**
 * SET_DEFAULT
 */

export type AlterTableSetDefault = {
  subtype: AlterTableCmdSubType.SET_DEFAULT;
  name: string;
  def?: RawExpr;
  behavior: number;
  codeComment?: string;
};

export const alterTableSetDefaultDecoder: Decoder<AlterTableSetDefault> = exact(
  {
    subtype: constant(
      AlterTableCmdSubType.SET_DEFAULT
    ) as Decoder<AlterTableCmdSubType.SET_DEFAULT>,
    name: string,
    def: (blob) => rawExprDecoder(blob),
    behavior: number,
    codeComment: optional(string),
  }
);

/**
 * DROP_NOT_NULL
 */

export type AlterTableDropNotNull = {
  subtype: AlterTableCmdSubType.DROP_NOT_NULL;
  name: string;
  behavior: number;
  codeComment?: string;
};

export const alterTableDropNotNullDecoder: Decoder<AlterTableDropNotNull> = exact(
  {
    subtype: constant(
      AlterTableCmdSubType.DROP_NOT_NULL
    ) as Decoder<AlterTableCmdSubType.DROP_NOT_NULL>,
    name: string,
    behavior: number,
    codeComment: optional(string),
  }
);

/**
 * SET_NOT_NULL
 */

export type AlterTableSetNotNull = {
  subtype: AlterTableCmdSubType.SET_NOT_NULL;
  name: string;
  behavior: number;
  codeComment?: string;
};

export const alterTableSetNotNullDecoder: Decoder<AlterTableSetNotNull> = exact(
  {
    subtype: constant(
      AlterTableCmdSubType.SET_NOT_NULL
    ) as Decoder<AlterTableCmdSubType.SET_NOT_NULL>,
    name: string,
    behavior: number,
    codeComment: optional(string),
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
  | AlterTableRestrict
  | AlterTableColumnType
  | AlterTableAttachPartition
  | AlterTableSetDefault
  | AlterTableDropNotNull
  | AlterTableSetNotNull;

export const alterTableCmdDecoder: Decoder<AlterTableCmd> = either9(
  alterTableAddColumnDecoder,
  alterTableDropColumnDecoder,
  alterTableAddConstraintDecoder,
  alterTableDropColumnDecoder,
  alterTableRowSecurityDecoder,
  alterTableInheritDecoder,
  alterTableIndexDecoder,
  alterTableOwnerDecoder,
  either9(
    alterTableResetDecoder,
    alterTableClusterDecoder,
    alterTableSetWithoutClusterDecoder,
    alterTableRestrictDecoder,
    alterTableColumnDecoder,
    alterTableAttachPartitionDecoder,
    alterTableSetDefaultDecoder,
    alterTableDropNotNullDecoder,
    alterTableSetNotNullDecoder
  )
);

export type AlterTableStmt = {
  relation: Relation;
  cmds: Array<{ AlterTableCmd: AlterTableCmd }>;
  relkind: number;
  codeComment?: string;
  missing_ok?: boolean;
};

export const alterTableStmtDecoder: Decoder<AlterTableStmt> = exact({
  relation: relationDecoder,
  cmds: array(exact({ AlterTableCmd: alterTableCmdDecoder })),
  relkind: number,
  missing_ok: optional(boolean),
  codeComment: optional(string),
});
