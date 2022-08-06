import { CompositeTypeStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const compositeTypeStmt: Rule<{
  value: { CompositeTypeStmt: CompositeTypeStmt },
  eos: EOS,
}> = fail;
