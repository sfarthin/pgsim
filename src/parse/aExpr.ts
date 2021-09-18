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
import { RawValue, AExprKind, AExpr } from "../types";
import { rowExpr } from "./rowExpr";
import { adjustPrecedence } from "./rawValuePrecendence";

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

export const getPrecedence = (aExpr: AExpr | undefined) => {
  if (!aExpr) {
    return 0;
  }

  const op = aExpr.name[0].String.str;

  // unary operator
  if (!aExpr.lexpr && op === "-") {
    return -1;
  }

  return precedence.findIndex((ops) => (ops as readonly string[]).includes(op));
};

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
  value: RawValue;
}> = transform(
  sequence([operatorsWithOneParams, __, (ctx) => rawValue(ctx)]),
  (v, ctx) => {
    const operation = v[0].value;
    return {
      codeComment: combineComments(v[1], v[2].codeComment),
      value: adjustPrecedence(
        // If the right expr is a float or integer, we want to condense
        // it into a single value
        operation === "-" &&
          "A_Const" in v[2].value &&
          ("Float" in v[2].value.A_Const.val ||
            "Integer" in v[2].value.A_Const.val)
          ? {
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
            }
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

        { hasParens: v[2].hasParens }
      ),
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
        value: adjustPrecedence(
          {
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
          { hasParens: v[3].hasParens }
        ),
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
          rexpr: { List: { items: v[3].value.RowExpr.args } },
          location: v[1].start,
        },
      },
    };
  })(ctx);
