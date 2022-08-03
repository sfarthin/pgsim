import * as d from "decoders";

export const createPolicyStmtDecoder = d.fail(
  "CreatePolicyStmt not implemented"
);
export type CreatePolicyStmt = d.DecoderType<typeof createPolicyStmtDecoder>;
