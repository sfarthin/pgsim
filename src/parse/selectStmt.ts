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
    transform(rawExpr, ({ value, comment }, ctx) => ({
      value,
      pos: ctx.pos,
      comment,
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
            transform(rawExpr, ({ value, comment }, ctx) => ({
              value,
              pos: ctx.pos,
              comment,
            })),
          ])
        ),
      ])
    ), // 4

    endOfStatement,
  ]),
  (v) => {
    return {
      comment: combineComments(
        v[0],
        v[2],
        v[3].comment,
        v[4]?.[0],
        v[4]?.[2],
        v[4]?.[4]?.[0],
        v[4]?.[4]?.[2],
        v[4]?.[4]?.[3].comment,
        v[5]
      ),
      targetList: [
        {
          ResTarget: {
            val: v[3].value,
            location: v[3].pos,
          },
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
              },
            ],
          }
        : {}),
      ...(v[4]?.[4]?.[3]
        ? {
            whereClause: v[4]?.[4]?.[3].value,
          }
        : {}),
      op: 0,
    };
  }
);
