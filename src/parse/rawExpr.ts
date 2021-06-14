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
  hasParens?: boolean;
}> = transform(
  sequence([
    or([
      typeCast,
      aExprSingleParm,
      typeCastLiteral,
      aConst,

      transform(funcCall, ({ value, codeComment }) => ({
        value: { FuncCall: value },
        codeComment,
      })),
      transform(columnRef, (value) => ({
        value: { ColumnRef: value },
        codeComment: "",
      })),
      notBoolExpr, // NOT XXX
      caseExpr,
      (ctx) => subLink(ctx), // exists in (SELECT ...)

      transform(
        sequence([LPAREN, __, (ctx) => rawValue(ctx), __, RPAREN]),
        (v) => ({ ...v[2], hasParens: true })
      ),
      // ^^ Intentially before rowExpr because "SELECT (4)" uses parens and not a list of one.
      transform(rowExpr, ({ value, codeComment }) => ({
        value: { RowExpr: value },
        codeComment,
      })),
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
