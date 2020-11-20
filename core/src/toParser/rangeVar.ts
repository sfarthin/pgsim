import { Decoder, string, exact, number, boolean, optional } from "decoders";
import { Alias, aliasDecoder } from "./alias";

export type RangeVar = {
  schemaname?: string;
  relname: string;
  // 0 = No, 1 = Yes, 2 = Default
  // https://docs.huihoo.com/doxygen/postgresql/primnodes_8h.html#a3a00c823fb80690cdf8373d6cb30b9c8
  inhOpt?: number;
  // p = permanent table, u = unlogged table, t = temporary table
  relpersistence: string;
  location: number;
  inh?: boolean /* inheritance requested? */;
  alias?: { Alias: Alias };
};

export const rangeVarDecoder: Decoder<RangeVar> = exact({
  schemaname: optional(string),
  relname: string,
  inhOpt: optional(number),
  relpersistence: string,
  location: number,
  inh: optional(boolean),
  alias: optional(exact({ Alias: aliasDecoder })),
});
