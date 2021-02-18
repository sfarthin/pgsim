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
import { rawExpr } from "./rawExpr";
import { SelectStmt } from "../types";

export const selectStmt: Rule<SelectStmt> = transform(
  sequence([
    _,
    SELECT,
    __,
    transform(rawExpr, ({ value, codeComment }, ctx) => ({
      value,
      pos: ctx.pos,
      codeComment,
    })),
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
            transform(rawExpr, ({ value, codeComment }, ctx) => ({
              value,
              pos: ctx.pos,
              codeComment,
            })),
          ])
        ),
      ])
    ), // 4

    endOfStatement,
  ]),
  (v) => {
    return {
      codeComment: combineComments(v[0], v[5]),
      targetList: [
        {
          ResTarget: {
            val: v[3].value,
            location: v[3].pos,
          },
          codeComment: combineComments(v[2], v[3].codeComment, v[4]?.[0]),
        },
      ],
      ...(v[4]?.[3]
        ? {
            fromClause: [
              {
                RangeVar: {
                  relname: v[4]?.[3].value,
                  inh: true,
                  relpersistence: "p",
                  location: v[4]?.[3].pos,
                },
                codeComment: combineComments(v[4]?.[2], v[4]?.[4]?.[0]),
              },
            ],
          }
        : {}),
      ...(v[4]?.[4]?.[3]
        ? {
            whereClause: v[4]?.[4]?.[3].value,
            whereClauseCodeComment: combineComments(
              v[4]?.[4]?.[2],
              v[4]?.[4]?.[3].codeComment
            ),
          }
        : {}),
      op: 0,
    };
  }
);
