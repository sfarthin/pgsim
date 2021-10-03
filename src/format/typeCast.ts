import { TypeCast } from "../types/TypeCast";
import { rawValue } from "./rawExpr";
import { Line, TRUE, FALSE, symbol, identifier } from "./util";

export default function (c: TypeCast): Line {
  const toBoolean = c.typeName.names?.[1]?.String.str === "bool";
  const strKeyword =
    c.arg &&
    "A_Const" in c.arg &&
    c.arg.A_Const.val &&
    "String" in c.arg?.A_Const.val
      ? c.arg?.A_Const.val.String.str
      : null;

  if (toBoolean) {
    if (strKeyword === "t") {
      return [TRUE];
    }

    if (strKeyword === "f") {
      return [FALSE];
    }
  }

  if (c.arg) {
    return [
      ...rawValue(c.arg).flat(),
      symbol("::"),
      identifier(
        c.typeName.names.length === 1
          ? c.typeName.names[0].String.str
          : c.typeName.names[1].String.str
      ),
    ];
  }

  throw new Error("Not handled");
}
