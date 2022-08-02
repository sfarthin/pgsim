import { IndexStmt } from "~/types";
import { Block, join, comment, keyword, identifier, _, symbol } from "./util";

export default function (c: IndexStmt): Block {
  return [
    ...comment(c.codeComment),
    // Lets fit this on one line.
    [
      keyword("CREATE"),
      ...(c.unique ? [_, keyword("UNIQUE")] : []),
      _,
      keyword("INDEX"),
      ...(c.idxname ? [_, identifier(c.idxname)] : []),
      _,
      keyword("ON"),
      _,
      identifier(c.relation.relname),
      ...(c.accessMethod && c.accessMethod !== "btree"
        ? [_, keyword("USING"), _, identifier(c.accessMethod)]
        : []),
      _,
      symbol("("),
      ...join(
        c.indexParams.map((v) => [identifier(v.IndexElem.name)]),
        [symbol(","), _]
      ),
      symbol(")"),
      symbol(";"),
    ],
  ];
}
