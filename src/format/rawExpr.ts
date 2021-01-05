import { RawExpr } from "~/types";
import typeCast from "./typeCast";
import aConst from "./aConst";

export default function rawExpr(c: RawExpr): string {
  if ("TypeCast" in c) {
    return typeCast(c.TypeCast);
  } else if ("A_Const" in c) {
    return aConst(c.A_Const);
  }

  throw new Error("Not handled");
}
