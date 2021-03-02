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
  maybeInParens,
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
  hasParens?: boolean;
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

const _rawExpr: Rule<{
  value: RawExpr;
  codeComment: string;
  hasParens?: boolean;
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
        or([
          transform(
            sequence([__, AND, __, (blob) => rawExpr(blob)]),
            (value, ctx) => {
              return { BoolExpr: { value, ctx } };
            }
          ),
          transform(
            sequence([__, OR, __, (blob) => rawExpr(blob)]),
            (value, ctx) => {
              return { BoolExpr: { value, ctx } };
            }
          ),
        ]),

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
        const { value: v } = s[1].BoolExpr;
        const boolop = v[1].value === "OR" ? BoolOp.OR : BoolOp.AND;

        // AND has precendence over OR, so lets organize it accordingly
        // SELECT TRUE AND FALSE OR TRUE;
        if (
          boolop === BoolOp.AND &&
          "BoolExpr" in v[3].value &&
          v[3].value.BoolExpr.boolop === BoolOp.OR &&
          !v[3].hasParens
        ) {
          // Lets make sure we condense AND
          // SELECT TRUE AND TRUE AND FALSE OR TRUE;
          const subArgs =
            "BoolExpr" in v[3].value.BoolExpr.args[0] &&
            v[3].value.BoolExpr.args[0].BoolExpr.boolop === BoolOp.AND
              ? v[3].value.BoolExpr.args[0].BoolExpr.args
              : [v[3].value.BoolExpr.args[0]];

          const result: { value: RawExpr; codeComment: string } = {
            value: {
              BoolExpr: {
                boolop: BoolOp.OR,
                args: [
                  {
                    BoolExpr: {
                      boolop: BoolOp.AND,
                      args: [firstRawExpr.value, ...subArgs],
                      location: v[1].start,
                    },
                  }, // <-- Will be set below
                  ...v[3].value.BoolExpr.args.slice(1),
                ],
                location: v[3].value.BoolExpr.location,
              },
            },
            codeComment: combineComments(
              firstRawExpr.codeComment,
              v[0],
              v[2],
              v[3].codeComment
            ),
          };
          return result;
        }

        // Lets condense if we multiple OR statements
        const nextArgs =
          "BoolExpr" in v[3].value &&
          v[3].value.BoolExpr &&
          v[3].value.BoolExpr.boolop === boolop &&
          !v[3].hasParens
            ? v[3].value.BoolExpr.args
            : [v[3].value];

        return {
          value: {
            BoolExpr: {
              boolop,
              args: [
                firstRawExpr.value, // <-- Will be set below
                ...nextArgs,
              ],
              location: v[1].start,
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

export const rawExpr: Rule<{
  value: RawExpr;
  codeComment: string;
  hasParens?: boolean;
}> = or([
  _rawExpr,
  transform(maybeInParens(_rawExpr), (v) => ({
    value: v.value.value,
    codeComment: combineComments(
      v.topCodeComment,
      v.value.codeComment,
      v.bottomCodeComment
    ),
    hasParens: true,
  })),
]);
