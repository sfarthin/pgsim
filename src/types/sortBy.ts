import * as d from "decoders";
import { RawValue, rawValueDecoder } from "./rawExpr";
import { Location, locationDecoder } from "./location";

export enum SortByDir {
  SORTBY_DEFAULT = "SORTBY_DEFAULT",
  SORTBY_ASC = "SORTBY_ASC",
  SORTBY_DESC = "SORTBY_DESC",
  SORTBY_USING = "SORTBY_USING" /* not allowed in CREATE INDEX ... */,
}

export type SortBy = {
  node: RawValue;
  sortby_dir: SortByDir;
  sortby_nulls: "SORTBY_NULLS_DEFAULT";
  location: Location;
  codeComment?: string;
};

export const sortByDecoder: d.Decoder<SortBy> = d.exact({
  node: (blob) => rawValueDecoder(blob),
  sortby_dir: d.oneOf(Object.values(SortByDir)) as d.Decoder<SortByDir>,
  sortby_nulls: d.constant("SORTBY_NULLS_DEFAULT"),
  location: locationDecoder,
  codeComment: d.optional(d.string),
});
