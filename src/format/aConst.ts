import { A_Const } from "~/types";
import {
  Line,
  stringLiteral,
  floatLiteral,
  integerLiteral,
  NULL,
} from "./util";

export default function aConst(aConst: A_Const): Line {
  if ("String" in aConst.val) {
    return [stringLiteral(aConst.val.String.str)];
  }

  if ("Float" in aConst.val) {
    return [floatLiteral(aConst.val.Float.str)];
  }

  if ("Integer" in aConst.val) {
    return [integerLiteral(aConst.val.Integer.ival)];
  }

  return [NULL];
}
