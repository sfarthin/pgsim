import * as d from "decoders";

export const createSchemaStmtDecoder = d.fail(
  "CreateSchemaStmt not implemented"
);
export type CreateSchemaStmt = d.DecoderType<typeof createSchemaStmtDecoder>;
