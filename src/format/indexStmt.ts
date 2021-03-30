import { IndexStmt } from "../types";
import comment from "./comment";
import { Formatter, join } from "./util";

export default function <T>(c: IndexStmt, f: Formatter<T>): T[][] {
  const { keyword, identifier, _, symbol } = f;

  return [
    ...comment(c.codeComment, f),
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
      identifier(c.relation.RangeVar.relname),
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
