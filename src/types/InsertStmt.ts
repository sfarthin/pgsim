import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type ResTargetInsert = {
  name?: string;
  location: Location;
  indirection?: unknown;
};

export const resTargetInsertDecoder: d.Decoder<ResTargetInsert> = d.exact({
  name: d.optional(d.string),
  location: locationDecoder,
  indirection: d.unknown,
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

export const insertStmtDecoder: d.Decoder<InsertStmt> = d.exact({
  relation: d.exact({ RangeVar: rangeVarDecoder }),
  cols: d.optional(d.array(d.exact({ ResTarget: resTargetInsertDecoder }))),
  selectStmt: d.optional(d.exact({ SelectStmt: d.unknown })),
  returningList: d.unknown,
  override: d.unknown,
  onConflictClause: d.unknown,
});
