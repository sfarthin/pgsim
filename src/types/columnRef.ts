import * as d from "decoders";
import { String, stringDecoder, A_Star, starDecoder } from "./constant";
import { Location, locationDecoder } from "./location";

export type ColumnRef = {
  fields:
    | [{ A_Star: A_Star }]
    | [{ String: String }]
    | [{ String: String }, { String: String }]
    | [{ String: String }, { A_Star: A_Star }];
  location: Location;
};

export const columnRefDecoder: d.Decoder<ColumnRef> = d.exact({
  fields: d.either4(
    d.tuple1(starDecoder),
    d.tuple1(stringDecoder),
    d.tuple2(stringDecoder, stringDecoder),
    d.tuple2(stringDecoder, starDecoder)
  ),
  location: locationDecoder,
});
