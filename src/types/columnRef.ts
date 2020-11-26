import { number, exact, Decoder, either4, tuple2 } from "decoders";
import { tuple1 } from "./tuple1";
import { PGString, stringDecoder, Star, starDecoder } from "./constant";

export type ColumnRef = {
  fields: [Star] | [PGString] | [PGString, PGString] | [PGString, Star];
  location: number;
};

export const columnRefDecoder: Decoder<ColumnRef> = exact({
  fields: either4(
    tuple1(starDecoder),
    tuple1(stringDecoder),
    tuple2(stringDecoder, stringDecoder),
    tuple2(stringDecoder, starDecoder)
  ),
  location: number,
});
