import { AlterOpFamilyStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const alterOpFamilyStmt: Rule<{
  value: { AlterOpFamilyStmt: AlterOpFamilyStmt },
  eos: EOS,
}> = fail;
