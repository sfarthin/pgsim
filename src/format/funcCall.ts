import { FuncCall } from "../types";
import { rawValue } from "./rawExpr";
import { Formatter, join } from "./util";

export default function funcCall<T>(c: FuncCall, f: Formatter<T>): T[] {
  const { symbol, identifier, _ } = f;
  return [
    ...(c.funcname.length === 2
      ? [
          identifier(c.funcname[0].String.str),
          symbol("."),
          identifier(c.funcname[1].String.str),
        ]
      : [identifier(c.funcname[0].String.str)]),
    symbol("("),

    // foo, goo, etc
    ...(c.args
      ? join(
          c.args.map((p) => rawValue(p, f)),
          [symbol(","), _]
        )
      : []),
    symbol(")"),
  ];
}
