import { CreateOpClassStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createOpClassStmt: Rule<{
  value: { CreateOpClassStmt: CreateOpClassStmt },
  eos: EOS,
}> = fail;
