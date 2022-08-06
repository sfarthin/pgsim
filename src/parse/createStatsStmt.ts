import { CreateStatsStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createStatsStmt: Rule<{
  value: { CreateStatsStmt: CreateStatsStmt },
  eos: EOS,
}> = fail;
