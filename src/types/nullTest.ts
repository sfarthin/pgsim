import { Decoder, exact, number, unknown } from "decoders";
import { Location, locationDecoder } from "./location";
import { RawValue, rawValueDecoder } from "./rawExpr";

export type NullTest = {
  arg: RawValue;
  nulltesttype: number;
  location: Location;
};

export const nullTestDecoder: Decoder<NullTest> = exact({
  arg: (blob) => rawValueDecoder(blob),
  nulltesttype: number,
  location: locationDecoder,
});
