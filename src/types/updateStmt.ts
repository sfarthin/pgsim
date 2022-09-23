import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { RawValue, rawValueDecoder } from "./rawExpr";
import { ResTarget, resTargetDecoder } from "./resTarget";

export type UpdateStmt = {
  relation: RangeVar;
  targetList: { ResTarget: ResTarget }[];
  whereClause?: RawValue;
  codeComment?: string;
};

export const updateStmtDecoder: d.Decoder<UpdateStmt> = d.exact({
  relation: rangeVarDecoder,
  targetList: d.array(d.exact({ ResTarget: resTargetDecoder })),
  whereClause: d.optional(rawValueDecoder),
  codeComment: d.optional(d.string),
});
