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
import { Block } from "./util";

export function rawValue(c: RawValue, includeParens?: boolean): Block {
  if ("TypeCast" in c) {
    return [typeCast(c.TypeCast)];
  } else if ("A_Const" in c) {
    return [aConst(c.A_Const)];
  } else if ("FuncCall" in c) {
    return [funcCall(c.FuncCall)];
  } else if ("ColumnRef" in c) {
    return [columnRef(c.ColumnRef)];
  } else if ("RowExpr" in c) {
    return [rowExpr(c.RowExpr)];
  } else if ("NullTest" in c) {
    return [nullTest(c.NullTest)];
  } else if ("A_Expr" in c) {
    return aExpr(c.A_Expr, includeParens);
  } else if ("BoolExpr" in c) {
    return boolExpr(c.BoolExpr, includeParens);
  } else if ("SubLink" in c) {
    return sublink(c.SubLink);
  } else if ("CaseExpr" in c) {
    return caseExpr(c.CaseExpr);
  } else if ("A_Indirection" in c) {
    return aIndirection(c.A_Indirection);
  }

  throw new Error(`RawValue not handled: ${Object.keys(c)[0]}`);
}
