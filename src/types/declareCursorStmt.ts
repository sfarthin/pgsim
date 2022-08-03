import * as d from "decoders";

export const declareCursorStmtDecoder = d.fail(
  "DeclareCursorStmt not implemented"
);
export type DeclareCursorStmt = d.DecoderType<typeof declareCursorStmtDecoder>;
