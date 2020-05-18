import { string, exact, number, optional } from "decoders";
import { Alias, aliasDecoder } from "./alias";

export type RangeVar = {
  schemaname?: string;
  relname: string;
  // 0 = No, 1 = Yes, 2 = Default
  // https://docs.huihoo.com/doxygen/postgresql/primnodes_8h.html#a3a00c823fb80690cdf8373d6cb30b9c8
  inhOpt: number;
  // p = permanent table, u = unlogged table, t = temporary table
  relpersistence: string;
  location: number;
  alias?: { Alias: Alias };
};

export const rangeVarDecoder = exact({
  schemaname: optional(string),
  relname: string,
  inhOpt: number,
  relpersistence: string,
  location: number,
  alias: optional(exact({ Alias: aliasDecoder })),
});
