import { SecLabelStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const secLabelStmt: Rule<{
  value: { SecLabelStmt: SecLabelStmt },
  eos: EOS,
}> = fail;
