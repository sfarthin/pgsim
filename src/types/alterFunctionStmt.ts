import * as d from "decoders";

export const alterFunctionStmtDecoder = d.fail(
  "AlterFunctionStmt not implemented"
);
export type AlterFunctionStmt = d.DecoderType<typeof alterFunctionStmtDecoder>;
