import * as d from "decoders";

export const alterObjectSchemaStmtDecoder = d.fail(
  "AlterObjectSchemaStmt not implemented"
);
export type AlterObjectSchemaStmt = d.DecoderType<
  typeof alterObjectSchemaStmtDecoder
>;
