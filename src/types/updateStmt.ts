import * as d from "decoders";
import { FromClause, fromClauseDecoder } from "./fromClause";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { RawValue, rawValueDecoder } from "./rawExpr";
import { ResTarget, resTargetDecoder } from "./resTarget";

export type UpdateStmt = {
  relation: RangeVar;
  targetList: { ResTarget: ResTarget }[];
  whereClause?: RawValue;
  fromClause?: FromClause[];
  codeComment?: string;
};

export const updateStmtDecoder: d.Decoder<UpdateStmt> = d.exact({
  relation: rangeVarDecoder,
  targetList: d.array(d.exact({ ResTarget: resTargetDecoder })),
  whereClause: d.optional(rawValueDecoder),
  fromClause: d.optional(d.array(fromClauseDecoder)),
  codeComment: d.optional(d.string),
});
