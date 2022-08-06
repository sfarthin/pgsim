import { CreateDomainStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createDomainStmt: Rule<{
  value: { CreateDomainStmt: CreateDomainStmt },
  eos: EOS,
}> = fail;
