import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type IndexElem = {
  name: string;
  ordering: "SORTBY_DEFAULT";
  nulls_ordering: "SORTBY_NULLS_DEFAULT";
};

export type IndexStmt = {
  idxname?: string;
  relation: RangeVar;

  // B-tree, Hash, GiST, SP-GiST and GIN
  accessMethod: "btree" | "hash";
  indexParams: {
    IndexElem: IndexElem;
  }[];
  unique?: boolean;
  codeComment?: string;
};

const indexElemDecoder: d.Decoder<IndexElem> = d.exact({
  name: d.string,
  ordering: d.constant("SORTBY_DEFAULT"),
  nulls_ordering: d.constant("SORTBY_NULLS_DEFAULT"),
});

export const indexStmtDecoder: d.Decoder<IndexStmt> = d.exact({
  idxname: d.optional(d.string),
  relation: rangeVarDecoder,
  accessMethod: d.either(
    d.constant("btree") as d.Decoder<"btree">,
    d.constant("hash") as d.Decoder<"hash">
  ),
  indexParams: d.array(d.exact({ IndexElem: indexElemDecoder })),
  unique: d.optional(d.boolean),
});
