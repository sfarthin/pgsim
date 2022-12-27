import { FuncCall } from "~/types";
import { rawValue } from "./rawExpr";
import sortBy from "./sortBy";
import {
  join,
  identifier,
  symbol,
  _,
  keyword,
  Block,
  toSingleLineIfPossible,
} from "./util";

export default function funcCall(c: FuncCall): Block {
  return toSingleLineIfPossible([
    [
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
    ],

    ...(c.agg_order ? sortBy(c.agg_order) : []),

    [symbol(")")],
  ]);
}
