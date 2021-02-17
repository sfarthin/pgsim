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
export const rawExprWithoutAExpr: Rule<{
  value: RawExpr;
  comment: string;
}> = transform(
  sequence([
    or([
      transform(typeCast, (TypeCast) => ({ value: { TypeCast }, comment: "" })), // intentially before aConst
      transform(aConst, (A_Const) => ({ value: { A_Const }, comment: "" })),
      transform(funcCall, ({ value, comment }) => ({
        value: { FuncCall: value },
        comment,
      })),
      transform(columnRef, (value) => ({
        value: { ColumnRef: value },
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
        comment: combineComments(v[1][0], v[1][2]),
        value: {
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
        },
      };
    }

    return v[0];
  }
);

export const rawExpr: Rule<{ value: RawExpr; comment: string }> = or([
  transform(aExpr, ({ value, comment }) => ({
    value: { A_Expr: value },
    comment,
  })),
  rawExprWithoutAExpr,
]);
