import * as d from "decoders";

export const executeStmtDecoder = d.fail("ExecuteStmt not implemented");
export type ExecuteStmt = d.DecoderType<typeof executeStmtDecoder>;
