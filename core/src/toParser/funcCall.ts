import {
  number,
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

export type FuncCall =
  | {
      funcname: PGString[];
      args: unknown[]; // <-- Should be TargetValue, but that is cyclic, so we have to do it at runtime
      func_variadic?: boolean; // select concat(variadic array [1,2,3])
      agg_distinct?: boolean;
      over?: unknown;
      location: number;
    }
  // Same as above but with agg_star
  | {
      funcname: PGString[];
      agg_star: boolean;
      func_variadic?: boolean;
      agg_distinct?: boolean;
      location: number;
    }
  // Same except no arguments
  | {
      funcname: PGString[];
      location: number;
    };

export const funcCallDecoder: Decoder<FuncCall> = either3(
  exact({
    funcname: array(stringDecoder),
    args: array(mixed),
    func_variadic: optional(boolean),
    agg_distinct: optional(boolean),
    over: optional(mixed),
    location: number,
  }),
  exact({
    funcname: array(stringDecoder),
    agg_star: constant(true),
    func_variadic: optional(boolean),
    agg_distinct: optional(boolean),
    location: number,
  }),
  exact({
    funcname: array(stringDecoder),
    location: number,
  })
);
