import { RawValue, AExprKind, AExpr } from "../types";
import { negateAConst } from "./aConst";
import { BoolOp } from "../types";

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

// Pur parser will nest each bool argument in a BoolExpr, but we want to keep them all flat in args.
// SELECT FALSE AND FALSE AND FALSE;
function condenseBoolArguments(
  exisitingArgs: RawValue[],
  boolop: BoolOp,
  hasParens: boolean
) {
  if (hasParens) {
    return exisitingArgs;
  }

  let args: RawValue[] = [];
  for (const arg of exisitingArgs) {
    if ("BoolExpr" in arg && boolop === arg.BoolExpr.boolop) {
      // If the operation is the same, lets flatten this structure.
      args = args.concat(arg.BoolExpr.args);
    } else {
      args.push(arg);
    }
  }

  return args;
}

// When we connect rawValue's together we want to build in an order preference.
// See https://www.postgresql.org/docs/9.0/sql-syntax-lexical.html#SQL-PRECEDENCE-TABLE
//  .	left	table/column name separator
// ::	left	PostgreSQL-style typecast
// [ ]	left	array element selection
// -	right	unary minus
// ^	left	exponentiation
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
// NOT	right	logical negation
// AND	left	logical conjunction
// OR	left	logical disjunction
export function adjustPrecedence(
  node: RawValue,
  // hasParens refers to the 2nd argument
  { hasParens }: { hasParens: boolean }
): RawValue {
  if ("A_Expr" in node) {
    const aExpr = node.A_Expr;

    // SELECT 1 = 1 AND 2 = 2
    //        ^^^^^
    //       This takes precedence
    if (
      !Array.isArray(aExpr.rexpr) &&
      aExpr.rexpr &&
      "BoolExpr" in aExpr.rexpr &&
      !hasParens
    ) {
      const op = aExpr.name[0].String.str;
      return {
        BoolExpr: {
          boolop: aExpr.rexpr.BoolExpr.boolop as BoolOp.OR | BoolOp.AND,
          args: [
            // adjustPrecedence(
            {
              A_Expr: {
                kind: AExprKind.AEXPR_OP,
                name: [{ String: { str: op } }],
                lexpr: aExpr.lexpr,
                rexpr: aExpr.rexpr.BoolExpr.args[0],
                location: aExpr.location,
              },
            },
            aExpr.rexpr.BoolExpr.args[1],
            //   { hasParens: false }
            // ),
          ],
          location: aExpr.rexpr.BoolExpr.location,
        },
      };
    }

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
      getPrecedence(aExpr) <= getPrecedence(aExpr.rexpr.A_Expr) &&
      !hasParens
    ) {
      const op = aExpr.name[0].String.str;
      const subOp = aExpr.rexpr.A_Expr.name[0].String.str;

      const unaryConst =
        aExpr.rexpr.A_Expr.lexpr && "A_Const" in aExpr.rexpr.A_Expr.lexpr
          ? aExpr.rexpr.A_Expr.lexpr.A_Const
          : null;
      const isUnary = op === "-" && !aExpr.lexpr;

      return {
        A_Expr: {
          kind: AExprKind.AEXPR_OP,
          name: [{ String: { str: subOp } }],
          lexpr:
            isUnary && unaryConst
              ? { A_Const: negateAConst(unaryConst) }
              : {
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
        },
      };
    }
  }

  if ("BoolExpr" in node) {
    const boolExpr = node.BoolExpr;
    // Since "AND" takes precedence, if the child is an "OR", lets move it to the top
    // SELECT TRUE AND FALSE OR TRUE
    //        ^^^^^^^^^^^^^^
    //        THis becomes argument 1 now
    //        whereas before it was grouped like:
    //        TRUE AND (FALSE OR TRUE)
    if (
      "BoolExpr" in boolExpr.args[1] &&
      boolExpr.boolop === BoolOp.AND && // If Parent is AND
      boolExpr.args[1].BoolExpr.boolop === BoolOp.OR && // Child is OR
      !hasParens
    ) {
      return {
        BoolExpr: {
          boolop: BoolOp.OR,
          args: [
            {
              BoolExpr: {
                boolop: BoolOp.AND,
                location: boolExpr.location,
                //   const subArgs =
                //     "BoolExpr" in v[3].value.BoolExpr.args[0] &&
                //     v[3].value.BoolExpr.args[0].BoolExpr.boolop === BoolOp.AND
                //       ? v[3].value.BoolExpr.args[0].BoolExpr.args
                //       : [v[3].value.BoolExpr.args[0]];
                args: condenseBoolArguments(
                  [boolExpr.args[0], boolExpr.args[1].BoolExpr.args[0]],
                  BoolOp.AND,
                  false
                ),
              },
            },
            ...condenseBoolArguments(
              boolExpr.args[1].BoolExpr.args.slice(1),
              BoolOp.OR,
              false
            ),
          ],
          location: boolExpr.args[1].BoolExpr.location,
        },
      };
    }

    boolExpr.args = condenseBoolArguments(
      boolExpr.args,
      boolExpr.boolop,
      hasParens
    );
    return { BoolExpr: boolExpr };
  }

  return node;
}
