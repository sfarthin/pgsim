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
  return toSingleLineIfPossible(
    addToLastLine(
      [
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
        ]),

        ...indent(
          indent(
            c.indexParams.flatMap((v, i) =>
              addToLastLine(
                indexElem(v.IndexElem),
                i === c.indexParams.length - 1 ? [] : [symbol(",")]
              )
            )
          )
        ),

        indent([symbol(")")]),

        ...indent(
          c.whereClause
            ? addToFirstLine([keyword("WHERE"), _], rawValue(c.whereClause))
            : []
        ),
      ],
      [symbol(";")]
    )
  );
}
