import { AlterRoleStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const alterRoleStmt: Rule<{
  value: { AlterRoleStmt: AlterRoleStmt },
  eos: EOS,
}> = fail;
