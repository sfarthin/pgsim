import * as d from "decoders";

export const createConversionStmtDecoder = d.fail(
  "CreateConversionStmt not implemented"
);
export type CreateConversionStmt = d.DecoderType<
  typeof createConversionStmtDecoder
>;
