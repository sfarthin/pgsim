import { CaseWhen } from "../types";
import { Formatter, join } from "./util";
import { rawValue, rawCondition } from "./rawExpr";

export default function caseWhen<T>(c: CaseWhen, f: Formatter<T>): T[][] {
  const { symbol, _, keyword, indent } = f;

  return [
    [keyword("WHEN")],
    ...indent(rawCondition(c.expr, f)),
    [keyword("THEN")],
    indent(rawValue(c.result, f)),
  ];
}
