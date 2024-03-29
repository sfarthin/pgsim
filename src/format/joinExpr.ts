import { JoinExpr, JoinType } from "~/types";
import {
  Block,
  keyword,
  _,
  symbol,
  indent,
  toSingleLineIfPossible,
} from "./util";
import rangeVar from "./rangeVar";
import { rawValue } from "./rawExpr";
import rangeSubselect from "./rangeSubselect";

export default function joinExpr(c: JoinExpr): Block {
  return [
    ...("RangeVar" in c.larg
      ? [rangeVar(c.larg.RangeVar)]
      : "RangeSubselect" in c.larg
      ? rangeSubselect(c.larg.RangeSubselect)
      : joinExpr(c.larg.JoinExpr)),
    ...toSingleLineIfPossible([
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
          ? [rangeVar(c.rarg.RangeVar)]
          : rangeSubselect(c.rarg.RangeSubselect)),
        [keyword("ON"), _, symbol("(")],
        ...indent(rawValue(c.quals)),
        [symbol(")")],
      ]),
    ]),
  ];
}
