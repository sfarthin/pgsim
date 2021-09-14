import * as d from "decoders";
import { ColumnDef, columnDefDecoder } from "./createStmt";
import { Constraint, constraintDecoder } from "./constraint";
import { rawValueDecoder, RawValue } from "./rawExpr";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { String } from "./constant";

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

export const alterTableAddColumnDecoder: d.Decoder<AlterTableAddColumn> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.ADD_COLUMN
    ) as d.Decoder<AlterTableCmdSubType.ADD_COLUMN>,
    def: d.exact({
      ColumnDef: columnDefDecoder,
    }),
    behavior: d.number,
    codeComment: d.optional(d.string),
  }
);

/**
 * Drop Column
 */
export type AlterTableDropColumn = {
  subtype: AlterTableCmdSubType.DROP;
  behavior: number;
  name?: string;
  codeComment?: string;
};

export const alterTableDropColumnDecoder: d.Decoder<AlterTableDropColumn> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.DROP
    ) as d.Decoder<AlterTableCmdSubType.DROP>,
    behavior: d.number,
    name: d.optional(d.string),
    codeComment: d.optional(d.string),
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
  keys?: { String: String }[];
  behavior: number;
  codeComment?: string;
};

export const alterTableAddConstraintDecoder: d.Decoder<AlterTableAddConstraint> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.ADD_CONSTRAINT
    ) as d.Decoder<AlterTableCmdSubType.ADD_CONSTRAINT>,
    def: d.exact({ Constraint: constraintDecoder }),
    behavior: d.number,
    codeComment: d.optional(d.string),
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

export const alterTableDropConstraintDecoder: d.Decoder<AlterTableDropConstraint> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.DROP_CONSTRAINT
    ) as d.Decoder<AlterTableCmdSubType.DROP_CONSTRAINT>,
    name: d.string,
    behavior: d.number,
    codeComment: d.optional(d.string),
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

export const alterTableColumnDecoder: d.Decoder<AlterTableColumnType> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.ALTER_COLUMN_TYPE
    ) as d.Decoder<AlterTableCmdSubType.ALTER_COLUMN_TYPE>,
    name: d.string,
    def: d.unknown,
    behavior: d.number,
    codeComment: d.optional(d.string),
  }
);

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

//  d.exact({
//   subtype: either(d.constant(14), d.constant(AlterTableCmdSubType.PRIMARY_KEY)),
//   def:  d.exact({
//     Constraint: constraintDecoder,
//   }),
//   behavior: d.number,
// }),
// alterTableDropConstraintDecoder,
//  d.exact({
//   subtype: either3(d.constant(51), d.constant(36), d.constant(27)),
//   def: mixed,
//   behavior: d.number,
//   newowner:  d.optional(mixed),
// })

/**
 * Row Security
 */

export type AlterTableRowSecurity = {
  subtype: AlterTableCmdSubType.ROW_LEVEL_SECURITY;
  behavior: number;
  codeComment?: string;
};

export const alterTableRowSecurityDecoder: d.Decoder<AlterTableRowSecurity> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.ROW_LEVEL_SECURITY
    ) as d.Decoder<AlterTableCmdSubType.ROW_LEVEL_SECURITY>,
    behavior: d.number,
    codeComment: d.optional(d.string),
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

export const alterTableInheritDecoder: d.Decoder<AlterTableInherit> = d.exact({
  subtype: d.constant(
    AlterTableCmdSubType.INHERIT
  ) as d.Decoder<AlterTableCmdSubType.INHERIT>,
  def: d.unknown,
  behavior: d.number,
  codeComment: d.optional(d.string),
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

export const alterTableIndexDecoder: d.Decoder<AlterTableIndex> = d.exact({
  subtype: d.constant(
    AlterTableCmdSubType.INDEX
  ) as d.Decoder<AlterTableCmdSubType.INDEX>,
  def: d.unknown,
  behavior: d.number,
  codeComment: d.optional(d.string),
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

export const alterTableOwnerDecoder: d.Decoder<AlterTableOwner> = d.exact({
  subtype: d.constant(
    AlterTableCmdSubType.OWNER
  ) as d.Decoder<AlterTableCmdSubType.OWNER>,
  newowner: d.unknown,
  behavior: d.number,
  codeComment: d.optional(d.string),
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

export const alterTableResetDecoder: d.Decoder<AlterTableReset> = d.exact({
  subtype: d.constant(
    AlterTableCmdSubType.RESET
  ) as d.Decoder<AlterTableCmdSubType.RESET>,
  def: d.unknown,
  behavior: d.number,
  codeComment: d.optional(d.string),
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

export const alterTableClusterDecoder: d.Decoder<AlterTableCluster> = d.exact({
  subtype: d.constant(
    AlterTableCmdSubType.CLUSTER
  ) as d.Decoder<AlterTableCmdSubType.CLUSTER>,
  name: d.unknown,
  behavior: d.number,
  codeComment: d.optional(d.string),
});

/**
 * Set Without Cluster
 */
export type AlterTableSetWithoutCluster = {
  subtype: AlterTableCmdSubType.SET_WITHOUT_CLUSTER;
  behavior: number;
  codeComment?: string;
};

export const alterTableSetWithoutClusterDecoder: d.Decoder<AlterTableSetWithoutCluster> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.SET_WITHOUT_CLUSTER
    ) as d.Decoder<AlterTableCmdSubType.SET_WITHOUT_CLUSTER>,
    behavior: d.number,
    codeComment: d.optional(d.string),
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

export const alterTableRestrictDecoder: d.Decoder<AlterTableRestrict> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.RESTRICT
    ) as d.Decoder<AlterTableCmdSubType.RESTRICT>,
    name: d.string,
    behavior: d.number,
    codeComment: d.optional(d.string),
  }
);

/**
 * ATTACH_PARTITION
 */

export type AlterTableAttachPartition = {
  subtype: AlterTableCmdSubType.ATTACH_PARTITION;
  def?: unknown;
  behavior: number;
  codeComment?: string;
};

export const alterTableAttachPartitionDecoder: d.Decoder<AlterTableAttachPartition> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.ATTACH_PARTITION
    ) as d.Decoder<AlterTableCmdSubType.ATTACH_PARTITION>,
    def: d.unknown,
    behavior: d.number,
    codeComment: d.optional(d.string),
  }
);

/**
 * SET_DEFAULT
 */

export type AlterTableSetDefault = {
  subtype: AlterTableCmdSubType.SET_DEFAULT;
  name: string;
  def?: RawValue;
  behavior: number;
  codeComment?: string;
};

export const alterTableSetDefaultDecoder: d.Decoder<AlterTableSetDefault> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.SET_DEFAULT
    ) as d.Decoder<AlterTableCmdSubType.SET_DEFAULT>,
    name: d.string,
    def: (blob) => rawValueDecoder(blob),
    behavior: d.number,
    codeComment: d.optional(d.string),
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

export const alterTableDropNotNullDecoder: d.Decoder<AlterTableDropNotNull> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.DROP_NOT_NULL
    ) as d.Decoder<AlterTableCmdSubType.DROP_NOT_NULL>,
    name: d.string,
    behavior: d.number,
    codeComment: d.optional(d.string),
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

export const alterTableSetNotNullDecoder: d.Decoder<AlterTableSetNotNull> = d.exact(
  {
    subtype: d.constant(
      AlterTableCmdSubType.SET_NOT_NULL
    ) as d.Decoder<AlterTableCmdSubType.SET_NOT_NULL>,
    name: d.string,
    behavior: d.number,
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
  | AlterTableRestrict
  | AlterTableColumnType
  | AlterTableAttachPartition
  | AlterTableSetDefault
  | AlterTableDropNotNull
  | AlterTableSetNotNull;

export const alterTableCmdDecoder: d.Decoder<AlterTableCmd> = d.either9(
  alterTableAddColumnDecoder,
  alterTableDropColumnDecoder,
  alterTableAddConstraintDecoder,
  alterTableDropColumnDecoder,
  alterTableRowSecurityDecoder,
  alterTableInheritDecoder,
  alterTableIndexDecoder,
  alterTableOwnerDecoder,
  d.either9(
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
  relation: RangeVar;
  cmds: Array<{ AlterTableCmd: AlterTableCmd }>;
  relkind: number;
  codeComment?: string;
  missing_ok?: boolean;
};

export const alterTableStmtDecoder: d.Decoder<AlterTableStmt> = d.exact({
  relation: rangeVarDecoder,
  cmds: d.array(d.exact({ AlterTableCmd: alterTableCmdDecoder })),
  relkind: d.number,
  missing_ok: d.optional(d.boolean),
  codeComment: d.optional(d.string),
});
