import * as d from "decoders";

export const alterRoleSetStmtDecoder = d.fail(
  "AlterRoleSetStmt not implemented"
);
export type AlterRoleSetStmt = d.DecoderType<typeof alterRoleSetStmtDecoder>;
