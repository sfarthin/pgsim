import * as d from "decoders";

export const discardStmtDecoder = d.fail("DiscardStmt not implemented");
export type DiscardStmt = d.DecoderType<typeof discardStmtDecoder>;
