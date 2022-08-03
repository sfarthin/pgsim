import * as d from "decoders";

export const defineStmtDecoder = d.fail("DefineStmt not implemented");
export type DefineStmt = d.DecoderType<typeof defineStmtDecoder>;
