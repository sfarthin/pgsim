import {
  Rule,
  identifier,
  zeroToMany,
  RPAREN,
  LPAREN,
  sequence,
  transform,
  COMMA,
  __,
  optional,
  combineComments,
} from "./util";
import { FuncCall } from "../types";
import { rawExpr } from "./rawExpr";

// THis should include equestions and type casts.
export const funcCall: Rule<{ value: FuncCall; comment: string }> = transform(
  sequence([
    identifier,
    __,
    LPAREN,
    __,
    optional((ctx) => rawExpr(ctx)), // 4
    zeroToMany(sequence([__, COMMA, __, (ctx) => rawExpr(ctx)])), //5
    __,
    RPAREN,
  ]),
  (v, ctx) => {
    const args = (v[4] ? [v[4]] : []).concat(
      v[5].length > 0 ? v[5].map((o) => o[3]) : []
    );
    return {
      value: {
        funcname: [
          {
            String: {
              str: v[0],
            },
          },
        ],
        ...(args.length > 0 ? { args } : {}),
        // func_variadic?: boolean; // select concat(variadic array [1,2,3])
        // agg_distinct?: boolean;
        // over?: unknown;
        location: ctx.pos,
      },
      comment: combineComments(
        v[1],
        v[3],
        ...v[5].map((l) => combineComments(l[0], l[2]), v[6])
      ),
    };
  }
);
