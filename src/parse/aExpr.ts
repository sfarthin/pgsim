import { connectRawValue, rawValue } from "./rawExpr";
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
import { RawValue, AExprKind, AExpr, A_Const } from "../types";
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
    constant("||"),
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
  constant("-"),
]);

// function condenseNestedAExpr(
//   aExpr: AExpr,
//   { hasParens }: { hasParens: boolean }
// ): AExpr {
//   if (aExpr.rexpr && "A_Expr" in aExpr.rexpr) {
//   }
// }

export const aExprSingleParm: Rule<{
  codeComment: string;
  value: { A_Expr: AExpr } | { A_Const: A_Const };
}> = transform(
  sequence([operatorsWithOneParams, __, (ctx) => rawValue(ctx)]),
  (v, ctx) => {
    const operation = v[0].value;
    return {
      codeComment: combineComments(v[1], v[2].codeComment),
      value:
        // If the right expr is a float or integer, we want to condense
        // it into a single value
        operation === "-" &&
        "A_Const" in v[2].value &&
        ("Float" in v[2].value.A_Const.val ||
          "Integer" in v[2].value.A_Const.val)
          ? ({
              A_Const: {
                location: ctx.pos,
                val:
                  "Float" in v[2].value.A_Const.val
                    ? {
                        Float: {
                          str: `-${v[2].value.A_Const.val.Float.str}`,
                        },
                      }
                    : {
                        Integer: {
                          ival: v[2].value.A_Const.val.Integer.ival * -1,
                        },
                      },
              },
            } as { A_Const: A_Const })
          : {
              A_Expr: {
                kind: AExprKind.AEXPR_OP,
                name: [
                  {
                    String: {
                      str: operation,
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
  connectRawValue(sequence([__, constant("in"), __, rowExpr]), (c1, v) => {
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
