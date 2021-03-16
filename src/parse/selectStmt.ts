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
    optional(
      // 4
      sequence([
        __,
        FROM,
        __,
        transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
        optional(
          // 4
          sequence([
            __,
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
          ])
        ),
      ])
    ),
  ]),
  (v) => {
    return {
      codeComment: "",
      targetList: [
        {
          ResTarget: {
            val: v[2].value,
            location: v[2].pos,
          },
          codeComment: combineComments(v[1], v[2].codeComment, v[3]?.[0]),
        },
      ],
      ...(v[3]?.[3]
        ? {
            fromClause: [
              {
                RangeVar: {
                  relname: v[3]?.[3].value,
                  inh: true,
                  relpersistence: "p",
                  location: v[3]?.[3].pos,
                },
                codeComment: combineComments(v[3]?.[2], v[3]?.[4]?.[0]),
              },
            ],
          }
        : {}),
      ...(v[3]?.[4]?.[3]
        ? {
            whereClause: v[3]?.[4]?.[3].value,
            whereClauseCodeComment: combineComments(
              v[3]?.[4]?.[2],
              v[3]?.[4]?.[3].codeComment
            ),
          }
        : {}),
      op: 0,
    };
  }
);

export const selectStmt: Rule<SelectStmt> = transform(
  sequence([_, select, endOfStatement]),
  (v) => ({
    ...v[1],
    codeComment: combineComments(v[0], v[1].codeComment, v[2]),
  })
);
