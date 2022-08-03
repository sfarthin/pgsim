import * as d from "decoders";

export const doStmtDecoder = d.fail("DoStmt not implemented");
export type DoStmt = d.DecoderType<typeof doStmtDecoder>;
