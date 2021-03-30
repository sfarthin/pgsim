import { ViewStmt } from "../types";
import { innerSelect } from "./selectStmt";
import comment from "./comment";
import { Formatter } from "./util";

export default function viewStmt<T>(c: ViewStmt, f: Formatter<T>): T[][] {
  const { keyword, _, identifier, symbol, indent } = f;

  return [
    ...comment(c.codeComment, f),
    [
      keyword("CREATE"),
      _,
      keyword("VIEW"),
      _,
      identifier(c.view.RangeVar.relname),
      _,
      keyword("AS"),
      _,
      symbol("("),
    ],
    ...indent(innerSelect(c.query.SelectStmt, f)),
    [symbol(")"), symbol(";")],
  ];
}
