import { UnlistenStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const unlistenStmt: Rule<{
  value: { UnlistenStmt: UnlistenStmt },
  eos: EOS,
}> = fail;
