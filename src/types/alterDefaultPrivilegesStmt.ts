import * as d from "decoders";

export const alterDefaultPrivilegesStmtDecoder = d.fail(
  "AlterDefaultPrivilegesStmt not implemented"
);
export type AlterDefaultPrivilegesStmt = d.DecoderType<
  typeof alterDefaultPrivilegesStmtDecoder
>;
