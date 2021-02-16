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

export const aExpr: Rule<{ value: AExpr; comment: string }> = transform(
  sequence([modifiedExpr, __, operation, __, modifiedExpr]),
  (v, ctx) => ({
    comment: combineComments(v[0].comment, v[1], v[3], v[4].comment),
    value: {
      kind: 0,
      name: [
        {
          String: {
            str: v[2].value,
          },
        },
      ],
      lexpr: { ...v[0], comment: "" },
      rexpr: { ...v[4], comment: "" },
      location: ctx.pos,
    },
  })
);
