import * as d from "decoders";

export const lockStmtDecoder = d.fail("LockStmt not implemented");
export type LockStmt = d.DecoderType<typeof lockStmtDecoder>;
