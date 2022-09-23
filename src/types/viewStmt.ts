import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";

export type ViewStmt = {
  view: RangeVar;
  query: { SelectStmt: SelectStmt };
  withCheckOption: "NO_CHECK_OPTION";
  replace?: true;
  codeComment?: string;
};

export const viewStmtDecoder = d.exact({
  view: rangeVarDecoder,
  query: d.exact({ SelectStmt: selectStmtDecoder }),
  withCheckOption: d.constant("NO_CHECK_OPTION"),
  replace: d.optional(d.constant(true)),
  codeComment: d.optional(d.string),
});
