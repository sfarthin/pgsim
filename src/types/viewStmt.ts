import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";

export type ViewStmt = {
  view: { RangeVar: RangeVar };
  query: { SelectStmt: SelectStmt };
  withCheckOption: number;
  comment?: string;
};

export const viewStmtDecoder = d.exact({
  view: d.exact({ RangeVar: rangeVarDecoder }),
  query: d.exact({ SelectStmt: selectStmtDecoder }),
  withCheckOption: d.number,
  comment: d.optional(d.string),
});
