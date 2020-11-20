import {
  string,
  number,
  exact,
  Decoder,
  optional,
  array,
  unknown,
} from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type ResTarget = {
  name?: string;
  location: number;
  indirection?: unknown;
};

export const resTargetDecoder: Decoder<ResTarget> = exact({
  name: optional(string),
  location: number,
  indirection: unknown,
});

export type InsertStmt = {
  relation: {
    RangeVar: RangeVar;
  };
  cols?:
    | {
        ResTarget: ResTarget;
      }[]
    | void;

  selectStmt?: {
    SelectStmt?: unknown;
  };

  returningList?: unknown;

  override?: unknown;

  onConflictClause?: unknown;
};

export const insertStmtDecoder: Decoder<InsertStmt> = exact({
  relation: exact({ RangeVar: rangeVarDecoder }),
  cols: optional(array(exact({ ResTarget: resTargetDecoder }))),
  selectStmt: optional(exact({ SelectStmt: unknown })),
  returningList: unknown,
  override: unknown,
  onConflictClause: unknown,
});
