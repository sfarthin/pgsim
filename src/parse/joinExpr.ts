import { JoinExpr, JoinType } from "../types";
import { rawValue } from "./rawExpr";
import {
  transform,
  identifier,
  Rule,
  sequence,
  __,
  JOIN,
  ON,
  optional,
  or,
  INNER,
  LEFT,
  RIGHT,
  AS,
  combineComments,
} from "./util";
import { rangeVar } from "./rangeVar";
import { rangeSubselect } from "./rangeSubselect";

export const joinExpr: Rule<{
  value: { JoinExpr: JoinExpr };
  codeComment: string;
}> = transform(
  sequence([
    rangeVar,
    __,
    optional(or([INNER, RIGHT, LEFT])),
    __, // 3
    JOIN,
    __, // 5
    or([rangeVar, rangeSubselect]),
    __,
    optional(or([sequence([AS, __, identifier]), identifier])),
    __, // 9
    ON,
    __,
    (ctx) => rawValue(ctx),
  ]),
  (v) => ({
    value: {
      JoinExpr: {
        jointype:
          v[2]?.value === "LEFT"
            ? JoinType.JOIN_LEFT
            : v[2]?.value === "RIGHT"
            ? JoinType.JOIN_RIGHT
            : JoinType.JOIN_INNER,
        larg: { RangeVar: v[0].value.RangeVar },
        rarg:
          "RangeVar" in v[6].value
            ? { RangeVar: v[6].value.RangeVar }
            : { RangeSubselect: v[6].value.RangeSubselect },
        quals: v[12].value,
      },
    },

    codeComment: combineComments(
      v[0].codeComment,
      v[1],
      v[3],
      v[5],
      v[6].codeComment,
      v[7],
      v[8]?.length === 3 ? v[8][1] : "",
      v[9],
      v[11],
      v[12].codeComment
    ),
  })
);
