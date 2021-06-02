import { JoinExpr, JoinType } from "../types";
import { Formatter } from "./util";
import rangeVar from "./rangeVar";
import { rawValue } from "./rawExpr";

export default function joinExpr<T>(c: JoinExpr, f: Formatter<T>): T[][] {
  const { keyword, _, symbol, indent } = f;

  return [
    [
      ...rangeVar(c.larg.RangeVar, f),
      _,
      ...(c.jointype === JoinType.JOIN_LEFT
        ? [keyword("LEFT"), _]
        : c.jointype === JoinType.JOIN_RIGHT
        ? [keyword("RIGHT"), _]
        : []),
      keyword("JOIN"),
      _,
      ...rangeVar(c.rarg.RangeVar, f),
      _,
      keyword("ON"),
      _,
      symbol("("),
    ],
    ...indent(rawValue(c.quals, f)),
    [symbol(")")],
  ];
}
