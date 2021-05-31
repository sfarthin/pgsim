import { CaseExpr } from "../types";
import { Formatter } from "./util";
import caseWhen from "./caseWhen";

export default function caseExpr<T>(c: CaseExpr, f: Formatter<T>): T[][] {
  const { symbol, _, keyword, indent } = f;

  const when = c.args.map((a) => caseWhen(a.CaseWhen, f)).flat();

  return [[keyword("CASE")], ...indent(when), [keyword("END")]];
}
