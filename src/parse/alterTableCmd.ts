import {
  AlterTableCmd,
  AlterTableSetDefault,
  AlterTableAddColumn,
  AlterTableCmdSubType,
  AlterTableDropColumn,
  AlterTableAddConstraint,
  AlterTableDropNotNull,
  AlterTableColumnType,
  AlterTableDropConstraint,
} from "../types";
import { rawValue } from "./rawExpr";
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
  NULL,
  TYPE,
  CONSTRAINT,
} from "./util";
import { typeName } from "./typeName";
import { constraint } from "./constraint";

const alterTableAddConstraint: Rule<AlterTableAddConstraint> = transform(
  sequence([ADD, __, constraint]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_AddConstraint,
      def: {
        Constraint: v[2].value,
      },
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(v[1], v[2].codeComment),
    };
  }
);

const alterTableDropColumn: Rule<AlterTableDropColumn> = transform(
  sequence([
    DROP,
    __,
    optional(COLUMN),
    __,
    optional(sequence([IF, __, EXISTS])), // 4
    __,
    identifier,
    __,
    optional(or([RESTRICT, CASCADE])),
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_DropColumn,
      behavior: v[8]?.value === "RESTRICT" ? "DROP_RESTRICT" : "DROP_RESTRICT",
      name: v[6],
      codeComment: combineComments(v[1], v[3], v[4]?.[1], v[5], v[7]),
    };
  }
);

const alterTableAddColumn: Rule<AlterTableAddColumn> = transform(
  sequence([
    ADD,
    __,
    optional(COLUMN),
    __,
    optional(sequence([IF, __, NOT, __, EXISTS])), // 5
    __,
    transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
    __,
    typeName,
    __, // 9
    optional(oneToMany(sequence([__, constraint, __]))),
  ]),
  (v) => {
    const listOfConstraints = v[10]?.map((e) => ({
      Constraint: e[1].value,
    }));

    return {
      subtype: AlterTableCmdSubType.AT_AddColumn,
      def: {
        ColumnDef: {
          colname: v[6].value,
          typeName: v[8].value,
          ...(listOfConstraints ? { constraints: listOfConstraints } : {}),
          is_local: true,
          location: v[6].pos,
          codeComment: "",
        },
      },
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(
        v[1],
        v[3],
        v[4]?.[1],
        v[4]?.[3],
        v[5],
        v[7],
        v[8].codeComment,
        v[9],
        ...(v[10]?.map((k) => combineComments(k[0], k[1].codeComment, k[2])) ??
          [])
      ),
    };
  }
);

const alterTableSetDefault: Rule<AlterTableSetDefault> = transform(
  sequence([
    ALTER,
    __,
    optional(COLUMN),
    __,
    identifier, // 4
    __,
    SET,
    __,
    DEFAULT,
    __, // 9
    (ctx) => rawValue(ctx),
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_ColumnDefault,
      name: v[4],
      def: v[10].value,
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(
        v[1],
        v[3],
        v[5],
        v[7],
        v[9],
        v[10].codeComment
      ),
    };
  }
);

const alterTableDropNotNull: Rule<AlterTableDropNotNull> = transform(
  sequence([
    ALTER,
    __,
    optional(COLUMN),
    __,
    identifier, // 4
    __,
    DROP,
    __,
    NOT,
    __, // 9
    NULL,
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_DropNotNull,
      name: v[4],
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(v[1], v[3], v[5], v[7], v[9]),
    };
  }
);

const alterTableDropDefault: Rule<AlterTableSetDefault> = transform(
  sequence([
    ALTER,
    __,
    optional(COLUMN),
    __,
    identifier, // 4
    __,
    DROP,
    __,
    DEFAULT,
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_ColumnDefault,
      name: v[4],
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(v[1], v[3], v[5], v[7]),
    };
  }
);

const alterTableDropConstraint: Rule<AlterTableDropConstraint> = transform(
  sequence([
    DROP,
    __,
    CONSTRAINT,
    __,
    identifier, // 4
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_DropConstraint,
      name: v[4],
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(v[1], v[3]),
    };
  }
);

const alterTableColumnType: Rule<AlterTableColumnType> = transform(
  sequence([
    ALTER,
    __,
    optional(COLUMN),
    __,
    transform(identifier, (v, ctx) => ({ value: v, pos: ctx.pos })), // 4
    __,
    TYPE,
    __,
    transform(typeName, (v, ctx) => ({ ...v, pos: ctx.pos })),
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_AlterColumnType,
      name: v[4].value,
      def: {
        ColumnDef: {
          typeName: v[8].value,
          location: v[4].pos,
        },
      },
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(v[1], v[3], v[5], v[7]),
    };
  }
);

export const alterTableCmd: Rule<AlterTableCmd> = or([
  alterTableDropConstraint,
  alterTableAddConstraint,
  alterTableSetDefault,
  alterTableAddColumn,
  alterTableDropColumn,
  alterTableDropNotNull,
  alterTableDropDefault,
  alterTableColumnType,
]);
