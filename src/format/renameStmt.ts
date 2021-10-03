import { RenameStmt } from "../types";
import rangeVar from "./rangeVar";
import { comment, keyword, stringLiteral, symbol, Block, _ } from "./util";

export default function (c: RenameStmt): Block {
  return [
    ...comment(c.codeComment),
    [
      keyword("ALTER"),
      _,
      keyword("TABLE"),
      _,
      ...rangeVar(c.relation),
      _,
      keyword("RENAME"),
      _,
      keyword("COLUMN"),
      _,
      stringLiteral(c.subname),
      _,
      keyword("TO"),
      _,
      stringLiteral(c.newname),
      symbol(";"),
    ],
  ];
}
