import { TypeCast } from "../types/TypeCast";
import { rawValue } from "./rawExpr";
import { Formatter } from "./util";

export default function <T>(c: TypeCast, f: Formatter<T>): T[] {
  const { literal, symbol, identifier } = f;
  const toBoolean = c.typeName.TypeName.names?.[1]?.String.str === "bool";
  const strKeyword =
    c.arg &&
    "A_Const" in c.arg &&
    c.arg.A_Const.val &&
    "String" in c.arg?.A_Const.val
      ? c.arg?.A_Const.val.String.str
      : null;

  if (toBoolean) {
    if (strKeyword === "t") {
      return [literal("TRUE")];
    }

    if (strKeyword === "f") {
      return [literal("FALSE")];
    }
  }

  if (c.arg) {
    return [
      ...rawValue(c.arg, f),
      symbol("::"),
      identifier(
        c.typeName.TypeName.names.length === 1
          ? c.typeName.TypeName.names[0].String.str
          : c.typeName.TypeName.names[1].String.str
      ),
    ];
  }

  throw new Error("Not handled");
}
