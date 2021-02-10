import {
  transform,
  identifier,
  CREATE,
  VIEW,
  __,
  AS,
  Rule,
  sequence,
  endOfStatement,
  combineComments,
  maybeInParens,
  _,
} from "./util";
import { ViewStmt } from "../types";
import { selectStmt } from "./selectStmt";

export const viewStmt: Rule<ViewStmt> = transform(
  sequence([
    _,
    CREATE,
    __,
    VIEW,
    __,
    transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
    __, // 5
    AS,
    __,
    maybeInParens(selectStmt),
    endOfStatement,
  ]),
  (v) => ({
    view: {
      RangeVar: {
        relname: v[5].value,
        relpersistence: "p",
        location: v[5].pos,
        inh: true,
      },
    },
    query: { SelectStmt: v[9].value },
    withCheckOption: 0,
    comment: combineComments(v[0], v[2], v[4], v[6], v[8], v[9].comment, v[10]),
  })
);