import * as d from "decoders";

export const createDomainStmtDecoder = d.fail(
  "CreateDomainStmt not implemented"
);
export type CreateDomainStmt = d.DecoderType<typeof createDomainStmtDecoder>;
