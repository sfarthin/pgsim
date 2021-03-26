import { rawValue, connectRawCondition } from "./rawExpr";
import { sequence, __, combineComments, constant, or, Context } from "./util";
import { RawValue, AExprKind } from "../types";
import { rowExpr } from "./rowExpr";

const aExpr_equal = (ctx: Context) =>
  connectRawCondition(
    sequence([__, constant("="), __, (ctx) => rawValue(ctx)]),
    (c1, v) => {
      return {
        codeComment: combineComments(
          c1.codeComment,
          v[0],
          v[2],
          v[3].codeComment
        ),
        value: {
          A_Expr: {
            kind: AExprKind.AEXPR_OP,
            name: [
              {
                String: {
                  str: "=",
                },
              },
            ],
            lexpr: c1.value as RawValue, // TODO ... this currently allows "(1 AND 1) = 'foo'". Fix in the future.
            rexpr: v[3].value,
            location: v[1].start,
          },
        },
      };
    }
  )(ctx);

const aExpr_in = (ctx: Context) =>
  connectRawCondition(sequence([__, constant("in"), __, rowExpr]), (c1, v) => {
    return {
      codeComment: combineComments(
        c1.codeComment,
        v[0],
        v[2],
        v[3].codeComment
      ),
      value: {
        A_Expr: {
          kind: AExprKind.AEXPR_IN,
          name: [
            {
              String: {
                str: "=",
              },
            },
          ],
          lexpr: c1.value as RawValue, // TODO ... this currently allows "(1 AND 1) = 'foo'". Fix in the future.
          rexpr: v[3].value.args,
          location: v[1].start,
        },
      },
    };
  })(ctx);

export const aExprConnection = or([aExpr_equal, aExpr_in]);
