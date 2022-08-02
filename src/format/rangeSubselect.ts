import { RangeSubselect } from "~/types";
import { Block, identifier, keyword, _, symbol, indent } from "./util";
import { innerSelect } from "./selectStmt";

export default function (c: RangeSubselect): Block {
  return [
    [symbol("(")],
    ...indent(innerSelect(c.subquery.SelectStmt)),
    [symbol(")"), _, keyword("AS"), _, identifier(c.alias.aliasname)],
  ];
}
