import * as d from "decoders";
import { Alias, aliasDecoder } from "./alias";
import { Location, locationDecoder } from "./location";

/*
 * RangeVar - range variable, used in FROM clauses
 *
 * Also used to represent table names in utility statements; there, the alias
 * field is not used, and inh tells whether to apply the operation
 * recursively to child tables.  In some contexts it is also useful to carry
 * a TEMP table indication here.
 */

export type RangeVar = {
  schemaname?: string;
  relname: string;
  // 0 = No, 1 = Yes, 2 = Default
  // https://docs.huihoo.com/doxygen/postgresql/primnodes_8h.html#a3a00c823fb80690cdf8373d6cb30b9c8
  inhOpt?: number;
  // p = permanent table, u = unlogged table, t = temporary table
  relpersistence: "p" | "u" | "t";
  location: Location;
  inh?: boolean /* inheritance requested? */;
  alias?: Alias;
};

export const rangeVarDecoder: d.Decoder<RangeVar> = d.exact({
  schemaname: d.optional(d.string),
  relname: d.string,
  inhOpt: d.optional(d.number),
  relpersistence: d.either3(d.constant("p"), d.constant("u"), d.constant("t")),
  location: locationDecoder,
  inh: d.optional(d.boolean),
  alias: d.optional(aliasDecoder),
});
