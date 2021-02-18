import { VariableSetStmt } from "../types";
import aConst from "./aConst";
import comment from "./comment";

export default function variableSetStmt(
  variableSetStmt: VariableSetStmt
): string {
  const c = variableSetStmt.args?.[0].A_Const;

  if (!c) {
    throw new Error();
  }

  return `${comment(variableSetStmt.codeComment)}SET ${
    variableSetStmt.name
  } = ${aConst(c)};\n`;
}
