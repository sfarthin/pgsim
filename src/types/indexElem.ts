import * as d from "decoders";
import { rawValueDecoder } from "./rawExpr";

// export type IndexElem = {
//   ordering: "SORTBY_DEFAULT" | "SORTBY_DESC" | "SORTBY_ASC";
//   nulls_ordering:
//     | "SORTBY_NULLS_DEFAULT"
//     | "SORTBY_NULLS_FIRST"
//     | "SORTBY_NULLS_LAST";
// } & ({ name: string } | { expr: RawValue });

const shared = {
  ordering: d.oneOf(["SORTBY_DEFAULT", "SORTBY_DESC", "SORTBY_ASC"] as const),
  nulls_ordering: d.oneOf([
    "SORTBY_NULLS_DEFAULT",
    "SORTBY_NULLS_FIRST",
    "SORTBY_NULLS_LAST",
  ] as const),
};

export const indexElemDecoder = d.either(
  d.exact({
    ...shared,
    name: d.string,
  }),
  d.exact({
    ...shared,
    expr: rawValueDecoder,
  })
);

export type IndexElem = d.DecoderType<typeof indexElemDecoder>;
