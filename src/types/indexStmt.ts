import * as d from "decoders";
import { indexElemDecoder } from "./indexElem";
import { rangeVarDecoder } from "./rangeVar";
import { rawValueDecoder } from "./rawExpr";

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
