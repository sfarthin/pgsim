import * as d from "decoders";

export const deallocateStmtDecoder = d.fail("DeallocateStmt not implemented");
export type DeallocateStmt = d.DecoderType<typeof deallocateStmtDecoder>;
