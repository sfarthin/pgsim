import { FetchStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const fetchStmt: Rule<{
  value: { FetchStmt: FetchStmt },
  eos: EOS,
}> = fail;
