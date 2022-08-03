import * as d from "decoders";

export const copyStmtDecoder = d.fail("CopyStmt not implemented");
export type CopyStmt = d.DecoderType<typeof copyStmtDecoder>;
