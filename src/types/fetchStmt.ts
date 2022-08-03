import * as d from "decoders";

export const fetchStmtDecoder = d.fail("FetchStmt not implemented");
export type FetchStmt = d.DecoderType<typeof fetchStmtDecoder>;
