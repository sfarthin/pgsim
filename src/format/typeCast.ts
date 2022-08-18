import { TypeCast } from "../types/TypeCast";
import { rawValue } from "./rawExpr";
import { Line, TRUE, FALSE, symbol, _, keyword } from "./util";
import typeName from "./typeName";
import { defaultTypeMods } from "~/constants";

export default function (c: TypeCast): Line {
  const toBoolean = c.typeName.names?.[1]?.String.str === "bool";
  const toInterval = c.typeName.names?.[1]?.String.str === "interval";
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

  if (toInterval && c.arg) {
    const val = c.typeName.typmods?.[0].A_Const.val;
    const modeNum = (val && "Integer" in val && val.Integer.ival) ?? null;
    const [foundMod] = Object.entries(defaultTypeMods).find(
      ([_key, value]) => value === modeNum
    ) ?? [""];

    return [
      keyword("interval"),
      _,
      ...rawValue(c.arg).flat(),
      keyword(foundMod.replace(/interval/, "")),
    ];
  }

  if (c.arg) {
    return [...rawValue(c.arg).flat(), symbol("::"), ...typeName(c.typeName)];
  }

  throw new Error("Not handled");
}
