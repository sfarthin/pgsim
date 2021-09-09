import { BoolExpr, BoolOp } from "../types";
import { rawValue, connectRawValue } from "./rawExpr";
import {
  sequence,
  transform,
  Rule,
  __,
  combineComments,
  NOT,
  AND,
  OR,
  or,
  Context,
} from "./util";
import { adjustPrecedence } from "./rawValuePrecendence";

export const notBoolExpr: Rule<{
  value: { BoolExpr: BoolExpr };
  codeComment: string;
}> = transform(sequence([NOT, __, (ctx) => rawValue(ctx)]), (v, ctx) => {
  return {
    value: {
      BoolExpr: {
        boolop: BoolOp.NOT,
        args: [v[2].value],
        location: ctx.pos,
      },
    },
    codeComment: combineComments(v[1], v[2].codeComment),
  };
});

export const boolConnection = (ctx: Context) =>
  connectRawValue(
    sequence([__, or([AND, OR]), __, (ctx) => rawValue(ctx)]),
    (c1, v) => {
      return {
        value: adjustPrecedence(
          {
            BoolExpr: {
              boolop: v[1].value === "AND" ? BoolOp.AND : BoolOp.OR,
              args: [c1.value, v[3].value],
              location: v[1].start,
            },
          },
          { hasParens: v[3].hasParens }
        ),
        codeComment: combineComments(
          c1.codeComment,
          v[0],
          v[2],
          v[3].codeComment
        ),
      };
    }
  )(ctx);
