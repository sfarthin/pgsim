import { CreateTableAsStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createTableAsStmt: Rule<{
  value: { CreateTableAsStmt: CreateTableAsStmt },
  eos: EOS,
}> = fail;
