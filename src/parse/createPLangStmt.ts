import { CreatePLangStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createPLangStmt: Rule<{
  value: { CreatePLangStmt: CreatePLangStmt },
  eos: EOS,
}> = fail;
