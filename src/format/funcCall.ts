import { FuncCall } from "~/types";
import { rawValue } from "./rawExpr";
import { Line, join, identifier, symbol, _, keyword } from "./util";

export default function funcCall(c: FuncCall): Line {
  return [
    ...(c.funcname.length === 2
      ? [
          identifier(c.funcname[0].String.str),
          symbol("."),
          identifier(c.funcname[1].String.str),
        ]
      : [identifier(c.funcname[0].String.str)]),
    symbol("("),

    ...("agg_distinct" in c ? [keyword("DISTINCT"), _] : []),
    ...("agg_star" in c ? [symbol("*")] : []),

    // foo, goo, etc
    ...(c.args
      ? join(c.args.map((p) => rawValue(p)).flat(), [symbol(","), _])
      : []),
    symbol(")"),
  ];
}
