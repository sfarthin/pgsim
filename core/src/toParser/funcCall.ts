import {
  number,
  constant,
  exact,
  Decoder,
  array,
  mixed,
  either,
  optional,
  boolean,
} from "decoders";
import { PGString, stringDecoder } from "./constant";

export type FuncCall =
  | {
      funcname: PGString[];
      args: unknown[]; // <-- Should be TargetValue, but that is cyclic, so we have to do it at runtime
      func_variadic?: boolean; // select concat(variadic array [1,2,3])
      location: number;
    }
  // Same as above but with agg_star
  | {
      funcname: PGString[];
      agg_star: boolean;
      func_variadic?: boolean;
      location: number;
    };

export const funcCallDecoder: Decoder<FuncCall> = either(
  exact({
    funcname: array(stringDecoder),
    args: array(mixed),
    func_variadic: optional(boolean),
    location: number,
  }),
  exact({
    funcname: array(stringDecoder),
    agg_star: constant(true),
    func_variadic: optional(boolean),
    location: number,
  })
);
