import { ClosePortalStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const closePortalStmt: Rule<{
  value: { ClosePortalStmt: ClosePortalStmt },
  eos: EOS,
}> = fail;
