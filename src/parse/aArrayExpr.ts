import {
  Rule,
  transform,
  sequence,
  __,
  zeroToMany,
  symbol,
  COMMA,
  combineComments,
  keywordWithNoSpaceAfterward,
  optional,
} from "./util";
import { AArrayExpr } from "~/types";
import { rawValue } from "./rawExpr";

export const aArrayExpr: Rule<{
  value: { A_ArrayExpr: AArrayExpr };
  codeComment: string;
}> = transform(
  sequence([
    keywordWithNoSpaceAfterward("array" as any),
    __,
    symbol("["),
    __,
    optional((ctx) => rawValue(ctx)), // 4
    __,
    zeroToMany(sequence([COMMA, __, (ctx) => rawValue(ctx), __])), // 6
    symbol("]"),
  ]),
  (v) => {
    return {
      value: {
        A_ArrayExpr: {
          ...(v[4]
            ? {
                elements: [v[4]?.value, ...v[6]?.map((i) => i[2].value)],
              }
            : {}),
          location: v[0].start,
        },
      },
      codeComment: combineComments(
        v[1],
        v[3],
        v[4]?.codeComment,
        v[5],
        ...v[6]?.map((i) => combineComments(i[1], i[2].codeComment, i[3]))
      ),
    };
  }
);
