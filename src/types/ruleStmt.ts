import * as d from "decoders";

export const ruleStmtDecoder = d.fail("RuleStmt not implemented");
export type RuleStmt = d.DecoderType<typeof ruleStmtDecoder>;
