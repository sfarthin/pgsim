import { VariableSetStmt } from "../types";
import aConst from "./aConst";
import comment from "./comment";
import { Formatter } from "./util";

export default function variableSetStmt<T>(
  variableSetStmt: VariableSetStmt,
  f: Formatter<T>
): T[][] {
  const { keyword, _, identifier, symbol } = f;
  const c = variableSetStmt.args?.[0].A_Const;

  if (!c) {
    throw new Error();
  }

  return [
    ...comment(variableSetStmt.codeComment, f),
    // Always on one line.
    [
      keyword("SET"),
      _,
      identifier(variableSetStmt.name),
      _,
      symbol("="),
      _,
      ...aConst(c, f),
      symbol(";"),
    ],
  ];
}
