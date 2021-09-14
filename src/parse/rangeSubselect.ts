import { RangeSubselect } from "../types";
import {
  transform,
  identifier,
  Rule,
  sequence,
  optional,
  or,
  AS,
  __,
  combineComments,
  PERIOD,
  LPAREN,
  RPAREN,
} from "./util";
import { select } from "./selectStmt";

export const rangeSubselect: Rule<{
  value: { RangeSubselect: RangeSubselect };
  codeComment: string;
}> = transform(
  sequence([
    sequence([LPAREN, __, (ctx) => select(ctx), __, RPAREN]),

    or([sequence([__, AS, __, identifier]), sequence([__, identifier])]),
  ]),
  (v, ctx) => {
    const codeComment = combineComments(
      ...(v[1] && v[1].length === 4
        ? [v[1][0], v[1][2]]
        : v[1] && v[1].length === 2
        ? [v[1][0]]
        : [])
    );

    return {
      value: {
        RangeSubselect: {
          subquery: { SelectStmt: v[0][2] },
          alias: {
            aliasname: v[1].length === 4 ? v[1][3] : v[1][1],
          },
        },
      },
      codeComment,
    };
  }
);
