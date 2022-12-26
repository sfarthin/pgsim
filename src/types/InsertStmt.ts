import * as d from "decoders";
import { columnRefDecoder } from "./columnRef";
import { listDecoder } from "./list";
import { locationDecoder } from "./location";
import { rawValueDecoder } from "./rawExpr";
import { selectStmtDecoder } from "./selectStmt";

const colsDecoder = d.array(
  d.exact({
    ResTarget: d.exact({
      name: d.optional(d.string),
      location: locationDecoder,
    }),
  })
);

export type InsertCols = d.DecoderType<typeof colsDecoder>;

const relationInsertDecoder = d.exact({
  relname: d.string,
  inh: d.constant(true),
  relpersistence: d.constant("p"),
  location: d.number,
});

export type RelationInsert = d.DecoderType<typeof relationInsertDecoder>;

const returningInsertDecoder = d.array(
  d.exact({
    ResTarget: d.exact({
      val: d.exact({ ColumnRef: columnRefDecoder }),
      location: d.number,
    }),
  })
);

export type ReturningInsert = d.DecoderType<typeof returningInsertDecoder>;

export const insertStmtDecoder = d.exact({
  relation: relationInsertDecoder,
  cols: colsDecoder,
  selectStmt: d.exact({
    SelectStmt: d.either(
      d.exact({
        // https://www.postgresql.org/docs/current/queries-values.html
        valuesLists: d.array(d.exact({ List: listDecoder(rawValueDecoder) })),
        limitOption: d.constant("LIMIT_OPTION_DEFAULT"),
        op: d.constant("SETOP_NONE"),
      }),
      selectStmtDecoder
    ),
  }),

  returningList: d.optional(returningInsertDecoder),

  // returningList: d.unknown,
  override: d.constant("OVERRIDING_NOT_SET"),
  // onConflictClause: d.unknown,
  codeComment: d.optional(d.string),
});

export type InsertStmt = d.DecoderType<typeof insertStmtDecoder>;
