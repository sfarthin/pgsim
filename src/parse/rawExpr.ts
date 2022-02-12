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
  aExprBooleanSpecialCase,
  aExprIn,
} from "./aExpr";
import { rowExpr } from "./rowExpr";
import { subLinkConnection, subLink } from "./subLink";
import { typeCastConnection, typeCastLiteral } from "./typeCast";
import { caseExpr } from "./caseExpr";
import { aIndirectionConnection } from "./aIndirection";

export const rawValue: Rule<{
  value: RawValue;
  codeComment: string;
  hasParens: boolean;
}> = transform(
  // Base case
  sequence([
    or([
      // Special cases "true= false", left parm is a column ref and not a boolean
      aExprBooleanSpecialCase,

      (ctx) => typeCast(ctx),
      aExprSingleParm,
      typeCastLiteral,
      (ctx) => aConst(ctx),
      (ctx) => funcCall(ctx),
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
      // @ts-expect-error -- TODO
      node = connector(node);
    }

    return {
      value: node.value,
      codeComment: node.codeComment,
      hasParens: "hasParens" in node && node.hasParens,
    };
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
      hasParens: boolean;
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
      hasParens: boolean;
    }) => extensionFn(r1, r2, ctx)
  );
}

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
