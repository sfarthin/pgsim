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
} from "./util";
import { CreateStmt, RangeVar } from "~/types";
import { columnDef } from "./columnDef";

const columnDefs = transform(
  sequence([
    LPAREN,
    zeroToMany(sequence([columnDef, COMMA, commentsOnSameLine])),
    columnDef,
    commentsOnSameLine,
    __,
    RPAREN,
  ]),
  (v) => {
    return {
      value: [
        ...v[1].map((i) => ({
          ...i[0],
          comment: combineComments(i[0].comment, i[2]),
        })),
        { ...v[2], comment: combineComments(v[2].comment, v[3]) },
      ].map((ColumnDef) => ({
        ColumnDef,
      })),
      comment: v[4],
    };
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
    transform(identifier, (v, ctx) => ({
      RangeVar: {
        relname: v,
        relpersistence: "p",
        inh: true,
        location: ctx.pos,
      },
    })) as Rule<{ RangeVar: RangeVar }>,
    __,
    columnDefs,
    __,
    endOfStatement,
  ]),

  (value) => {
    const tableElts = value[9].value;
    const relation = value[7];
    const ifNotExists = value[5];
    const comment = combineComments(
      value[0],
      value[2],
      value[4],
      value[6],
      value[8],
      value[9].comment,
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
