import {
  Rule,
  identifier,
  zeroToMany,
  whitespaceWithoutNewline,
  RPAREN,
  LPAREN,
  sequence,
  transform,
} from "./util";
import { FuncCall } from "../types";

// THis should include equestions and type casts.
export const funcCall: Rule<FuncCall> = transform(
  sequence([identifier, zeroToMany(whitespaceWithoutNewline), LPAREN, RPAREN]),
  (v, ctx) => {
    return {
      funcname: [
        {
          String: {
            str: v[0],
          },
        },
      ],
      //   args: [],
      // func_variadic?: boolean; // select concat(variadic array [1,2,3])
      // agg_distinct?: boolean;
      // over?: unknown;
      location: ctx.pos,
    };
  }
);
