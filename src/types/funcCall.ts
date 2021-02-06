import {
  constant,
  exact,
  Decoder,
  array,
  mixed,
  either3,
  optional,
  boolean,
} from "decoders";
import { PGString, stringDecoder } from "./constant";
import { Location, locationDecoder } from "./location";
import { RawExpr } from "./rawExpr";
import { rawExprDecoder } from "./rawExpr";

export type FuncCall = {
  funcname: PGString[];
  agg_star?: boolean;
  args?: RawExpr[];
  func_variadic?: boolean; // select concat(variadic array [1,2,3])
  agg_distinct?: boolean;
  over?: unknown;
  location: Location;
};

export const funcCallDecoder: Decoder<FuncCall> = either3(
  exact({
    funcname: array(stringDecoder),
    args: optional(array((blob) => rawExprDecoder(blob))),
    func_variadic: optional(boolean),
    agg_distinct: optional(boolean),
    over: optional(mixed),
    location: locationDecoder,
  }),
  exact({
    funcname: array(stringDecoder),
    agg_star: constant(true),
    func_variadic: optional(boolean),
    agg_distinct: optional(boolean),
    location: locationDecoder,
  }),
  exact({
    funcname: array(stringDecoder),
    location: locationDecoder,
  })
);
