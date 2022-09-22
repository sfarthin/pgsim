import * as d from "decoders";
import { columnRefDecoder } from "./columnRef";
import { aConstDecoder, A_Const } from "./constant";
import { listDecoder } from "./list";
import { locationDecoder } from "./location";
import dispatch from "./dispatch";
import { ParamRef, paramRefDecoder } from "./paramRef";

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

export type InsertListItem = { A_Const: A_Const } | { ParamRef: ParamRef };

const listItem: d.Decoder<InsertListItem> = dispatch({
  A_Const: aConstDecoder,
  ParamRef: paramRefDecoder,
});

export const insertStmtDecoder = d.exact({
  relation: relationInsertDecoder,
  cols: colsDecoder,
  selectStmt: d.exact({
    SelectStmt: d.exact({
      valuesLists: d.array(d.exact({ List: listDecoder(listItem) })),
      limitOption: d.constant("LIMIT_OPTION_DEFAULT"),
      op: d.constant("SETOP_NONE"),
    }),
  }),

  returningList: d.optional(returningInsertDecoder),

  // returningList: d.unknown,
  override: d.constant("OVERRIDING_NOT_SET"),
  // onConflictClause: d.unknown,
  codeComment: d.optional(d.string),
});

export type InsertStmt = d.DecoderType<typeof insertStmtDecoder>;
