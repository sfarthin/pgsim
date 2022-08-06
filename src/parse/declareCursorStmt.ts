import { DeclareCursorStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const declareCursorStmt: Rule<{
  value: { DeclareCursorStmt: DeclareCursorStmt },
  eos: EOS,
}> = fail;
