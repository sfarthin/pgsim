import { CaseExpr } from "../types";
import { _, keyword, indent, Block } from "./util";
import caseWhen from "./caseWhen";
import { rawValue } from "./rawExpr";

export default function caseExpr(c: CaseExpr): Block {
  const when = c.args.map((a) => caseWhen(a.CaseWhen)).flat();

  const elseClause = c.defresult
    ? [[keyword("ELSE"), _, ...rawValue(c.defresult).flat()]]
    : [];

  return [
    [keyword("CASE")],
    ...indent([...when, ...elseClause]),
    [keyword("END")],
  ];
}
