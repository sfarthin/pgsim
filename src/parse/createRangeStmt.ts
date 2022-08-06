import { CreateRangeStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createRangeStmt: Rule<{
  value: { CreateRangeStmt: CreateRangeStmt },
  eos: EOS,
}> = fail;
