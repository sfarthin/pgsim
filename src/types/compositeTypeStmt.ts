import * as d from "decoders";

export const compositeTypeStmtDecoder = d.fail(
  "CompositeTypeStmt not implemented"
);
export type CompositeTypeStmt = d.DecoderType<typeof compositeTypeStmtDecoder>;
