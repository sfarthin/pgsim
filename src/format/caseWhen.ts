import { CaseWhen } from "../types";
import { keyword, indent, Block } from "./util";
import { rawValue } from "./rawExpr";

export default function caseWhen(c: CaseWhen): Block {
  return [
    [keyword("WHEN")],
    ...indent(rawValue(c.expr)),
    [keyword("THEN")],
    indent(rawValue(c.result).flat()),
  ];
}
