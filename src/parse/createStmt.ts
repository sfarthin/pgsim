import {
  transform,
  CREATE,
  TABLE,
  identifier,
  Rule,
  endOfStatement,
  optional,
  ifNotExists,
  combineComments,
  LPAREN,
  RPAREN,
  COMMA,
  finalizeComment,
  sequence,
  __,
  _,
  zeroToMany,
  commentsOnSameLine,
  or,
  PERIOD,
} from "./util";
import { ColumnDef, Constraint, CreateStmt } from "../types";
import { columnDef } from "./columnDef";
import { tableConstraint } from "./constraint";

const columnDefOrConstraint: Rule<
  ({ ColumnDef: ColumnDef } | { Constraint: Constraint })[]
> = transform(
  sequence([
    zeroToMany(
      sequence([
        __,
        or([columnDef, tableConstraint]),
        __,
        COMMA,
        commentsOnSameLine,
      ])
    ),
    __,
    or([columnDef, tableConstraint]),
    __,
  ]),

  (v) => {
    return [
      ...v[0].map((i) => {
        const columnDefOrTableConstraint = i[1];
        return {
          ...columnDefOrTableConstraint,
          comment: combineComments(
            i[0],
            columnDefOrTableConstraint.comment,
            i[2],
            i[4]
          ),
        };
      }),
      { ...v[2], comment: combineComments(v[1], v[2].comment, v[3]) },
    ].map((c) => {
      return "colname" in c
        ? {
            ColumnDef: c,
          }
        : { Constraint: c };
    });
  }
);

const columnDefs = transform(
  sequence([LPAREN, columnDefOrConstraint, RPAREN]),
  (v) => {
    return v[1];
  }
);

export const createStmt: Rule<CreateStmt> = transform(
  sequence([
    _,
    CREATE,
    __,
    TABLE,
    __,
    optional(ifNotExists),
    __,
    transform(
      sequence([optional(sequence([identifier, PERIOD])), identifier]),
      (v, ctx) => ({
        RangeVar: {
          ...(v[0] ? { schemaname: v[0][0] } : {}),
          relname: v[1],
          relpersistence: "p" as const,
          inh: true,
          location: ctx.pos,
        },
      })
    ),
    __,
    columnDefs,
    __,
    endOfStatement,
  ]),

  (value) => {
    const tableElts = value[9];
    const relation = value[7];
    const ifNotExists = value[5];
    const comment = combineComments(
      value[0],
      value[2],
      value[4],
      value[6],
      value[8],
      value[10]
    );

    return {
      relation,
      tableElts,
      oncommit: 0,
      ...(ifNotExists ? { if_not_exists: true } : {}),
      comment: finalizeComment(comment),
    };
  }
);
