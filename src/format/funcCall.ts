import { FuncCall } from "../types";
import rawExpr from "./rawExpr";

export default function funcCall(c: FuncCall): string {
  return `${c.funcname[0].String.str}(${
    c.args ? c.args.map((p) => rawExpr(p)).join(", ") : ""
  })`;
}
