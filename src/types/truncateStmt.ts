import * as d from "decoders";

export const truncateStmtDecoder = d.fail("TruncateStmt not implemented");
export type TruncateStmt = d.DecoderType<typeof truncateStmtDecoder>;
