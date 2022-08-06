import { AlterTSDictionaryStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const alterTsDictionaryStmt: Rule<{
  value: { AlterTSDictionaryStmt: AlterTSDictionaryStmt },
  eos: EOS,
}> = fail;
