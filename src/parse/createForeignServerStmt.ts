import { CreateForeignServerStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createForeignServerStmt: Rule<{
  value: { CreateForeignServerStmt: CreateForeignServerStmt },
  eos: EOS,
}> = fail;
