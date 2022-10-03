import { CreateTableAsStmt } from "~/types";
import { innerSelect } from "./selectStmt";

import { Block, keyword, _, comment, identifier, symbol, indent } from "./util";

export default function createTableAsStmt(c: CreateTableAsStmt): Block {
  return [
    ...comment(c.codeComment),
    [
      keyword("CREATE"),
      _,
      keyword("MATERIALIZED"),
      _,
      keyword("VIEW"),
      _,
      identifier(c.into.rel.relname),
      _,
      keyword("AS"),
      _,
      symbol("("),
    ],
    ...indent(innerSelect(c.query.SelectStmt)),
    [symbol(")"), symbol(";")],
  ];
}
