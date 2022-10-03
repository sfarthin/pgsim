import * as d from "decoders";
import { selectStmtDecoder } from "./selectStmt";

export const createTableAsStmtDecoder = d.exact({
  query: d.exact({
    SelectStmt: selectStmtDecoder,
  }),
  into: d.exact({
    rel: d.exact({
      relname: d.string,
      inh: d.constant(true),
      relpersistence: d.constant("p"),
      location: d.number,
    }),
    onCommit: d.constant("ONCOMMIT_NOOP"),
  }),
  relkind: d.constant("OBJECT_MATVIEW"),
  codeComment: d.optional(d.string),
});

export type CreateTableAsStmt = d.DecoderType<typeof createTableAsStmtDecoder>;
