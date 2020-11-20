import { exact, Decoder, unknown } from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type CreateSeqStmt = {
  sequence: { RangeVar: RangeVar };
  options?: unknown;
};

export const createSeqStmtDecoder: Decoder<CreateSeqStmt> = exact({
  sequence: exact({ RangeVar: rangeVarDecoder }),
  options: unknown,
});
