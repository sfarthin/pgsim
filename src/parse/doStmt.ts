import { DoStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const doStmt: Rule<{
  value: { DoStmt: DoStmt },
  eos: EOS,
}> = fail;
