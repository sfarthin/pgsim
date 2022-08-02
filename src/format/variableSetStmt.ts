import { VariableSetStmt } from "~/types";
import aConst from "./aConst";
import { keyword, _, identifier, symbol, Block, comment } from "./util";

export default function variableSetStmt(
  variableSetStmt: VariableSetStmt
): Block {
  const c = variableSetStmt.args?.[0].A_Const;

  if (!c) {
    throw new Error();
  }

  return [
    ...comment(variableSetStmt.codeComment),
    // Always on one line.
    [
      keyword("SET"),
      _,
      identifier(variableSetStmt.name),
      _,
      symbol("="),
      _,
      ...aConst(c),
      symbol(";"),
    ],
  ];
}
