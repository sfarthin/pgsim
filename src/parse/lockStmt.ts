import { LockStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const lockStmt: Rule<{
  value: { LockStmt: LockStmt },
  eos: EOS,
}> = fail;
