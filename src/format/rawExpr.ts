import { RawCondition } from "../types";
import typeCast from "./typeCast";
import aConst from "./aConst";
import funcCall from "./funcCall";
import aExpr from "./aExpr";
import columnRef from "./columnRef";
import boolExpr from "./boolExpr";
import rowExpr from "./rowExpr";

export default function rawExpr(
  c: RawCondition,
  includeParens?: boolean
): string {
  if ("TypeCast" in c) {
    return typeCast(c.TypeCast);
  } else if ("A_Const" in c) {
    return aConst(c.A_Const);
  } else if ("FuncCall" in c) {
    return funcCall(c.FuncCall);
  } else if ("A_Expr" in c) {
    return aExpr(c.A_Expr);
  } else if ("ColumnRef" in c) {
    return columnRef(c.ColumnRef);
  } else if ("BoolExpr" in c) {
    return boolExpr(c.BoolExpr, includeParens);
  } else if ("RowExpr" in c) {
    return rowExpr(c.RowExpr);
  }

  throw new Error(`Not handled: ${Object.keys(c)[0]}`);
}
