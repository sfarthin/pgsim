import {
  Rule,
  or,
  transform,
  sequence,
  __,
  LPAREN,
  RPAREN,
  Context,
  zeroToMany,
  RuleResult,
} from "./util";
import { aConst } from "./aConst";
import { typeCast } from "./typeCast";
import { funcCall } from "./funcCall";
import { RawValue } from "../types";
import { columnRef } from "./columnRef";
import { notBoolExpr, boolConnection } from "./boolExpr";
import { nullTestConnection } from "./nullTest";
import {
  aExprDoubleParams,
  aExprSingleParm,
  aExprFactorial,
  aExprIn,
} from "./aExpr";
import { rowExpr } from "./rowExpr";
import { subLinkConnection, subLink } from "./subLink";
import { typeCastConnection, typeCastLiteral } from "./typeCast";
import { caseExpr } from "./caseExpr";
import { aIndirectionConnection } from "./aIndirection";
import { FlattenUnion } from "../lint/node";

export const rawValue: Rule<{
  value: RawValue;
  codeComment: string;
  hasParens?: boolean;
}> = transform(
  sequence([
    or([
      typeCast,
      aExprSingleParm,
      typeCastLiteral,
      aConst,

      funcCall,
      columnRef,
      notBoolExpr, // NOT XXX
      caseExpr,
      (ctx) => subLink(ctx), // exists in (SELECT ...)

      transform(
        sequence([LPAREN, __, (ctx) => rawValue(ctx), __, RPAREN]),
        (v) => ({ ...v[2], hasParens: true })
      ),
      // ^^ Intentially before rowExpr because "SELECT (4)" uses parens and not a list of one.
      rowExpr,
    ]),
    zeroToMany(
      or([
        subLinkConnection,
        nullTestConnection,
        typeCastConnection,
        aIndirectionConnection,
        boolConnection,
        aExprFactorial,

        aExprIn,
        aExprDoubleParams,
      ])
    ),
  ]),
  (v) => {
    let node = v[0];
    for (const connector of v[1]) {
      // @ts-expect-error
      node = connector(node);
    }

    return node;
  }
);

/**
 * This helper allows us to organize code appropiately
 */
export function connectRawValue<B>(
  ruleB: Rule<B>,
  extensionFn: (
    a: {
      value: RawValue;
      codeComment: string;
      hasParens?: boolean;
    },
    b: B,
    c: Context
  ) => { value: RawValue; codeComment: string }
) {
  return transform(
    ruleB,
    (r2, ctx) => (r1: {
      value: RawValue;
      codeComment: string;
      hasParens?: boolean;
    }) => extensionFn(r1, r2, ctx)
  );
}

/**
 * This helper allows us to organize code appropiately
 */
// type RawValueName = keyof FlattenUnion<RawValue>;
// export function connectRawValue<V, R extends RawValue>(
//   rule: Rule<V>,
//   arg: (
//     v: V
//   ) => { value: R; codeComment: string } | { value: R; codeComment: string }[],
//   extensionFn: (
//     l:
//       | {
//           value: RawValue;
//           codeComment: string;
//           hasParens?: boolean;
//         }
//       | {
//           value: RawValue;
//           codeComment: string;
//           hasParens?: boolean;
//         }[],
//     r: { value: R; codeComment: string } | { value: R; codeComment: string }[],
//     v: V,
//     c: Context
//   ) => { value: RawValue; codeComment: string }
// ) {
//   return transform(
//     rule,
//     (v, ctx) => (
//       r1:
//         | {
//             value: RawValue;
//             codeComment: string;
//             hasParens?: boolean;
//           }
//         | {
//             value: RawValue;
//             codeComment: string;
//             hasParens?: boolean;
//           }[]
//     ) => extensionFn(r1, arg(v), v, ctx)
//   );
// }

export function rawValuePostfix<B>(
  ruleB: Rule<B>,
  extensionFn: (
    a: {
      value: RawValue;
      codeComment: string;
      hasParens?: boolean;
    },
    b: B,
    c: Context
  ) => { value: RawValue; codeComment: string }
) {
  return transform(
    ruleB,
    (r2, ctx) => (r1: {
      value: RawValue;
      codeComment: string;
      hasParens?: boolean;
    }) => extensionFn(r1, r2, ctx)
  );
}

// [ { A_Const } ]

// When we connect rawValue's together we want to build in an orde preference.
// See https://www.postgresql.org/docs/9.0/sql-syntax-lexical.html#SQL-PRECEDENCE-TABLE
// decreasing order

// IMPLICIT with parser

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

// export function adjustPrecedence(n1: RawValue, n2:RawValue): RawValue {

//   if(node)

// }

// const orderPrecendence: RawValueName[] = [
//   "TypeCast", // ::	left	PostgreSQL-style typecast
//   "A_Indirection", // [ ]	left	array element selection
//   "ColumnRef", // .	left	table/column name separator
//   "A_Expr",
// ];

// SELECT 1 + 1::int;
