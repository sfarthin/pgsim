import { FuncCall } from "../types";
import rawExpr from "./rawExpr";

export default function funcCall(c: FuncCall): string {
  return `${c.funcname.map((l) => l.String.str).join(".")}(${
    c.args ? c.args.map((p) => rawExpr(p)).join(", ") : ""
  })`;
}
