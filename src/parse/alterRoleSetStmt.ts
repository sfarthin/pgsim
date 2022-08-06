import { AlterRoleSetStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const alterRoleSetStmt: Rule<{
  value: { AlterRoleSetStmt: AlterRoleSetStmt },
  eos: EOS,
}> = fail;
