import { ExecuteStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const executeStmt: Rule<{
  value: { ExecuteStmt: ExecuteStmt },
  eos: EOS,
}> = fail;
