import { RowExpr } from "../types";
import { rawValue } from "./rawExpr";
import { join, Line, symbol, _ } from "./util";

export default function rowExpr(c: RowExpr): Line {
  return [
    symbol("("),
    ...join(c.args.map((a) => rawValue(a)).flat(), [symbol(","), _]),
    symbol(")"),
  ];
}
