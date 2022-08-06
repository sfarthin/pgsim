import { ReindexStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const reindexStmt: Rule<{
  value: { ReindexStmt: ReindexStmt },
  eos: EOS,
}> = fail;
