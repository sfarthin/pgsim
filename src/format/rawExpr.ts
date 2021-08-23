import { RawValue } from "../types";
import typeCast from "./typeCast";
import aConst from "./aConst";
import funcCall from "./funcCall";
import aExpr from "./aExpr";
import columnRef from "./columnRef";
import boolExpr from "./boolExpr";
import rowExpr from "./rowExpr";
import sublink from "./sublink";
import caseExpr from "./caseExpr";
import nullTest from "./nullTest";
import aIndirection from "./aIndirection";
import { Formatter } from "./util";

export function rawValue<T>(
  c: RawValue,
  f: Formatter<T>,
  includeParens?: boolean
): T[][] {
  if ("TypeCast" in c) {
    return [typeCast(c.TypeCast, f)];
  } else if ("A_Const" in c) {
    return [aConst(c.A_Const, f)];
  } else if ("FuncCall" in c) {
    return [funcCall(c.FuncCall, f)];
  } else if ("ColumnRef" in c) {
    return [columnRef(c.ColumnRef, f)];
  } else if ("RowExpr" in c) {
    return [rowExpr(c.RowExpr, f)];
  } else if ("NullTest" in c) {
    return [nullTest(c.NullTest, f)];
  } else if ("A_Expr" in c) {
    return aExpr(c.A_Expr, f);
  } else if ("BoolExpr" in c) {
    return boolExpr(c.BoolExpr, f, includeParens);
  } else if ("SubLink" in c) {
    return sublink(c.SubLink, f);
  } else if ("CaseExpr" in c) {
    return caseExpr(c.CaseExpr, f);
  } else if ("A_Indirection" in c) {
    return aIndirection(c.A_Indirection, f);
  }

  throw new Error(`RawValue not handled: ${Object.keys(c)[0]}`);
}
