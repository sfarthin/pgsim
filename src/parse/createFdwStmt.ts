import { CreateFdwStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createFdwStmt: Rule<{
  value: { CreateFdwStmt: CreateFdwStmt },
  eos: EOS,
}> = fail;
