import { VariableSetStmt } from "../toParser/variableSetStmt";
import aConst from "./aConst";

export default function variableSetStmt(
  variableSetStmt: VariableSetStmt
): string {
  const c = variableSetStmt.args?.[0].A_Const;

  if (!c) {
    throw new Error();
  }

  return `SET ${variableSetStmt.name} = ${aConst(c)};`;
}
