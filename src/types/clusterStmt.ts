import * as d from "decoders";

export const clusterStmtDecoder = d.fail("ClusterStmt not implemented");
export type ClusterStmt = d.DecoderType<typeof clusterStmtDecoder>;
