import * as d from "decoders";

export const alterOpFamilyStmtDecoder = d.fail(
  "AlterOpFamilyStmt not implemented"
);
export type AlterOpFamilyStmt = d.DecoderType<typeof alterOpFamilyStmtDecoder>;
