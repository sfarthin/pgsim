import { rawValue, connectRawCondition, connectRawValue } from "./rawExpr";
import {
  sequence,
  __,
  combineComments,
  constant,
  or,
  Context,
  transform,
  Rule,
  lookForWhiteSpaceOrComment,
} from "./util";
import { RawValue, AExprKind, AExpr } from "../types";
import { rowExpr } from "./rowExpr";

const operatorsWithTwoParams = or([
  constant("="),
  constant("<>"),
  constant("!="),
  constant(">="),
  constant("<<"),
  constant(">>"),
  constant(">"),
  constant("<="),
  constant("<"),
  constant("+"),
  constant("-"),
  constant("*"),

  or([
    constant("^"),
    constant("&"),
    constant("|"),
    constant("#"),
    constant("/"),
    constant("%"),
  ]),
]);

const operatorsWithOneParams = or([
  constant("|/"),
  constant("||/"),
  constant("~"),
  constant("@"),
  constant("!!"),
]);

export const aExprSingleParm: Rule<{
  codeComment: string;
  value: { A_Expr: AExpr };
}> = transform(
  sequence([operatorsWithOneParams, __, (ctx) => rawValue(ctx)]),
  (v, ctx) => {
    return {
      codeComment: combineComments(v[1], v[2].codeComment),
      value: {
        A_Expr: {
          kind: AExprKind.AEXPR_OP,
          name: [
            {
              String: {
                str: v[0].value,
              },
            },
          ],
          rexpr: v[2].value,
          location: ctx.pos,
        },
      },
    };
  }
);

export const aExprDoubleParams = (ctx: Context) =>
  connectRawValue(
    sequence([__, operatorsWithTwoParams, __, (ctx) => rawValue(ctx)]),
    (c1, v) => {
      return {
        codeComment: combineComments(
          c1.codeComment,
          v[0],
          v[2],
          v[3].codeComment
        ),
        value: {
          A_Expr: {
            kind: AExprKind.AEXPR_OP,
            name: [
              {
                String: {
                  str: v[1].value === "!=" ? "<>" : v[1].value,
                },
              },
            ],
            lexpr: c1.value,
            rexpr: v[3].value,
            location: v[1].start,
          },
        },
      };
    }
  )(ctx);

export const aExprFactorial = (ctx: Context) =>
  connectRawValue(
    sequence([__, constant("!"), lookForWhiteSpaceOrComment]),
    (c1, v) => {
      return {
        codeComment: combineComments(c1.codeComment, v[0]),
        value: {
          A_Expr: {
            kind: AExprKind.AEXPR_OP,
            name: [
              {
                String: {
                  str: "!",
                },
              },
            ],
            lexpr: c1.value,
            location: v[1].start,
          },
        },
      };
    }
  )(ctx);

export const aExprIn = (ctx: Context) =>
  connectRawCondition(sequence([__, constant("in"), __, rowExpr]), (c1, v) => {
    return {
      codeComment: combineComments(
        c1.codeComment,
        v[0],
        v[2],
        v[3].codeComment
      ),
      value: {
        A_Expr: {
          kind: AExprKind.AEXPR_IN,
          name: [
            {
              String: {
                str: "=",
              },
            },
          ],
          lexpr: c1.value as RawValue, // TODO ... this currently allows "(1 AND 1) = 'foo'". Fix in the future.
          rexpr: v[3].value.args,
          location: v[1].start,
        },
      },
    };
  })(ctx);
