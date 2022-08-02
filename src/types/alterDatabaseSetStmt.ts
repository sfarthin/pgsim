import * as d from "decoders";
import { aConstDecoder } from "./constant";

export const alterDatabaseSetStmtDecoder = d.exact({
  codeComment: d.optional(d.string),
  dbname: d.string,
  setstmt: d.dispatch("kind", {
    VAR_SET_VALUE: d.exact({
      kind: d.constant("VAR_SET_VALUE"),
      name: d.string,
      args: d.array(d.exact({ A_Const: aConstDecoder })),
    }),
    VAR_SET_DEFAULT: d.exact({
      kind: d.constant("VAR_SET_DEFAULT"),
      name: d.string,
    }),
    VAR_SET_CURRENT: d.exact({
      kind: d.constant("VAR_SET_CURRENT"),
      name: d.string,
    }),
    VAR_RESET: d.exact({
      kind: d.constant("VAR_RESET"),
      name: d.string,
    }),
    VAR_RESET_ALL: d.exact({
      kind: d.constant("VAR_RESET_ALL"),
    }),
  }),
});

export type AlterDatabaseSetStmt = d.DecoderType<
  typeof alterDatabaseSetStmtDecoder
>;
