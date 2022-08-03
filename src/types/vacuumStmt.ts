import * as d from "decoders";

export const vacuumStmtDecoder = d.fail("VacuumStmt not implemented");
export type VacuumStmt = d.DecoderType<typeof vacuumStmtDecoder>;
