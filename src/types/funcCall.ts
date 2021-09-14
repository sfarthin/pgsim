import * as d from "decoders";
import { String, stringDecoder } from "./constant";
import { Location, locationDecoder } from "./location";
import { RawValue, rawValueDecoder } from "./rawExpr";

export type FuncCall = {
  funcname: { String: String }[];
  agg_star?: boolean;
  args?: RawValue[];
  func_variadic?: boolean; // select concat(variadic array [1,2,3])
  agg_distinct?: boolean;
  over?: unknown;
  location: Location;
};

export const funcCallDecoder: d.Decoder<FuncCall> = d.either3(
  d.exact({
    funcname: d.array(stringDecoder),
    args: d.optional(d.array((blob) => rawValueDecoder(blob))),
    func_variadic: d.optional(d.boolean),
    agg_distinct: d.optional(d.boolean),
    over: d.optional(d.mixed),
    location: locationDecoder,
  }),
  d.exact({
    funcname: d.array(stringDecoder),
    agg_star: d.constant(true),
    func_variadic: d.optional(d.boolean),
    agg_distinct: d.optional(d.boolean),
    location: locationDecoder,
  }),
  d.exact({
    funcname: d.array(stringDecoder),
    location: locationDecoder,
  })
);
