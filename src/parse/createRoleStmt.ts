import { CreateRoleStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createRoleStmt: Rule<{
  value: { CreateRoleStmt: CreateRoleStmt },
  eos: EOS,
}> = fail;
