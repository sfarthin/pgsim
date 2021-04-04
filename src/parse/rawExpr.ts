import {
  Rule,
  or,
  transform,
  sequence,
  optional,
  __,
  LPAREN,
  RPAREN,
  Context,
} from "./util";
import { aConst } from "./aConst";
import { typeCast } from "./typeCast";
import { funcCall } from "./funcCall";
import { RawValue, RawCondition } from "../types";
import { columnRef } from "./columnRef";
import { notBoolExpr, boolConnection } from "./boolExpr";
import { aExprConnection } from "./aExpr";
import { rowExpr } from "./rowExpr";
import { subLinkConnection, subLinkExists } from "./subLink";
import { typeCastConnection } from "./typeCast";

// This should include equestions and type casts.
export const rawValue: Rule<{
  value: RawValue;
  codeComment: string;
  hasParens?: boolean;
}> = transform(
  sequence([
    or([
      typeCast,
      transform(aConst, (A_Const) => ({ value: { A_Const }, codeComment: "" })),
      transform(funcCall, ({ value, codeComment }) => ({
        value: { FuncCall: value },
        codeComment,
      })),
      transform(columnRef, (value) => ({
        value: { ColumnRef: value },
        codeComment: "",
      })),
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
    optional(typeCastConnection),
  ]),
  (v) => {
    if (v[1]) {
      return v[1](v[0]);
    }
    return v[0];
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

export const rawCondition: Rule<{
  value: RawCondition;
  codeComment: string;
  hasParens?: boolean;
}> = transform(
  sequence([
    or([
      transform(sequence([rawValue, optional(subLinkConnection)]), (v) => {
        if (v[1]) {
          return v[1](v[0]);
        }
        return v[0];
      }), // See above ^^
      notBoolExpr, // NOT XXX
      (ctx) => subLinkExists(ctx), // exists in (SELECT ...)

      // a rawCondition in parens
      transform(
        sequence([LPAREN, __, (ctx) => rawCondition(ctx), __, RPAREN]),
        (v) => ({ ...v[2], hasParens: true })
      ),
    ]),
    optional(or([boolConnection, aExprConnection])),
  ]),
  (v) => {
    if (v[1]) {
      return v[1](v[0]);
    }
    return v[0];
  }
);

/**
 * This helper allows us to organize code appropiately
 */
export function connectRawCondition<B>(
  ruleB: Rule<B>,
  extensionFn: (
    a: {
      value: RawCondition;
      codeComment: string;
      hasParens?: boolean;
    },
    b: B,
    c: Context
  ) => { value: RawCondition; codeComment: string }
) {
  return transform(
    ruleB,
    (r2, ctx) => (r1: {
      value: RawCondition;
      codeComment: string;
      hasParens?: boolean;
    }) => extensionFn(r1, r2, ctx)
  );
}

export function connectRawConditionFromValue<B>(
  ruleB: Rule<B>,
  extensionFn: (
    a: {
      value: RawValue;
      codeComment: string;
      hasParens?: boolean;
    },
    b: B,
    c: Context
  ) => { value: RawCondition; codeComment: string }
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
