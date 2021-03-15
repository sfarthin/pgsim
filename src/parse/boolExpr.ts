import { BoolExpr, BoolOp } from "../types";
import { rawValue } from "./rawExpr";
import { sequence, transform, Rule, __, combineComments, NOT } from "./util";

export const notBoolExpr: Rule<{
  value: BoolExpr;
  codeComment: string;
}> = transform(sequence([NOT, __, (ctx) => rawValue(ctx)]), (v, ctx) => {
  return {
    value: {
      boolop: BoolOp.NOT,
      args: [v[2].value],
      location: ctx.pos,
    },
    codeComment: combineComments(v[1], v[2].codeComment),
  };
});
