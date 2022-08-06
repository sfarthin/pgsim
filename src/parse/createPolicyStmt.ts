import { CreatePolicyStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createPolicyStmt: Rule<{
  value: { CreatePolicyStmt: CreatePolicyStmt },
  eos: EOS,
}> = fail;
