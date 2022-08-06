import { CreateCastStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createCastStmt: Rule<{
  value: { CreateCastStmt: CreateCastStmt },
  eos: EOS,
}> = fail;
