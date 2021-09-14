import { AlterOwnerStmt } from "../types";
import comment from "./comment";
import { Formatter } from "./util";

export default function alterOwnerStmt<T>(
  c: AlterOwnerStmt,
  f: Formatter<T>
): T[][] {
  const { keyword, _, identifier, symbol } = f;
  return [
    ...comment(c.codeComment, f),
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
