import {
  Rule,
  transform,
  SELECT,
  sequence,
  __,
  endOfStatement,
  combineComments,
  FROM,
  optional,
  identifier,
  WHERE,
  zeroToMany,
  COMMA,
  AS,
  or,
  GROUP,
  BY,
  EOS,
  WITH,
  LPAREN,
  RPAREN,
  DISTINCT,
  identifierIncludingKeyword,
} from "./util";
import { rawValue } from "./rawExpr";
import { SelectStmt } from "~/types";
import { sortBy } from "./sortBy";
import { rangeVar } from "./rangeVar";
import { joinExpr } from "./joinExpr";
import { columnRef } from "./columnRef";
import { aConst, aConstInteger } from "./aConst";

const groupBy = transform(
  sequence([
    __,
    GROUP,
    __,
    BY,
    __,
    or([columnRef, aConstInteger]), // 5
    zeroToMany(sequence([__, COMMA, __, or([columnRef, aConst])])),
    __,
  ]),
  (v) => ({
    value: [
      "ColumnRef" in v[5].value
        ? { ColumnRef: v[5].value.ColumnRef }
        : { A_Const: v[5].value.A_Const },
      ...v[6].map(([, , , e]) =>
        "ColumnRef" in e.value
          ? {
              ColumnRef: e.value.ColumnRef,
            }
          : {
              A_Const: e.value.A_Const,
            }
      ),
    ].flatMap((c) => (c ? [c] : [])),
    codeComments: {
      groupClause: [
        combineComments(v[0], v[2], v[4]),
        ...v[6].map((r) => combineComments(r[0], r[2])),
        v[7],
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
    __,
  ]),
  (v) => ({
    whereClause: v[2].value,
    codeComments: {
      whereClause: [combineComments(v[1], v[2].codeComment, v[3])],
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
      or([
        sequence([__, AS, __, identifierIncludingKeyword]),
        sequence([__, identifier]),
      ])
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

const selectDistinct = transform(
  sequence([SELECT, optional(sequence([__, DISTINCT]))]),
  (v, ctx) => {
    const hasDistinct = v[1];

    return {
      value: hasDistinct ? "foo" : null,
      codeComment: v[1]?.[0],
      start: v[0].start,
    };
  }
);

// We need to make endOfStatement optional, for use with viewStmt.
export const select: Rule<{ value: SelectStmt; start: number }> = transform(
  sequence([
    optional((ctx) => withClause(ctx)),
    __,
    selectDistinct,
    __,
    target,
    zeroToMany(sequence([__, COMMA, __, target])), // 3
    __,
    optional(from), // 5
    optional(groupBy),
    optional(sortBy), // 7
  ]),
  (v) => {
    const withClause = v[0];
    const withDistinct = v[2].value;
    const from = v[7];
    const sortBy = v[9];
    const groupBy = v[8];

    return {
      start: v[2].start,
      value: {
        targetList: [
          v[4].value,
          ...v[5].map((r) => ({
            ...r[3].value,
          })),
        ],
        ...from,
        ...(withDistinct ? { distinctClause: [{}] } : {}),
        ...(groupBy ? { groupClause: groupBy.value } : {}),
        ...(sortBy ? { sortClause: sortBy } : {}),
        ...(withClause ? { withClause: withClause.value } : {}),
        limitOption: "LIMIT_OPTION_DEFAULT",
        op: "SETOP_NONE",
        codeComments: {
          withClause: withClause?.codeComment,
          fromClause: from?.codeComments?.fromClause,
          targetList: [
            combineComments(
              v[1],
              v[2].codeComment,
              v[3],
              v[4].codeComment,
              v[6]
            ),
            ...v[5].map((r) => combineComments(r[0], r[2], r[3].codeComment)),
          ],
          whereClause: from?.codeComments?.whereClause,
          groupClause: groupBy?.codeComments.groupClause,
        },
      },
    };
  }
);

const singlewithClause = transform(
  sequence([identifier, __, AS, __, LPAREN, __, select, __, RPAREN]),
  (v, ctx) => {
    return {
      value: {
        CommonTableExpr: {
          ctename: v[0],
          ctematerialized: "CTEMaterializeDefault" as const,
          ctequery: {
            SelectStmt: v[6].value,
          },
          location: ctx.pos,
        },
      },
      codeComment: combineComments(v[1], v[3], v[5], v[7]),
    };
  }
);

const withClause: Rule<{
  value: SelectStmt["withClause"];
  codeComment: string;
}> = transform(
  sequence([
    WITH,
    __,
    singlewithClause,
    zeroToMany(sequence([__, COMMA, __, singlewithClause])),
  ]),
  (v, ctx) => {
    return {
      value: {
        ctes: [v[2].value, ...v[3].map((r) => r[3].value)],
        location: ctx.pos,
      },
      codeComment: combineComments(
        v[1],
        v[2].codeComment,
        ...v[3].map((r) => combineComments(r[0], r[2], r[3].codeComment))
      ),
    };
  }
);

export const selectStmt: Rule<{
  value: { SelectStmt: SelectStmt };
  eos: EOS;
}> = transform(sequence([select, __, endOfStatement]), (v) => ({
  eos: v[2],
  value: {
    SelectStmt: {
      ...v[0].value,
      codeComment: combineComments(v[1], v[2].comment),
    },
  },
}));
