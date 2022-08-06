import { CreateTrigStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createTrigStmt: Rule<{
  value: { CreateTrigStmt: CreateTrigStmt },
  eos: EOS,
}> = fail;
