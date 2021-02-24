import { BoolExpr, BoolOp } from "../types";
import { rawExpr as _rawExpr } from "./rawExpr";
import {
  sequence,
  transform,
  Rule,
  __,
  combineComments,
  NOT,
  Context,
} from "./util";

const rawExpr = (ctx: Context) => _rawExpr(ctx);

export const notBoolExpr: Rule<{
  value: BoolExpr;
  codeComment: string;
}> = transform(sequence([NOT, __, rawExpr]), (v, ctx) => {
  return {
    value: {
      boolop: BoolOp.NOT,
      args: [v[2].value],
      location: ctx.pos,
    },
    codeComment: combineComments(v[1], v[2].codeComment),
  };
});
