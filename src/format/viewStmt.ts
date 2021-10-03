import { ViewStmt } from "../types";
import { innerSelect } from "./selectStmt";

import { Block, keyword, _, comment, identifier, symbol, indent } from "./util";

export default function viewStmt(c: ViewStmt): Block {
  return [
    ...comment(c.codeComment),
    [
      keyword("CREATE"),
      _,
      keyword("VIEW"),
      _,
      identifier(c.view.relname),
      _,
      keyword("AS"),
      _,
      symbol("("),
    ],
    ...indent(innerSelect(c.query.SelectStmt)),
    [symbol(")"), symbol(";")],
  ];
}
