import * as d from "decoders";

export const createTableAsStmtDecoder = d.fail(
  "CreateTableAsStmt not implemented"
);
export type CreateTableAsStmt = d.DecoderType<typeof createTableAsStmtDecoder>;
