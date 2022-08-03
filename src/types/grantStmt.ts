import * as d from "decoders";

export const grantStmtDecoder = d.fail("GrantStmt not implemented");
export type GrantStmt = d.DecoderType<typeof grantStmtDecoder>;
