import { RuleStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const ruleStmt: Rule<{
  value: { RuleStmt: RuleStmt },
  eos: EOS,
}> = fail;
