import { DeleteStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const deleteStmt: Rule<{
  value: { DeleteStmt: DeleteStmt },
  eos: EOS,
}> = fail;
