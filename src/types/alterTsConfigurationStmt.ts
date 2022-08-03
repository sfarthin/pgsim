import * as d from "decoders";

export const alterTsConfigurationStmtDecoder = d.fail(
  "AlterTSConfigurationStmt not implemented"
);
export type AlterTSConfigurationStmt = d.DecoderType<
  typeof alterTsConfigurationStmtDecoder
>;
