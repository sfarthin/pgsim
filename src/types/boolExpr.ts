import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { RawValue, rawValueDecoder } from "./rawExpr";

export enum BoolOp {
  AND_EXPR = "AND_EXPR",
  OR_EXPR = "OR_EXPR",
  NOT_EXPR = "NOT_EXPR",
}

export type BoolExpr =
  | {
      boolop: BoolOp.NOT_EXPR;
      args: [RawValue];
      location: Location;
    }
  | {
      boolop: BoolOp.AND_EXPR;
      args: RawValue[];
      location: Location;
    }
  | {
      boolop: BoolOp.OR_EXPR;
      args: RawValue[];
      location: Location;
    };

export const boolExprDecoder: d.Decoder<BoolExpr> = d.dispatch("boolop", {
  [BoolOp.NOT_EXPR]: d.exact({
    boolop: d.constant(BoolOp.NOT_EXPR),
    args: d.tuple1((blob) => rawValueDecoder(blob)),
    location: locationDecoder,
  }),
  [BoolOp.AND_EXPR]: d.exact({
    boolop: d.constant(BoolOp.AND_EXPR),
    args: d.array((blob) => rawValueDecoder(blob)),
    location: locationDecoder,
  }),
  [BoolOp.OR_EXPR]: d.exact({
    boolop: d.constant(BoolOp.OR_EXPR),
    args: d.array((blob) => rawValueDecoder(blob)),
    location: locationDecoder,
  }),
});
