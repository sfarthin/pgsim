import * as d from "decoders";

export const commentStmtDecoder = d.fail("CommentStmt not implemented");
export type CommentStmt = d.DecoderType<typeof commentStmtDecoder>;
