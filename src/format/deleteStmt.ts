import { DeleteStmt } from "~/types";
import rangeVar from "./rangeVar";
import { rawValue } from "./rawExpr";
import { fromClause } from "./selectStmt";
import {
  addToFirstLine,
  addToLastLine,
  Block,
  comment,
  indent,
  keyword,
  symbol,
  toSingleLineIfPossible,
  _,
} from "./util";

export default function (c: DeleteStmt): Block {
  const where = c.whereClause
    ? [[keyword("WHERE")], ...indent([...rawValue(c.whereClause)])]
    : [[]];
  const using = c.usingClause
    ? [[keyword("USING")], ...indent(fromClause(c.usingClause, []))]
    : [[]];

  return toSingleLineIfPossible([
    ...comment(c.codeComment),
    [keyword("DELETE"), _, keyword("FROM"), _, ...rangeVar(c.relation)],
    ...using,
    ...addToLastLine(where, [symbol(";")]),
  ]);
}
