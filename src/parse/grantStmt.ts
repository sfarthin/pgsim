import { GrantStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const grantStmt: Rule<{
  value: { GrantStmt: GrantStmt },
  eos: EOS,
}> = fail;
