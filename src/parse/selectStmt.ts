import {
  Rule,
  transform,
  SELECT,
  sequence,
  __,
  endOfStatement,
  combineComments,
  _,
} from "./util";
import { rawExpr } from "./rawExpr";
import { SelectStmt } from "../types";

export const selectStmt: Rule<SelectStmt> = transform(
  sequence([
    _,
    SELECT,
    __,
    transform(rawExpr, (value, ctx) => ({ value, pos: ctx.pos })),
    __,
    endOfStatement,
  ]),
  (v) => {
    return {
      comment: combineComments(v[0], v[2], v[4], v[5]),
      targetList: [
        {
          ResTarget: {
            val: v[3].value,
            location: v[3].pos,
          },
        },
      ],
      op: 0,
    };
  }
);
