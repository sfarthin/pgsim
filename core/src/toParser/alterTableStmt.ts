import {
  array,
  exact,
  Decoder,
  number,
  constant,
  either4,
  pojo,
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
  DROP = 10,
  ADD_CONSTRAINT = 14,
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
    }
  | {
      subtype: AlterTableCmdSubType.ADD_CONSTRAINT;
      def: {
        Constraint: Constraint;
      };
      behavior: number;
    }
  | {
      subtype: AlterTableCmdSubType.ALTER_COLUMN;
      name: string;
      def: unknown;
      behavior: number;
    };

export const alterTableCmdDecoder: Decoder<AlterTableCmd> = either4(
  exact({
    subtype: constant(0),
    def: exact({
      ColumnDef: columnDefDecoder,
    }),
    behavior: number,
  }),
  exact({
    subtype: constant(3),
    def: pojo,
    behavior: number,
  }),
  exact({
    subtype: constant(10),
    behavior: number,
  }),
  exact({
    subtype: constant(14),
    def: exact({
      Constraint: constraintDecoder,
    }),
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
