import { AlterOperatorStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const alterOperatorStmt: Rule<{
  value: { AlterOperatorStmt: AlterOperatorStmt },
  eos: EOS,
}> = fail;
