import { CreateEventTrigStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const createEventTrigStmt: Rule<{
  value: { CreateEventTrigStmt: CreateEventTrigStmt },
  eos: EOS,
}> = fail;
