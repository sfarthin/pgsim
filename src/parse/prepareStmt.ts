import { PrepareStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const prepareStmt: Rule<{
  value: { PrepareStmt: PrepareStmt },
  eos: EOS,
}> = fail;
