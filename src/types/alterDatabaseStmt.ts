import * as d from "decoders";
import { stringValueDecoder } from "./constant";

export const alterDatabaseStmtDecoder = d.exact({
  codeComment: d.optional(d.string),
  dbname: d.string,
  options: d.tuple1(
    d.exact({
      DefElem: d.exact({
        defname: d.constant("tablespace"),
        arg: d.exact({
          String: stringValueDecoder,
        }),
        defaction: d.constant("DEFELEM_UNSPEC"),
        location: d.number,
      }),
    })
  ),
});

export type AlterDatabaseStmt = d.DecoderType<typeof alterDatabaseStmtDecoder>;
