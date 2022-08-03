import * as d from "decoders";

export const createFunctionStmtDecoder = d.fail(
  "CreateFunctionStmt not implemented"
);
export type CreateFunctionStmt = d.DecoderType<
  typeof createFunctionStmtDecoder
>;
