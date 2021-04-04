import * as d from "decoders";
import { RawValue, rawValueDecoder } from "./rawExpr";
import { Location, locationDecoder } from "./location";

export enum SortByDir {
  SORTBY_DEFAULT = 0,
  SORTBY_ASC = 1,
  SORTBY_DESC = 2,
  SORTBY_USING = 3 /* not allowed in CREATE INDEX ... */,
}

export type SortBy = {
  node: RawValue;
  sortby_dir: SortByDir;
  sortby_nulls: number;
  location: Location;
  codeComment?: string;
};

export const sortByDecoder: d.Decoder<SortBy> = d.exact({
  node: (blob) => rawValueDecoder(blob),
  sortby_dir: d.oneOf(Object.values(SortByDir)) as d.Decoder<SortByDir>,
  sortby_nulls: d.number,
  location: locationDecoder,
  codeComment: d.optional(d.string),
});
