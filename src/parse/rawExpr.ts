import {
  Rule,
  or,
  transform,
  sequence,
  optional,
  constant,
  identifier,
  OR,
  AND,
  __,
  combineComments,
} from "./util";
import { aConst } from "./aConst";
import { typeCast } from "./typeCast";
import { funcCall } from "./funcCall";
import { RawExpr, BoolOp } from "../types";
import { columnRef } from "./columnRef";
import { notBoolExpr } from "./boolExpr";

// This should include equestions and type casts.
const rawExprBasic: Rule<{
  value: RawExpr;
  codeComment: string;
}> = or([
  transform(typeCast, (TypeCast) => ({
    value: { TypeCast },
    codeComment: "",
  })), // intentially before aConst
  transform(aConst, (A_Const) => ({ value: { A_Const }, codeComment: "" })),
  transform(funcCall, ({ value, codeComment }) => ({
    value: { FuncCall: value },
    codeComment,
  })),
  transform(notBoolExpr, ({ value, codeComment }) => ({
    value: { BoolExpr: value },
    codeComment,
  })),
  transform(columnRef, (value) => ({
    value: { ColumnRef: value },
    codeComment: "",
  })),
]);

export const rawExpr: Rule<{
  value: RawExpr;
  codeComment: string;
}> = transform(
  sequence([
    rawExprBasic,
    optional(
      or([
        // Typecast
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
        ),

        // AND / OR
        transform(
          sequence([__, or([OR, AND]), __, (blob) => rawExpr(blob)]),
          (value, ctx) => {
            return { BoolExpr: { value, ctx } };
          }
        ),

        // aExpr
        transform(
          sequence([__, constant("="), __, (blob) => rawExpr(blob)]),
          (value, ctx) => {
            return { A_Expr: { value, ctx } };
          }
        ),
      ])
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
      } else if ("BoolExpr" in s[1]) {
        const { value: v, ctx } = s[1].BoolExpr;
        return {
          value: {
            BoolExpr: {
              boolop: v[1].value === "OR" ? BoolOp.OR : BoolOp.AND,
              args: [
                firstRawExpr.value, // <-- Will be set below
                v[3].value,
              ],
              location: ctx.pos,
            },
          },
          codeComment: combineComments(
            firstRawExpr.codeComment,
            v[0],
            v[2],
            v[3].codeComment
          ),
        };
      } else if ("A_Expr" in s[1]) {
        const { value: v } = s[1].A_Expr;
        return {
          codeComment: combineComments(
            firstRawExpr.codeComment,
            v[0],
            v[2],
            v[3].codeComment
          ),
          value: {
            A_Expr: {
              kind: 0,
              name: [
                {
                  String: {
                    str: v[1].value,
                  },
                },
              ],
              lexpr: firstRawExpr.value, // <-- Will set this below.
              rexpr: v[3].value,
              location: v[1].start,
            },
          },
        };
      }
    }

    return s[0];
  }
);
