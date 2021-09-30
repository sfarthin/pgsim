import {
  AlterTableCmd,
  AlterTableSetDefault,
  AlterTableAddColumn,
  AlterTableCmdSubType,
  AlterTableDropColumn,
  AlterTableAddConstraint,
  AlterTableDropNotNull,
  AlterTableColumnType,
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
} from "./util";
import { typeName } from "./typeName";
import { constraint } from "./constraint";

const alterTableAddConstraint: Rule<AlterTableAddConstraint> = transform(
  sequence([__, ADD, __, constraint, __]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_AddConstraint,
      def: {
        Constraint: v[3].value,
      },
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(v[0], v[2], v[3].codeComment, v[4]),
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
      subtype: AlterTableCmdSubType.AT_DropColumn,
      behavior: v[9]?.value === "RESTRICT" ? "DROP_RESTRICT" : "DROP_RESTRICT",
      name: v[7],
      codeComment: combineComments(
        v[0],
        v[2],
        v[4],
        v[5]?.[1],
        v[6],
        v[8],
        v[10]
      ),
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
      subtype: AlterTableCmdSubType.AT_AddColumn,
      def: {
        ColumnDef: {
          colname: v[7].value,
          typeName: v[9].value,
          ...(listOfConstraints ? { constraints: listOfConstraints } : {}),
          is_local: true,
          location: v[7].pos,
          codeComment: "",
        },
      },
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(
        v[0],
        v[2],
        v[4],
        v[5]?.[1],
        v[5]?.[3],
        v[6],
        v[8],
        v[9].codeComment,
        v[10],
        ...(v[11]?.map((k) => combineComments(k[0], k[1].codeComment, k[2])) ??
          []),
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
    (ctx) => rawValue(ctx),
    __,
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_ColumnDefault,
      name: v[5],
      def: v[11].value,
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(
        v[0],
        v[2],
        v[4],
        v[6],
        v[8],
        v[10],
        v[11].codeComment,
        v[12]
      ),
    };
  }
);

const alterTableDropNotNull: Rule<AlterTableDropNotNull> = transform(
  sequence([
    __,
    ALTER,
    __,
    optional(COLUMN),
    __,
    identifier, // 5
    __,
    DROP,
    __,
    NOT,
    __, // 10
    NULL,
    __,
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_DropNotNull,
      name: v[5],
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(v[0], v[2], v[4], v[6], v[8], v[10], v[12]),
    };
  }
);

const alterTableDropConstraint: Rule<AlterTableSetDefault> = transform(
  sequence([
    __,
    ALTER,
    __,
    optional(COLUMN),
    __,
    identifier, // 5
    __,
    DROP,
    __,
    DEFAULT,
    __,
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_ColumnDefault,
      name: v[5],
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(v[0], v[2], v[4], v[6], v[8], v[10]),
    };
  }
);

const alterTableColumnType: Rule<AlterTableColumnType> = transform(
  sequence([
    __,
    ALTER,
    __,
    optional(COLUMN),
    __,
    transform(identifier, (v, ctx) => ({ value: v, pos: ctx.pos })), // 5
    __,
    TYPE,
    __,
    transform(typeName, (v, ctx) => ({ ...v, pos: ctx.pos })),
    __,
  ]),
  (v) => {
    return {
      subtype: AlterTableCmdSubType.AT_AlterColumnType,
      name: v[5].value,
      def: {
        ColumnDef: {
          typeName: v[9].value,
          location: v[5].pos,
        },
      },
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(v[0], v[2], v[4], v[6], v[8], v[10]),
    };
  }
);

export const alterTableCmd: Rule<AlterTableCmd> = or([
  alterTableAddConstraint,
  alterTableSetDefault,
  alterTableAddColumn,
  alterTableDropColumn,
  alterTableDropNotNull,
  alterTableDropConstraint,
  alterTableColumnType,
]);
