import { IndexStmt } from "~/types";
import { rawValue } from "./rawExpr";
import { indexElem } from "./indexElem";
import {
  Block,
  join,
  comment,
  keyword,
  identifier,
  _,
  symbol,
  addToFirstLine,
  addToLastLine,
  toSingleLineIfPossible,
  indent,
} from "./util";

export default function (c: IndexStmt): Block {
  return toSingleLineIfPossible([
    ...comment(c.codeComment),
    // Lets fit this on one line.
    [
      keyword("CREATE"),
      ...(c.unique ? [_, keyword("UNIQUE")] : []),
      _,
      keyword("INDEX"),
      ...(c.concurrent ? [_, keyword("CONCURRENTLY")] : []),
      ...(c.idxname ? [_, identifier(c.idxname)] : []),
    ],
    indent([
      keyword("ON"),
      _,
      identifier(c.relation.relname),
      ...(c.accessMethod && c.accessMethod !== "btree"
        ? [_, keyword("USING"), _, identifier(c.accessMethod)]
        : []),
      _,
      symbol("("),
      ...join(
        c.indexParams.map((v) => indexElem(v.IndexElem)),
        [symbol(","), _]
      ),
      symbol(")"),
      ...(c.whereClause ? [] : [symbol(";")]),
    ]),
    ...indent(
      c.whereClause
        ? addToLastLine(
            addToFirstLine([keyword("WHERE"), _], rawValue(c.whereClause)),
            [symbol(";")]
          )
        : [[]]
    ),
  ]);
}
