import { number, exact, array, Decoder, unknown } from "decoders";
import { stringDecoder, PGString } from "./constant";
import { Location, locationDecoder } from "./location";

export type AExpr = {
  kind: number;
  name: PGString[];
  lexpr?: unknown; // <-- should be target value
  rexpr?: unknown; // <-- should be target value
  location: Location;
};

export const aExprDecoder: Decoder<AExpr> = exact({
  kind: number,
  name: array(stringDecoder),
  lexpr: unknown,
  rexpr: unknown,
  location: locationDecoder,
});
