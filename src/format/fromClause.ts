import { FromClause } from "~/types";
import rangeVar from "./rangeVar";
import joinExpr from "./joinExpr";
import { symbol, _, comment, Block } from "./util";
import rangeSubselect from "./rangeSubselect";

export function fromClause(c: FromClause[], codeComments: string[]): Block {
  return c.flatMap((v, i) => {
    const commaSepatation = i === (c.length ?? 0) - 1 ? [] : [symbol(",")];

    if ("RangeVar" in v) {
      return [
        ...comment(codeComments[i]),
        rangeVar(v.RangeVar).concat(commaSepatation),
      ];
    }
    if ("JoinExpr" in v) {
      return [
        ...comment(codeComments[i]),
        ...joinExpr(v.JoinExpr).concat(commaSepatation),
      ];
    }
    if ("RangeSubselect" in v) {
      return [
        ...comment(codeComments[i]),
        ...rangeSubselect(v.RangeSubselect).concat([commaSepatation]),
      ];
    }

    return [];
  });
}
