import { AlterFunctionStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const alterFunctionStmt: Rule<{
  value: { AlterFunctionStmt: AlterFunctionStmt },
  eos: EOS,
}> = fail;
