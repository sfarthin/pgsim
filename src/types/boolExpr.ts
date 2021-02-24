import * as d from "decoders";
import { tuple1, tuple2 } from "decoders/tuple";
import { Location, locationDecoder } from "./location";
import { RawExpr, rawExprDecoder } from "./rawExpr";

export enum BoolOp {
  "AND" = 0,
  "OR" = 1,
  "NOT" = 2,
}

export type BoolExpr =
  | {
      boolop: BoolOp.NOT;
      args?: [RawExpr];
      location: Location;
    }
  | {
      boolop: BoolOp.AND | BoolOp.OR;
      args?: [RawExpr, RawExpr];
      location: Location;
    };

export const boolExprDecoder: d.Decoder<BoolExpr> = d.either(
  d.exact({
    boolop: d.constant(BoolOp.NOT) as d.Decoder<BoolOp.NOT>,
    args: tuple1((blob) => rawExprDecoder(blob)),
    location: locationDecoder,
  }),
  d.exact({
    boolop: d.either(
      d.constant(BoolOp.AND) as d.Decoder<BoolOp.AND>,
      d.constant(BoolOp.OR) as d.Decoder<BoolOp.OR>
    ),
    args: tuple2(
      (blob) => rawExprDecoder(blob),
      (blob) => rawExprDecoder(blob)
    ),
    location: locationDecoder,
  })
);
