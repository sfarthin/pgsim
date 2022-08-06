import { CopyStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const copyStmt: Rule<{
  value: { CopyStmt: CopyStmt },
  eos: EOS,
}> = fail;
