import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { RawValue, rawValueDecoder } from "./rawExpr";

export type NullTest = {
  arg: RawValue;
  nulltesttype: "IS_NOT_NULL" | "IS_NULL";
  location: Location;
};

export const nullTestDecoder: d.Decoder<NullTest> = d.exact({
  arg: (blob) => rawValueDecoder(blob),
  nulltesttype: d.either(d.constant("IS_NOT_NULL"), d.constant("IS_NULL")),
  location: locationDecoder,
});
