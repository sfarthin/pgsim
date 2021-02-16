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
} from "./util";
import { aConst } from "./aConst";
import { typeCast } from "./typeCast";
import { funcCall } from "./funcCall";
import { RawExpr } from "../types";
import { columnRef } from "./columnRef";
import { aExpr } from "./aExpr";

// THis should include equestions and type casts.
export const rawExprWithoutAExpr: Rule<
  RawExpr & { comment?: string }
> = transform(
  sequence([
    or([
      transform(typeCast, (TypeCast) => ({ TypeCast })), // intentially before aConst
      transform(aConst, (A_Const) => ({ A_Const })),
      transform(funcCall, ({ value, comment }) => ({
        FuncCall: value,
        comment,
      })),
      transform(columnRef, (value) => ({
        ColumnRef: value,
        comment: "",
      })),
    ]),
    optional(
      sequence([
        __,
        transform(constant("::"), (value, ctx) => ({ value, pos: ctx.pos })),
        __,
        transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
      ])
    ),
  ]),
  (v) => {
    // Lets handle any typecasts
    if (v[1]) {
      const type = Object.keys(v[0])[0] as "FuncCall" | "TypeCast" | "A_Const";
      return {
        TypeCast: {
          arg: {
            [type]: {
              // @ts-expect-error we know type is a key of a RawExpr
              ...v[0][type],
              // @ts-expect-error we know type is a key of a RawExpr
              comment: combineComments(v[0][type].comment, v[1][0], v[1][2]),
            },
          } as RawExpr,
          typeName: {
            TypeName: {
              names: [
                {
                  String: {
                    str: v[1][3].value,
                  },
                },
              ],
              typemod: -1,
              location: v[1][3].pos,
            },
          },
          location: v[1][1].pos,
        },
      };
    }

    return v[0];
  }
);

export const rawExpr: Rule<RawExpr & { comment?: string }> = or([
  rawExprWithoutAExpr,
  transform(aExpr, ({ value, comment }) => ({
    A_Expr: value,
    comment,
  })),
]);
