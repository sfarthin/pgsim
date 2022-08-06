import { AlterTSConfigurationStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const alterTsConfigurationStmt: Rule<{
  value: { AlterTSConfigurationStmt: AlterTSConfigurationStmt },
  eos: EOS,
}> = fail;
