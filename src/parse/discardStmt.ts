import { DiscardStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const discardStmt: Rule<{
  value: { DiscardStmt: DiscardStmt },
  eos: EOS,
}> = fail;
