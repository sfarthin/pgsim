import { exact, Decoder, optional, array, string } from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { DefElem, defElemDecoder } from "./defElem";

export type CreateSeqStmt = {
  sequence: { RangeVar: RangeVar };
  options?: { DefElem: DefElem }[];
  comment?: string;
};

export const createSeqStmtDecoder: Decoder<CreateSeqStmt> = exact({
  sequence: exact({ RangeVar: rangeVarDecoder }),
  options: optional(array(exact({ DefElem: defElemDecoder }))),
  comment: optional(string),
});
