import { CommentStmt } from "~/types";
import {
  addToLastLine,
  Block,
  identifier,
  keyword,
  stringLiteral,
  symbol,
  _,
} from "./util";

const objectType = (c: CommentStmt): Block => {
  switch (c.objtype) {
    case "OBJECT_COLUMN": {
      if (c.object.List.items.length === 2) {
        return [
          [
            keyword("COLUMN"),
            _,
            identifier(c.object.List.items[0].String.str),
            symbol("."),
            identifier(c.object.List.items[1].String.str),
          ],
        ];
      } else {
        return [
          [keyword("COLUMN"), _, identifier(c.object.List.items[0].String.str)],
        ];
      }
    }
    default: {
      throw new Error("Unknown objtype");
    }
  }
};

export default function (c: CommentStmt): Block {
  return addToLastLine(
    [
      [keyword("COMMENT"), _, keyword("ON")],
      ...objectType(c),
      [keyword("IS"), _, stringLiteral(c.comment)],
    ],
    [symbol(";")]
  );
}
