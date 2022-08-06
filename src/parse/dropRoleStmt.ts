import { DropRoleStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const dropRoleStmt: Rule<{
  value: { DropRoleStmt: DropRoleStmt },
  eos: EOS,
}> = fail;
