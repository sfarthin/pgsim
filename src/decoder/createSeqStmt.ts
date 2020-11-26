import { exact, Decoder, optional, array } from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { DefElem, defElemDecoder } from "./defElem";

export type CreateSeqStmt = {
  sequence: { RangeVar: RangeVar };
  options?: { DefElem: DefElem }[];
};

export const createSeqStmtDecoder: Decoder<CreateSeqStmt> = exact({
  sequence: exact({ RangeVar: rangeVarDecoder }),
  options: optional(array(exact({ DefElem: defElemDecoder }))),
});
