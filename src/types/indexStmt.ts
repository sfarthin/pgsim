import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type IndexElem = {
  name: string;
  ordering: number;
  nulls_ordering: number;
};

export type IndexStmt = {
  idxname?: string;
  relation: {
    RangeVar: RangeVar;
  };

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
  ordering: d.number,
  nulls_ordering: d.number,
});

export const indexStmtDecoder: d.Decoder<IndexStmt> = d.exact({
  idxname: d.optional(d.string),
  relation: d.exact({ RangeVar: rangeVarDecoder }),
  accessMethod: d.either(
    d.constant("btree") as d.Decoder<"btree">,
    d.constant("hash") as d.Decoder<"hash">
  ),
  indexParams: d.array(d.exact({ IndexElem: indexElemDecoder })),
  unique: d.optional(d.boolean),
});
