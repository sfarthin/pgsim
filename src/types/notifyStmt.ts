import * as d from "decoders";

export const notifyStmtDecoder = d.fail("NotifyStmt not implemented");
export type NotifyStmt = d.DecoderType<typeof notifyStmtDecoder>;
