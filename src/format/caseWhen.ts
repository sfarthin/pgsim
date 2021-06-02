import { CaseWhen } from "../types";
import { Formatter } from "./util";
import { rawValue } from "./rawExpr";

export default function caseWhen<T>(c: CaseWhen, f: Formatter<T>): T[][] {
  const { symbol, _, keyword, indent } = f;

  return [
    [keyword("WHEN")],
    ...indent(rawValue(c.expr, f)),
    [keyword("THEN")],
    indent(rawValue(c.result, f).flat()),
  ];
}
