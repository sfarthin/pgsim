import {
  number,
  constant,
  exact,
  Decoder,
  array,
  mixed,
  either,
} from "decoders";
import { PGString, stringDecoder } from "./constant";

export type FuncCall =
  | {
      funcname: PGString[];
      args: unknown[]; // <-- Should be TargetValue, but that is cyclic, so we have to do it at runtime
      location: number;
    }
  // Same as above but with agg_star
  | {
      funcname: PGString[];
      agg_star: boolean;
      location: number;
    };

export const funcCallDecoder: Decoder<FuncCall> = either(
  exact({
    funcname: array(stringDecoder),
    args: array(mixed),
    location: number,
  }),
  exact({
    funcname: array(stringDecoder),
    agg_star: constant(true),
    location: number,
  })
);
