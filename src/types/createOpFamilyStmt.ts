import * as d from "decoders";

export const createOpFamilyStmtDecoder = d.fail(
  "CreateOpFamilyStmt not implemented"
);
export type CreateOpFamilyStmt = d.DecoderType<
  typeof createOpFamilyStmtDecoder
>;
