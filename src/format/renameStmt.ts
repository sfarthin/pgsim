import { RenameStmt } from "../types";
import rangeVar from "./rangeVar";
import { Formatter } from "./util";
import comment from "./comment";

export default function <T>(c: RenameStmt, f: Formatter<T>): T[][] {
  const { keyword, _, literal, symbol } = f;

  return [
    ...comment(c.codeComment, f),
    [
      keyword("ALTER"),
      _,
      keyword("TABLE"),
      _,
      ...rangeVar(c.relation, f),
      _,
      keyword("RENAME"),
      _,
      keyword("COLUMN"),
      _,
      literal(`'${c.subname}'`),
      _,
      keyword("TO"),
      _,
      literal(`'${c.newname}'`),
      symbol(";"),
    ],
  ];
}
