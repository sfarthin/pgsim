import { TruncateStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const truncateStmt: Rule<{
  value: { TruncateStmt: TruncateStmt },
  eos: EOS,
}> = fail;
