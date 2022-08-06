import { DefineStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const defineStmt: Rule<{
  value: { DefineStmt: DefineStmt },
  eos: EOS,
}> = fail;
