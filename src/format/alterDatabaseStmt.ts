import { AlterDatabaseStmt } from "~/types";
import { comment, keyword, symbol, Block, _, identifier } from "./util";

export default function (c: AlterDatabaseStmt): Block {
  return [
    ...comment(c.codeComment),
    [
      keyword("ALTER"),
      _,
      keyword("DATABASE"),
      _,
      identifier(c.dbname),
      _,
      keyword("SET"),
      _,
      keyword("TABLESPACE"),
      _,
      identifier(c.options[0].DefElem.arg.String.str),
      symbol(";"),
    ],
  ];
}
