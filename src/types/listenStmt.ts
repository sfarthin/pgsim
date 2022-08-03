import * as d from "decoders";

export const listenStmtDecoder = d.fail("ListenStmt not implemented");
export type ListenStmt = d.DecoderType<typeof listenStmtDecoder>;
