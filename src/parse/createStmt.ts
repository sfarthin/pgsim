import {
  transform,
  CREATE,
  TABLE,
  identifier,
  listWithCommentsPerItem,
  Rule,
  phrase,
  endOfStatement,
  optional,
  ifNotExists,
  combineComments,
  sequence,
  LPAREN,
  RPAREN,
  COMMA,
  finalizeComment,
} from "./util";
import { CreateStmt, RangeVar } from "~/types";
import { columnDef } from "./columnDef";

const columnDefs = transform(
  sequence([LPAREN, listWithCommentsPerItem(columnDef, COMMA), RPAREN]),
  (v) => {
    return {
      value: v[1].value.map((i) => {
        // console.log("-->", combineComments(i.comment, i.value.comment).trim());
        return {
          ColumnDef: {
            ...i.value,
            comment: finalizeComment(
              combineComments(i.comment, i.value.comment)
            ),
          },
        };
      }),
      comment: v[1].comment,
    };
  }
);

export const createStmt: Rule<CreateStmt> = transform(
  phrase([
    CREATE,
    TABLE,
    optional(ifNotExists),
    transform(identifier, (v, ctx) => ({
      RangeVar: {
        relname: v,
        relpersistence: "p",
        inh: true,
        location: ctx.pos,
      },
    })) as Rule<{ RangeVar: RangeVar }>,
    columnDefs,
    endOfStatement,
  ]),

  ({ value, comment }) => {
    const tableElts = value[4].value;

    return {
      relation: value[3],
      tableElts,
      oncommit: 0,
      ...(value[2] ? { if_not_exists: true } : {}),
      comment: finalizeComment(
        combineComments(comment, value[4].comment, value[5])
      ),
    };
  }
);
