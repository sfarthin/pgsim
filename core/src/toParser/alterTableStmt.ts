import {
  array,
  string,
  exact,
  Decoder,
  number,
  constant,
  either7,
  mixed,
  either3,
  optional,
  either,
} from "decoders";
import {
  Relation,
  relationDecoder,
  ColumnDef,
  columnDefDecoder,
} from "./createStmt";
import { Constraint, constraintDecoder } from "./constraint";

export enum AlterTableCmdSubType {
  ADD = 0,
  ALTER_COLUMN = 3,
  ALTER_COLUMN_TYPE = 25,
  DROP = 10,
  ADD_CONSTRAINT = 14,
  DROP_CONSTRAINT = 22,
  OWNER = 27,
  INDEX = 36,
  INHERIT = 51,
  ROW_LEVEL_SECURITY = 56,
}

export type AlterTableCmd =
  | {
      subtype: AlterTableCmdSubType.ADD;
      def: {
        ColumnDef: ColumnDef;
      };
      behavior: number;
    }
  | {
      subtype: AlterTableCmdSubType.DROP;
      behavior: number;
      name?: string;
    }
  | {
      subtype: AlterTableCmdSubType.ADD_CONSTRAINT;
      def: {
        Constraint: Constraint;
      };
      behavior: number;
    }
  | {
      subtype: AlterTableCmdSubType.DROP_CONSTRAINT;
      name: string;
      behavior: number;
    }
  | {
      subtype:
        | AlterTableCmdSubType.ALTER_COLUMN
        | AlterTableCmdSubType.ALTER_COLUMN_TYPE;
      name: string;
      def: unknown;
      behavior: number;
    }
  | {
      subtype:
        | AlterTableCmdSubType.INHERIT
        | AlterTableCmdSubType.INDEX
        | AlterTableCmdSubType.OWNER;
      def: unknown;
      behavior: number;
      newowner?: unknown;
    }
  | {
      subtype: AlterTableCmdSubType.ROW_LEVEL_SECURITY;
      behavior: number;
    };

export const alterTableCmdDecoder: Decoder<AlterTableCmd> = either7(
  exact({
    subtype: constant(0),
    def: exact({
      ColumnDef: columnDefDecoder,
    }),
    behavior: number,
  }),
  exact({
    subtype: either(constant(3), constant(25)),
    name: string,
    def: mixed,
    behavior: number,
  }),
  exact({
    subtype: constant(10),
    behavior: number,
    name: optional(string),
  }),
  exact({
    subtype: constant(14),
    def: exact({
      Constraint: constraintDecoder,
    }),
    behavior: number,
  }),
  exact({
    subtype: constant(22),
    name: string,
    behavior: number,
  }),
  exact({
    subtype: either3(constant(51), constant(36), constant(27)),
    def: mixed,
    behavior: number,
    newowner: optional(mixed),
  }),
  exact({
    subtype: constant(56),
    behavior: number,
  })
);

export type AlterTableStmt = {
  relation: Relation;
  cmds: Array<{ AlterTableCmd: AlterTableCmd }>;
  relkind: number;
};

export const alterTableStmtDecoder: Decoder<AlterTableStmt> = exact({
  relation: relationDecoder,
  cmds: array(exact({ AlterTableCmd: alterTableCmdDecoder })),
  relkind: number,
});
