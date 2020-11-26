import { number, exact, array, Decoder, unknown } from "decoders";
import { stringDecoder, PGString } from "./constant";

export type AExpr = {
  kind: number;
  name: PGString[];
  lexpr?: unknown; // <-- should be target value
  rexpr?: unknown; // <-- should be target value
  location: number;
};

export const aExprDecoder: Decoder<AExpr> = exact({
  kind: number,
  name: array(stringDecoder),
  lexpr: unknown,
  rexpr: unknown,
  location: number,
});
