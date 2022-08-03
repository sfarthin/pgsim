import * as d from "decoders";

export const explainStmtDecoder = d.fail("ExplainStmt not implemented");
export type ExplainStmt = d.DecoderType<typeof explainStmtDecoder>;
