import { JoinExpr, JoinType } from "../types";
import { Formatter } from "./util";
import rangeVar from "./rangeVar";
import { rawValue } from "./rawExpr";
import rangeSubselect from "./rangeSubselect";

export default function joinExpr<T>(c: JoinExpr, f: Formatter<T>): T[][] {
  const { keyword, _, symbol, indent } = f;

  return [
    ...("RangeVar" in c.larg
      ? [rangeVar(c.larg.RangeVar, f)]
      : rangeSubselect(c.larg.RangeSubselect, f)),
    [
      ...(c.jointype === JoinType.JOIN_LEFT
        ? [keyword("LEFT"), _]
        : c.jointype === JoinType.JOIN_RIGHT
        ? [keyword("RIGHT"), _]
        : []),
      keyword("JOIN"),
    ],
    ...indent([
      ...("RangeVar" in c.rarg
        ? [rangeVar(c.rarg.RangeVar, f)]
        : rangeSubselect(c.rarg.RangeSubselect, f)),
      [keyword("ON"), _, symbol("(")],
      ...indent(rawValue(c.quals, f)),
      [symbol(")")],
    ]),
  ];
}
