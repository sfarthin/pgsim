import * as d from "decoders";
import { rangeVarDecoder } from "./rangeVar";

export type IndexElem = {
  name: string;
  ordering: "SORTBY_DEFAULT";
  nulls_ordering: "SORTBY_NULLS_DEFAULT";
};

const indexElemDecoder: d.Decoder<IndexElem> = d.exact({
  name: d.string,
  ordering: d.constant("SORTBY_DEFAULT"),
  nulls_ordering: d.constant("SORTBY_NULLS_DEFAULT"),
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
  codeComment: d.optional(d.string),
});

export type IndexStmt = d.DecoderType<typeof indexStmtDecoder>;
