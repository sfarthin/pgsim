import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { DefElem, defElemDecoder } from "./defElem";

export type CreateSeqStmt = {
  sequence: RangeVar;
  options?: { DefElem: DefElem }[];
  if_not_exists?: boolean;
  codeComment?: string;
};

export const createSeqStmtDecoder: d.Decoder<CreateSeqStmt> = d.exact({
  sequence: rangeVarDecoder,
  options: d.optional(d.array(d.exact({ DefElem: defElemDecoder }))),
  if_not_exists: d.optional(d.boolean),
  codeComment: d.optional(d.string),
});
