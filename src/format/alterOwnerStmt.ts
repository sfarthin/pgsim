import { AlterOwnerStmt } from "../types";
import { comment, keyword, _, identifier, symbol, Block } from "./util";

export default function alterOwnerStmt(c: AlterOwnerStmt): Block {
  return [
    ...comment(c.codeComment),
    [
      keyword("ALTER"),
      _,
      keyword("TYPE"),
      _,
      identifier(c.object.List.items[0].String.str),
      _,
      keyword("OWNER"),
      _,
      keyword("TO"),
      _,
      identifier(c.newowner.rolename),
      symbol(";"),
    ],
  ];
}
