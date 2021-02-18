import {
  transform,
  Rule,
  constant,
  sequence,
  __,
  combineComments,
  Context,
} from "./util";
import { AExpr } from "../types";
import { rawExprWithoutAExpr } from "./rawExpr";

const modifiedExpr = (ctx: Context) => rawExprWithoutAExpr(ctx);

const operation = constant("=");

export const aExpr: Rule<{ value: AExpr; codeComment: string }> = transform(
  sequence([modifiedExpr, __, operation, __, modifiedExpr]),
  (v) => ({
    codeComment: combineComments(
      v[0].codeComment,
      v[1],
      v[3],
      v[4].codeComment
    ),
    value: {
      kind: 0,
      name: [
        {
          String: {
            str: v[2].value,
          },
        },
      ],
      lexpr: v[0].value,
      rexpr: v[4].value,
      location: v[2].start,
    },
  })
);
