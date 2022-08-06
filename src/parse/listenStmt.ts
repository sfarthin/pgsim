import { ListenStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const listenStmt: Rule<{
  value: { ListenStmt: ListenStmt },
  eos: EOS,
}> = fail;
