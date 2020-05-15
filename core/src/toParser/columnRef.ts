import { number, exact, Decoder, either3, tuple2 } from "decoders";
import { tuple1 } from "./tuple1";
import { PGString, stringDecoder, Star, starDecoder } from "./constant";

export type ColumnRef = {
  fields: [PGString] | [PGString, PGString] | [PGString, Star];
  location: number;
};

export const columnRefDecoder: Decoder<ColumnRef> = exact({
  fields: either3(
    tuple1(stringDecoder),
    tuple2(stringDecoder, stringDecoder),
    tuple2(stringDecoder, starDecoder)
  ),
  location: number,
});
