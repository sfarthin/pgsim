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
  codeComment: string;
}> = transform(
  sequence([
    or([
      transform(typeCast, (TypeCast) => ({
        value: { TypeCast },
        codeComment: "",
      })), // intentially before aConst
      transform(aConst, (A_Const) => ({ value: { A_Const }, codeComment: "" })),
      transform(funcCall, ({ value, codeComment }) => ({
        value: { FuncCall: value },
        codeComment,
      })),
      transform(columnRef, (value) => ({
        value: { ColumnRef: value },
        codeComment: "",
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
      return {
        codeComment: combineComments(v[0].codeComment, v[1][0], v[1][2]),
        value: {
          TypeCast: {
            arg: v[0].value as RawExpr,
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

export const rawExpr: Rule<{ value: RawExpr; codeComment: string }> = or([
  transform(aExpr, ({ value, codeComment }) => ({
    value: { A_Expr: value },
    codeComment,
  })),
  rawExprWithoutAExpr,
]);
