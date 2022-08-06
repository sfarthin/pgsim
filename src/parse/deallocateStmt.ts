import { DeallocateStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const deallocateStmt: Rule<{
  value: { DeallocateStmt: DeallocateStmt },
  eos: EOS,
}> = fail;
