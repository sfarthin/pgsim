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
  or,
  constant,
  STAR,
} from "./util";
import { FuncCall } from "../types";
import { rawValue } from "./rawExpr";

// THis should include equestions and type casts.
export const funcCall: Rule<{
  value: FuncCall;
  codeComment: string;
}> = transform(
  sequence([
    or([
      transform(constant("pg_catalog.set_config"), (v) => v.value),
      identifier,
    ]),
    __,
    LPAREN,
    __,
    optional(
      or([
        transform(STAR, () => ({
          isStar: true,
          codeComment: "",
        })),
        (ctx) => rawValue(ctx),
      ])
    ), // 4
    zeroToMany(sequence([__, COMMA, __, (ctx) => rawValue(ctx)])), //5
    __,
    RPAREN,
  ]),
  (v, ctx) => {
    const agg_star = v[4] && "isStar" in v[4];
    const args = (v[4] && !("isStar" in v[4]) ? [v[4].value] : []).concat(
      v[5].length > 0 ? v[5].map((o) => o[3].value) : []
    );
    return {
      value: {
        funcname: v[0].split(".").map((k) => ({
          String: {
            str: k,
          },
        })),
        ...(agg_star ? { agg_star: true } : args.length > 0 ? { args } : {}),
        // func_variadic?: boolean; // select concat(variadic array [1,2,3])
        // agg_distinct?: boolean;
        // over?: unknown;
        location: ctx.pos,
      },
      codeComment: combineComments(
        v[1],
        v[3],
        v[4]?.codeComment,
        ...v[5].map((l) => combineComments(l[0], l[2], l[3].codeComment)),
        v[6]
      ),
    };
  }
);
