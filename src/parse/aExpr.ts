import { connectRawValue, rawValue, rawValuePostfix } from "./rawExpr";
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

// * / %	left	multiplication, division, modulo
// + -	left	addition, subtraction
// IS	 	IS TRUE, IS FALSE, IS UNKNOWN, IS NULL
// ISNULL	 	test for null
// NOTNULL	 	test for not null
// (any other)	left	all other native and user-defined operators
// IN	 	set membership
// BETWEEN	 	range containment
// OVERLAPS	 	time interval overlap
// LIKE ILIKE SIMILAR	 	string pattern matching
// < >	 	less than, greater than
// =	right	equality, assignment

const precedence = [
  ["*", "/", "%"],
  ["+", "-"],
  ["<", ">", "<=", ">=", "<>"],
  ["=", "!="],
];

const getPrecedence = (x: string) =>
  precedence.findIndex((ops) => (ops as readonly string[]).includes(x));

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

// We need to make some rearranging to make sure our AST matches postgres.
function condenseNestedAExpressions(
  aExpr: AExpr,
  { hasParens }: { hasParens: boolean }
): AExpr {
  // Since "*" takes precedence over "+", lets move it to the top
  // SELECT 1 * 2 + 3
  //        ^^^^^
  //        THis becomes argument 1 now
  //        whereas before it was grouped like:
  //        1 * (2 + 3)
  if (
    !Array.isArray(aExpr.rexpr) &&
    aExpr.rexpr &&
    "A_Expr" in aExpr.rexpr &&
    getPrecedence(aExpr.name[0].String.str) <=
      getPrecedence(aExpr.rexpr.A_Expr.name[0].String.str) &&
    !hasParens
  ) {
    const op = aExpr.name[0].String.str;
    const subOp = aExpr.rexpr.A_Expr.name[0].String.str;

    return {
      kind: AExprKind.AEXPR_OP,
      name: [{ String: { str: subOp } }],
      lexpr: {
        A_Expr: {
          kind: AExprKind.AEXPR_OP,
          name: [{ String: { str: op } }],
          lexpr: aExpr.lexpr,
          rexpr: aExpr.rexpr.A_Expr.lexpr,
          location: aExpr.location,
        },
      },
      rexpr: aExpr.rexpr.A_Expr.rexpr as RawValue,
      location: aExpr.rexpr.A_Expr.location,
    };
  }

  return aExpr;
}

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
          A_Expr: condenseNestedAExpressions(
            {
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
            { hasParens: "hasParens" in v[3] && !!v[3].hasParens }
          ),
        },
      };
    }
  )(ctx);

export const aExprFactorial = (ctx: Context) =>
  rawValuePostfix(
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
          rexpr: v[3].value.RowExpr.args,
          location: v[1].start,
        },
      },
    };
  })(ctx);
