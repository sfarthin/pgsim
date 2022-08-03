import * as d from "decoders";

export const deleteStmtDecoder = d.fail("DeleteStmt not implemented");
export type DeleteStmt = d.DecoderType<typeof deleteStmtDecoder>;
