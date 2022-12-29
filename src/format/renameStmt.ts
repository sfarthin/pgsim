import { RenameStmt, RenameType } from "~/types";
import rangeVar from "./rangeVar";
import { comment, keyword, stringLiteral, symbol, Block, _ } from "./util";

export default function (c: RenameStmt): Block {
  switch (c.renameType) {
    case RenameType.OBJECT_COLUMN: {
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
    case RenameType.OBJECT_TABLE: {
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
          keyword("TO"),
          _,
          stringLiteral(c.newname),
          symbol(";"),
        ],
      ];
    }
    default:
      throw new Error("unknown renameStmt");
  }
}
