import {
  Rule,
  transform,
  SELECT,
  sequence,
  __,
  endOfStatement,
  combineComments,
  _,
  FROM,
  optional,
  identifier,
  WHERE,
} from "./util";
import { rawCondition } from "./rawExpr";
import { SelectStmt } from "../types";

const where = transform(
  // 4
  sequence([
    WHERE,
    __,
    transform(
      (ctx) => rawCondition(ctx),
      ({ value, codeComment }, ctx) => ({
        value,
        pos: ctx.pos,
        codeComment,
      })
    ),
  ]),
  (v) => ({
    whereClause: v[2].value,
    whereClauseCodeComment: combineComments(v[1], v[2].codeComment),
  })
);

const from = transform(
  sequence([
    FROM,
    __,
    transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
    __,
    optional(where),
  ]),
  (v) => ({
    fromClause: [
      {
        RangeVar: {
          relname: v[2].value,
          inh: true,
          relpersistence: "p" as const,
          location: v[2].pos,
        },
        codeComment: combineComments(v[1], v[3]),
      },
    ],
    ...v[4],
  })
);

// We need to make endOfStatement optional, for use with viewStmt.
export const select: Rule<SelectStmt> = transform(
  sequence([
    SELECT,
    __,
    transform(
      (ctx) => rawCondition(ctx),
      ({ value, codeComment }, ctx) => ({
        value,
        pos: ctx.pos,
        codeComment,
      })
    ),
    __,
    // 4
    optional(from),
  ]),
  (v) => {
    return {
      targetList: [
        {
          ResTarget: {
            val: v[2].value,
            location: v[2].pos,
          },
          codeComment: combineComments(v[1], v[2].codeComment, v[3]),
        },
      ],
      ...v[4],
      op: 0,
    };
  }
);

export const selectStmt: Rule<SelectStmt> = transform(
  sequence([_, select, endOfStatement]),
  (v) => ({
    ...v[1],
    codeComment: combineComments(v[0], v[2]),
  })
);
