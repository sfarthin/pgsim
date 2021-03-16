import { AExpr, AExprKind } from "../types";
import rawExpr from "./rawExpr";

export default function aExpr(c: AExpr) {
  if (c.kind === AExprKind.AEXPR_OP) {
    return `${rawExpr(c.lexpr)} ${c.name[0].String.str} ${rawExpr(c.rexpr)}`;
  } else {
    return `${rawExpr(c.lexpr)} in (${c.rexpr
      .map((e) => rawExpr(e))
      .join(", ")})`;
  }
}
