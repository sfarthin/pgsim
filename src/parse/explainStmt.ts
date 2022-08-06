import { ExplainStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const explainStmt: Rule<{
  value: { ExplainStmt: ExplainStmt },
  eos: EOS,
}> = fail;
