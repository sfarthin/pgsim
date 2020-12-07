import { Decoder, exact, number, unknown } from "decoders";
import { Location, locationDecoder } from "./location";

export type BooleanTest = {
  arg?: unknown;
  booltesttype: number;
  location: Location;
};

export const booleanTestDecoder: Decoder<BooleanTest> = exact({
  arg: unknown,
  booltesttype: number,
  location: locationDecoder,
});
