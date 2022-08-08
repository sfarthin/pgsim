import { VariableSetStmt } from "~/types";
import aConst from "./aConst";
import typeCast from "./typeCast";
import { keyword, _, identifier, symbol, Block, comment } from "./util";

export default function variableSetStmt(
  variableSetStmt: VariableSetStmt
): Block {
  const arg = variableSetStmt.args?.[0];
  if (arg && "A_Const" in arg) {
    const c = arg.A_Const;

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
  } else if (arg && arg.TypeCast && variableSetStmt.name === "timezone") {
    return [
      ...comment(variableSetStmt.codeComment),
      // Always on one line.
      [
        keyword("SET"),
        _,
        keyword("TIME"),
        _,
        keyword("ZONE"),
        _,
        ...typeCast(arg.TypeCast),
        symbol(";"),
      ],
    ];
  }
  throw new Error();
}
