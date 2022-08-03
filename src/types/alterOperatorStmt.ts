import * as d from "decoders";

export const alterOperatorStmtDecoder = d.fail(
  "AlterOperatorStmt not implemented"
);
export type AlterOperatorStmt = d.DecoderType<typeof alterOperatorStmtDecoder>;
