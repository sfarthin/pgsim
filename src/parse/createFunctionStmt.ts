import { CreateFunctionStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createFunctionStmt: Rule<{
  value: { CreateFunctionStmt: CreateFunctionStmt },
  eos: EOS,
}> = fail;
