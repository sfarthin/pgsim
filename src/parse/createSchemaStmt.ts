import { CreateSchemaStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createSchemaStmt: Rule<{
  value: { CreateSchemaStmt: CreateSchemaStmt },
  eos: EOS,
}> = fail;
