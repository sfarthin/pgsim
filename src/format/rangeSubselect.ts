import { RangeSubselect } from "../types";
import { Formatter } from "./util";
import { innerSelect } from "./selectStmt";
import identifier from "./identifier";

export default function <T>(c: RangeSubselect, f: Formatter<T>): T[][] {
  const { keyword, _, symbol, indent } = f;

  return [
    [symbol("(")],
    ...indent(innerSelect(c.subquery.SelectStmt, f)),
    [symbol(")"), _, keyword("AS"), _, identifier(c.alias.aliasname, f)],
  ];
}
