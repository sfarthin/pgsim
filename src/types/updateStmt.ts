import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { ResTarget, resTargetDecoder } from "./resTarget";

export type UpdateStmt = {
  relation: RangeVar;
  targetList: { ResTarget: ResTarget }[];
  codeComment?: string;
};

export const updateStmtDecoder: d.Decoder<UpdateStmt> = d.exact({
  relation: rangeVarDecoder,
  targetList: d.array(d.exact({ ResTarget: resTargetDecoder })),
  codeComment: d.optional(d.string),
});
