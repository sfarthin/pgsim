import { number, Decoder, exact, unknown } from "decoders";
import { Location, locationDecoder } from "./location";

export enum BoolOp {
  "AND" = 0,
  "OR" = 1,
  "NOT" = 2,
}

export type BoolExpr = {
  boolop: number;
  args?: unknown;
  location: Location;
};

export const boolExprDecoder: Decoder<BoolExpr> = exact({
  boolop: number,
  args: unknown,
  location: locationDecoder,
});
