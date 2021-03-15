import * as d from "decoders";
import { tuple1 } from "decoders/tuple";
import { Location, locationDecoder } from "./location";
import { RawCondition, rawConditionDecoder } from "./rawExpr";

export enum BoolOp {
  "AND" = 0,
  "OR" = 1,
  "NOT" = 2,
}

export type BoolExpr =
  | {
      boolop: BoolOp.NOT;
      args: [RawCondition];
      location: Location;
    }
  | {
      boolop: BoolOp.AND | BoolOp.OR;
      args: RawCondition[];
      location: Location;
    };

export const boolExprDecoder: d.Decoder<BoolExpr> = d.either(
  d.exact({
    boolop: d.constant(BoolOp.NOT) as d.Decoder<BoolOp.NOT>,
    args: tuple1((blob) => rawConditionDecoder(blob)),
    location: locationDecoder,
  }),
  d.exact({
    boolop: d.either(
      d.constant(BoolOp.AND) as d.Decoder<BoolOp.AND>,
      d.constant(BoolOp.OR) as d.Decoder<BoolOp.OR>
    ),
    args: d.array((blob) => rawConditionDecoder(blob)),
    location: locationDecoder,
  })
);
