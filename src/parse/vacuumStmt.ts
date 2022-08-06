import { VacuumStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const vacuumStmt: Rule<{
  value: { VacuumStmt: VacuumStmt },
  eos: EOS,
}> = fail;
