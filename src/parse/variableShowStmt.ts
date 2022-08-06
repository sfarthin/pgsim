import { VariableShowStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const variableShowStmt: Rule<{
  value: { VariableShowStmt: VariableShowStmt },
  eos: EOS,
}> = fail;
