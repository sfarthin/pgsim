import { CreateConversionStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createConversionStmt: Rule<{
  value: { CreateConversionStmt: CreateConversionStmt },
  eos: EOS,
}> = fail;
