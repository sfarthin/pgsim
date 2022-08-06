import { AlterObjectSchemaStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const alterObjectSchemaStmt: Rule<{
  value: { AlterObjectSchemaStmt: AlterObjectSchemaStmt },
  eos: EOS,
}> = fail;
