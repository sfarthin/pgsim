import { exact, Decoder, either4, tuple2 } from "decoders";
import { tuple1 } from "./tuple1";
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

export const columnRefDecoder: Decoder<ColumnRef> = exact({
  fields: either4(
    tuple1(starDecoder),
    tuple1(stringDecoder),
    tuple2(stringDecoder, stringDecoder),
    tuple2(stringDecoder, starDecoder)
  ),
  location: locationDecoder,
});
