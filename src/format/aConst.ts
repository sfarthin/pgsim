import { A_Const } from "../types";
import { Formatter } from "./util";

export default function aConst<T>(aConst: A_Const, f: Formatter<T>): T[] {
  const { literal } = f;

  if ("String" in aConst.val) {
    return [literal(`'${aConst.val.String.str}'`)];
  }

  if ("Float" in aConst.val) {
    return [literal(aConst.val.Float.str)];
  }

  if ("Integer" in aConst.val) {
    return [literal(`${aConst.val.Integer.ival}`)];
  }

  return [literal("NULL")];
}
