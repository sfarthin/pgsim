import * as d from "decoders";
import { rangeVarDecoder } from "./rangeVar";
import { rawValueDecoder } from "./rawExpr";
import { fromClauseDecoder } from "./fromClause";

export const deleteStmtDecoder = d.exact({
  relation: rangeVarDecoder,
  whereClause: d.optional(rawValueDecoder),
  usingClause: d.optional(d.array(fromClauseDecoder)),
  codeComment: d.optional(d.string),
});

export type DeleteStmt = d.DecoderType<typeof deleteStmtDecoder>;
