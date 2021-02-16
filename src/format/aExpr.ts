import { AExpr } from "../types";
import rawExpr from "./rawExpr";

export default function aExpr(c: AExpr) {
  return `${rawExpr(c.lexpr)} ${c.name[0].String.str} ${rawExpr(c.rexpr)}`;
}
