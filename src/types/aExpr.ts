import { number, exact, array, Decoder } from "decoders";
import { stringDecoder, PGString } from "./constant";
import { Location, locationDecoder } from "./location";
import { RawExpr, rawExprDecoder } from "./rawExpr";

export type AExpr = {
  kind: number;
  name: PGString[];
  lexpr: RawExpr;
  rexpr: RawExpr;
  location: Location;
};

export const aExprDecoder: Decoder<AExpr> = exact({
  kind: number,
  name: array(stringDecoder),
  lexpr: (blob) => rawExprDecoder(blob),
  rexpr: (blob) => rawExprDecoder(blob),
  location: locationDecoder,
});
