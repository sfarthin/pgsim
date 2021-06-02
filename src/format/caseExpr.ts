import { CaseExpr } from "../types";
import { Formatter } from "./util";
import caseWhen from "./caseWhen";
import { rawValue } from "./rawExpr";

export default function caseExpr<T>(c: CaseExpr, f: Formatter<T>): T[][] {
  const { symbol, _, keyword, indent } = f;

  const when = c.args.map((a) => caseWhen(a.CaseWhen, f)).flat();

  const elseClause = c.defresult
    ? [[keyword("ELSE"), _, ...rawValue(c.defresult, f)]]
    : [];

  return [
    [keyword("CASE")],
    ...indent([...when, ...elseClause]),
    [keyword("END")],
  ];
}
