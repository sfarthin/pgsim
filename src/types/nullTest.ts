import { Decoder, exact, number, unknown } from "decoders";
import { Location, locationDecoder } from "./location";

export type NullTest = {
  arg?: unknown;
  nulltesttype: number;
  location: Location;
};

export const nullTestDecoder: Decoder<NullTest> = exact({
  arg: unknown,
  nulltesttype: number,
  location: locationDecoder,
});
