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
  zeroToMany,
  COMMA,
  AS,
} from "./util";
import { rawCondition } from "./rawExpr";
import { SelectStmt } from "../types";
import { sortBy } from "./sortBy";

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

const target = transform(
  sequence([
    (ctx) => rawCondition(ctx),
    optional(sequence([__, AS, __, identifier])),
  ]),
  (v, ctx) => ({
    ResTarget: {
      val: v[0].value,
      location: ctx.pos,
      ...(v[1] ? { name: v[1][3] } : {}),
    },
    codeComment: combineComments(v[0].codeComment, v[1]?.[0], v[1]?.[2]),
  })
);

// We need to make endOfStatement optional, for use with viewStmt.
export const select: Rule<SelectStmt> = transform(
  sequence([
    SELECT,
    __,
    target,
    zeroToMany(sequence([__, COMMA, __, target])), // 3
    __,
    optional(from), // 5
    optional(sortBy), // 6
  ]),
  (v) => {
    return {
      targetList: [
        {
          ...v[2],
          codeComment: combineComments(v[1], v[2].codeComment, v[4]),
        },
        ...v[3].map((r) => ({
          ...r[3],
          codeComment: combineComments(r[0], r[2], r[3].codeComment),
        })),
      ],
      ...v[5],
      ...(v[6] ? { sortClause: v[6] } : {}),
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
