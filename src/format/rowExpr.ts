import { RowExpr } from "../types";
import { rawValue } from "./rawExpr";
import { Formatter, join } from "./util";

export default function rowExpr<T>(c: RowExpr, f: Formatter<T>): T[] {
  const { symbol, _ } = f;

  return [
    symbol("("),
    ...join(
      c.args.map((a) => rawValue(a, f)),
      [symbol(","), _]
    ),
    symbol(")"),
  ];
}
