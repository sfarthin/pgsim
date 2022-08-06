import { NotifyStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const notifyStmt: Rule<{
  value: { NotifyStmt: NotifyStmt },
  eos: EOS,
}> = fail;
