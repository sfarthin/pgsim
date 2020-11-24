import createStmt from "./createStmt";
import variableSetStmt from "./variableSetStmt";
import createEnumStmt from "./createEnumStmt";
import createSeqStmt from "./createSeqStmt";
import { Stmt } from "../toParser";

export default function toString(stmt: Stmt): string {
  const s = stmt.RawStmt.stmt;
  if ("CreateStmt" in s) {
    return createStmt(s.CreateStmt);
  } else if ("VariableSetStmt" in s) {
    return variableSetStmt(s.VariableSetStmt);
  } else if ("CreateEnumStmt" in s) {
    return createEnumStmt(s.CreateEnumStmt);
  } else if ("CreateSeqStmt" in s) {
    return createSeqStmt(s.CreateSeqStmt);
  }

  throw new Error(`Cannot format ${Object.keys(s)}`);
}
