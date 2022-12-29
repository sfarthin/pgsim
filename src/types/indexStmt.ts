import * as d from "decoders";
import { rangeVarDecoder } from "./rangeVar";
import { rawValueDecoder } from "./rawExpr";

export type IndexElem = {
  name: string;
  ordering: "SORTBY_DEFAULT" | "SORTBY_DESC" | "SORTBY_ASC";
  nulls_ordering:
    | "SORTBY_NULLS_DEFAULT"
    | "SORTBY_NULLS_FIRST"
    | "SORTBY_NULLS_LAST";
};

const indexElemDecoder: d.Decoder<IndexElem> = d.exact({
  name: d.string,
  ordering: d.oneOf(["SORTBY_DEFAULT", "SORTBY_DESC", "SORTBY_ASC"] as const),
  nulls_ordering: d.oneOf([
    "SORTBY_NULLS_DEFAULT",
    "SORTBY_NULLS_FIRST",
    "SORTBY_NULLS_LAST",
  ] as const),
});

export const indexStmtDecoder = d.exact({
  idxname: d.optional(d.string),
  relation: rangeVarDecoder,
  accessMethod: d.either3(
    d.constant("btree"),
    d.constant("hash"),
    d.constant("gin")
  ),
  indexParams: d.array(d.exact({ IndexElem: indexElemDecoder })),
  unique: d.optional(d.boolean),
  whereClause: d.optional(rawValueDecoder),
  codeComment: d.optional(d.string),
  concurrent: d.optional(d.constant(true)),
});

export type IndexStmt = d.DecoderType<typeof indexStmtDecoder>;
