import { string, exact, Decoder, optional, array, unknown } from "decoders";
import { Location, locationDecoder } from "./location";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type ResTargetInsert = {
  name?: string;
  location: Location;
  indirection?: unknown;
};

export const resTargetInsertDecoder: Decoder<ResTargetInsert> = exact({
  name: optional(string),
  location: locationDecoder,
  indirection: unknown,
});

export type InsertStmt = {
  relation: {
    RangeVar: RangeVar;
  };
  cols?:
    | {
        ResTarget: ResTargetInsert;
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
  cols: optional(array(exact({ ResTarget: resTargetInsertDecoder }))),
  selectStmt: optional(exact({ SelectStmt: unknown })),
  returningList: unknown,
  override: unknown,
  onConflictClause: unknown,
});
