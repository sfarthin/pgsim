import { RangeSubselect } from "~/types";
import {
  transform,
  identifier,
  Rule,
  sequence,
  or,
  AS,
  __,
  combineComments,
  LPAREN,
  RPAREN,
  identifierIncludingKeyword,
} from "./util";
import { select } from "./selectStmt";

export const rangeSubselect: Rule<{
  value: { RangeSubselect: RangeSubselect };
  codeComment: string;
}> = transform(
  sequence([
    sequence([LPAREN, __, (ctx) => select(ctx), __, RPAREN]),

    or([
      sequence([__, AS, __, identifierIncludingKeyword]),
      sequence([__, identifier]),
    ]),
  ]),
  (v) => {
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
          subquery: { SelectStmt: v[0][2].value },
          alias: {
            aliasname: v[1].length === 4 ? v[1][3] : v[1][1],
          },
        },
      },
      codeComment,
    };
  }
);
