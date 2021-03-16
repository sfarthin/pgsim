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
import { select } from "./selectStmt";

export const viewStmt: Rule<ViewStmt> = transform(
  sequence([
    _,
    CREATE,
    __,
    VIEW,
    __,
    transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
    __, // 6
    AS,
    __,
    maybeInParens(select),
    __,
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
    query: {
      SelectStmt: {
        ...v[9].value,
        codeComment: combineComments(
          v[8],
          v[9].topCodeComment,
          v[9].value.codeComment,
          v[9].bottomCodeComment,
          v[10],
          v[11]
        ),
      },
    },
    withCheckOption: 0,
    codeComment: combineComments(v[0], v[2], v[4], v[6]),
  })
);
