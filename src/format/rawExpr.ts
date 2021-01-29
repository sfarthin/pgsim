import { RawExpr } from "../types";
import typeCast from "./typeCast";
import aConst from "./aConst";
import funcCall from "./funcCall";

export default function rawExpr(c: RawExpr): string {
  if ("TypeCast" in c) {
    return typeCast(c.TypeCast);
  } else if ("A_Const" in c) {
    return aConst(c.A_Const);
  } else if ("FuncCall" in c) {
    return funcCall(c.FuncCall);
  }

  throw new Error("Not handled");
}
