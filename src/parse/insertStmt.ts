import { InsertStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const insertStmt: Rule<{
  value: { InsertStmt: InsertStmt },
  eos: EOS,
}> = fail;
