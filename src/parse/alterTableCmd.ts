import {
  AlterTableCmd,
  AlterTableSetDefault,
  AlterTableAddColumn,
  AlterTableCmdSubType,
  AlterTableDropColumn,
  AlterTableAddConstraint,
} from "../types";
import { rawExpr } from "./rawExpr";
import {
  sequence,
  transform,
  optional,
  IF,
  ALTER,
  EXISTS,
  NOT,
  Rule,
  identifier,
  __,
  oneToMany,
  ADD,
  // or,
  COLUMN,
  SET,
  DEFAULT,
  combineComments,
  or,
  RESTRICT,
  CASCADE,
  DROP,
} from "./util";
import { typeName } from "./typeName";
import { constraint } from "./constraint";

// TODO:
// | AlterTableDropConstraint
// | AlterTableRowSecurity
// | AlterTableInherit
// | AlterTableIndex
// | AlterTableOwner
// | AlterTableReset
// | AlterTableCluster
// | AlterTableSetWithoutCluster
// | AlterTableRestrict
// | AlterTableColumnType
// | AlterTableAttachPartition
// | AlterTableDropNotNull
// | AlterTableSetNotNull;

const alterTableAddConstraint: Rule<AlterTableAddConstraint> = transform(
  sequence([__, ADD, __, constraint, __]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.ADD_CONSTRAINT,
      def: {
        Constraint: v[3].value,
      },
      behavior: 0,
      comment: combineComments(v[0], v[2], v[3].comment, v[4]),
    };
  }
);

const alterTableDropColumn: Rule<AlterTableDropColumn> = transform(
  sequence([
    __,
    DROP,
    __,
    optional(COLUMN),
    __,
    optional(sequence([IF, __, EXISTS])), // 5
    __,
    identifier,
    __,
    optional(or([RESTRICT, CASCADE])),
    __,
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.DROP,
      behavior: 0,
      name: v[7],
      comment: combineComments(v[0], v[2], v[4], v[5]?.[1], v[6], v[8], v[10]),
    };
  }
);

const alterTableAddColumn: Rule<AlterTableAddColumn> = transform(
  sequence([
    __,
    ADD,
    __,
    optional(COLUMN),
    __,
    optional(sequence([IF, __, NOT, __, EXISTS])), // 5
    __,
    transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
    __,
    typeName,
    __, // 10
    optional(oneToMany(sequence([__, constraint, __]))),
    __,
  ]),
  (v) => {
    const listOfConstraints = v[11]?.map((e) => ({
      Constraint: e[1].value,
    }));

    return {
      subtype: AlterTableCmdSubType.ADD_COLUMN,
      def: {
        ColumnDef: {
          colname: v[7].value,
          typeName: { TypeName: v[9].value },
          ...(listOfConstraints ? { constraints: listOfConstraints } : {}),
          is_local: true,
          location: v[7].pos,
          comment: "",
        },
      },
      behavior: 0,
      comment: combineComments(
        v[0],
        v[2],
        v[4],
        v[5]?.[1],
        v[5]?.[3],
        v[6],
        v[8],
        v[9].comment,
        v[10],
        ...(v[11]?.map((k) => combineComments(k[0], k[1].comment, k[2])) ?? []),
        v[12]
      ),
    };
  }
);

const alterTableSetDefault: Rule<AlterTableSetDefault> = transform(
  sequence([
    __,
    ALTER,
    __,
    optional(COLUMN),
    __,
    identifier, // 5
    __,
    SET,
    __,
    DEFAULT,
    __, // 10
    rawExpr,
    __,
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.SET_DEFAULT,
      name: v[5],
      def: v[11].value,
      behavior: 0,
      comment: combineComments(
        v[0],
        v[2],
        v[4],
        v[6],
        v[8],
        v[10],
        v[11].comment,
        v[12]
      ),
    };
  }
);

export const alterTableCmd: Rule<AlterTableCmd> = or([
  alterTableAddConstraint,
  alterTableSetDefault,
  alterTableAddColumn,
  alterTableDropColumn,
]);
