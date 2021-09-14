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
  or,
  oneToMany,
  GROUP,
  BY,
} from "./util";
import { rawValue } from "./rawExpr";
import { SelectStmt } from "../types";
import { sortBy } from "./sortBy";
import { rangeVar } from "./rangeVar";
import { joinExpr } from "./joinExpr";
import { columnRef } from "./columnRef";

const groupBy = transform(
  sequence([
    __,
    GROUP,
    __,
    BY,
    __,
    columnRef, // 4
    zeroToMany(sequence([__, COMMA, __, columnRef])),
  ]),
  (v) => ({
    value: [
      { ColumnRef: v[5].value.ColumnRef },
      ...v[6].map(([, , , ColumnRef]) => ({
        ColumnRef: ColumnRef.value.ColumnRef,
      })),
    ].flatMap((c) => (c ? [c] : [])),
    codeComments: {
      groupClause: [
        combineComments(v[0], v[2], v[4]),
        ...v[6].map((r) => combineComments(r[0], r[2])),
      ],
    },
  })
);

const where = transform(
  // 4
  sequence([
    WHERE,
    __,
    transform(
      (ctx) => rawValue(ctx),
      ({ value, codeComment }, ctx) => ({
        value,
        pos: ctx.pos,
        codeComment,
      })
    ),
  ]),
  (v) => ({
    whereClause: v[2].value,
    codeComments: {
      whereClause: [combineComments(v[1], v[2].codeComment)],
    },
  })
);

const fromClause = transform(
  sequence([
    or([joinExpr, rangeVar]),
    zeroToMany(sequence([COMMA, __, or([joinExpr, rangeVar])])),
  ]),
  (v) => {
    return {
      value: [v[0].value, ...v[1].map((n) => n[2].value)],
      codeComments: [
        v[0].codeComment,
        ...v[1].flatMap((n) => [n[1], n[2].codeComment]),
      ],
    };
  }
);

const from = transform(
  sequence([FROM, __, fromClause, __, optional(where)]),
  (v) => {
    let f = v[2].codeComments;

    // Extends codeComment in first case.
    f = [combineComments(v[1], f[0]), ...f.slice(1)];

    // Extends codeComment in last case.
    f = [...f.slice(0, -1), combineComments(v[3], f[f.length - 1])];

    return {
      fromClause: v[2].value,
      ...v[4],
      codeComments: {
        whereClause: v[4]?.codeComments.whereClause,
        fromClause: f,
      },
    };
  }
);

const target = transform(
  sequence([
    (ctx) => rawValue(ctx),
    optional(
      or([sequence([__, AS, __, identifier]), sequence([__, identifier])])
    ),
  ]),
  (v, ctx) => ({
    value: {
      ResTarget: {
        val: v[0].value,
        location: ctx.pos,
        ...(v[1] ? { name: v[1].length === 4 ? v[1][3] : v[1][1] } : {}),
      },
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
    optional(groupBy),
    optional(sortBy), // 7
  ]),
  (v) => {
    const from = v[5];
    const sortBy = v[7];
    const groupBy = v[6];

    return {
      targetList: [
        v[2].value,
        ...v[3].map((r) => ({
          ...r[3].value,
        })),
      ],
      ...from,
      ...(groupBy ? { groupClause: groupBy.value } : {}),
      ...(sortBy ? { sortClause: sortBy } : {}),
      op: 0,
      codeComments: {
        fromClause: from?.codeComments?.fromClause,
        targetList: [
          combineComments(v[1], v[2].codeComment, v[4]),
          ...v[3].map((r) => combineComments(r[0], r[2], r[3].codeComment)),
        ],
        whereClause: from?.codeComments?.whereClause,
        groupClause: groupBy?.codeComments.groupClause,
      },
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
