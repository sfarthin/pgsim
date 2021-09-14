import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { RawValue, rawValueDecoder } from "./rawExpr";

export type NullTest = {
  arg: RawValue;
  nulltesttype: number;
  location: Location;
};

export const nullTestDecoder: d.Decoder<NullTest> = d.exact({
  arg: (blob) => rawValueDecoder(blob),
  nulltesttype: d.number,
  location: locationDecoder,
});
