import { A_Const } from "../toParser/constant";

export default function aConst(aConst: A_Const): string {
  if ("String" in aConst.val) {
    return `'${aConst.val.String.str}'`;
  }

  if ("Float" in aConst.val) {
    return aConst.val.Float.str;
  }

  if ("Integer" in aConst.val) {
    return `${aConst.val.Integer.ival}`;
  }

  return "null";
}
