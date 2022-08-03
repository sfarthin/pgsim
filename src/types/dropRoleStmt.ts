import * as d from "decoders";

export const dropRoleStmtDecoder = d.fail("DropRoleStmt not implemented");
export type DropRoleStmt = d.DecoderType<typeof dropRoleStmtDecoder>;
