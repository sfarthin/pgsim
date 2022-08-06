import { AlterDefaultPrivilegesStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const alterDefaultPrivilegesStmt: Rule<{
  value: { AlterDefaultPrivilegesStmt: AlterDefaultPrivilegesStmt },
  eos: EOS,
}> = fail;
