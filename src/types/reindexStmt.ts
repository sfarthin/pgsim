import * as d from "decoders";

export const reindexStmtDecoder = d.fail("ReindexStmt not implemented");
export type ReindexStmt = d.DecoderType<typeof reindexStmtDecoder>;
