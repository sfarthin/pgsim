import { RangeSubselect } from "../types";
import { Formatter } from "./util";
import { innerSelect } from "./selectStmt";

export default function rangeVar<T>(c: RangeSubselect, f: Formatter<T>): T[][] {
  const { keyword, _, identifier, symbol, indent } = f;

  return [
    [symbol("(")],
    ...indent(innerSelect(c.subquery.SelectStmt, f)),
    [symbol(")"), _, keyword("AS"), _, identifier(c.alias.Alias.aliasname)],
  ];
}
