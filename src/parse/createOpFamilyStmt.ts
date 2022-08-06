import { CreateOpFamilyStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createOpFamilyStmt: Rule<{
  value: { CreateOpFamilyStmt: CreateOpFamilyStmt },
  eos: EOS,
}> = fail;
