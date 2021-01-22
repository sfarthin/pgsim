import { TypeCast } from "~/types/TypeCast";

export default function (c: TypeCast): string {
  const toBoolean = c.typeName.TypeName.names?.[1].String.str === "bool";
  const strKeyword =
    c.arg?.A_Const.val && "String" in c.arg?.A_Const.val
      ? c.arg?.A_Const.val.String.str
      : null;

  if (toBoolean) {
    if (strKeyword === "t") {
      return "TRUE";
    }

    if (strKeyword === "f") {
      return "FALSE";
    }
  }

  throw new Error("Not handled");
}
