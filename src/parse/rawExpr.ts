import {
  Rule,
  or,
  transform,
  sequence,
  optional,
  constant,
  identifier,
  __,
  combineComments,
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
      transform(rowExpr, ({ value, codeComment }) => ({
        value: { RowExpr: value },
        codeComment,
      })),
    ]),
    optional(
      transform(
        sequence([
          __,
          transform(constant("::"), (value, ctx) => ({
            value,
            pos: ctx.pos,
          })),
          __,
          transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
        ]),
        (value, ctx) => ({ TypeCast: { value, ctx } })
      )
    ),
  ]),
  (s) => {
    if (s[1]) {
      const firstRawExpr = s[0];
      if ("TypeCast" in s[1]) {
        const { value: v } = s[1].TypeCast;
        return {
          codeComment: combineComments(firstRawExpr.codeComment, v[0], v[2]),
          value: {
            TypeCast: {
              arg: firstRawExpr.value,
              typeName: {
                TypeName: {
                  names: [
                    {
                      String: {
                        str: v[3].value,
                      },
                    },
                  ],
                  typemod: -1,
                  location: v[3].pos,
                },
              },
              location: v[1].pos,
            },
          },
        };
      }
    }

    return s[0];
  }
);

export const rawCondition: Rule<{
  value: RawCondition;
  codeComment: string;
  hasParens?: boolean;
}> = transform(
  sequence([
    or([
      rawValue, // See above ^^
      notBoolExpr, // NOT XXX

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
