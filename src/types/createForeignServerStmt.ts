import * as d from "decoders";

export const createForeignServerStmtDecoder = d.fail(
  "CreateForeignServerStmt not implemented"
);
export type CreateForeignServerStmt = d.DecoderType<
  typeof createForeignServerStmtDecoder
>;
