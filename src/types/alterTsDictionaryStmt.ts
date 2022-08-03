import * as d from "decoders";

export const alterTsDictionaryStmtDecoder = d.fail(
  "AlterTSDictionaryStmt not implemented"
);
export type AlterTSDictionaryStmt = d.DecoderType<
  typeof alterTsDictionaryStmtDecoder
>;
