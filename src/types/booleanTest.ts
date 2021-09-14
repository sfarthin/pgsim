import * as d from "decoders";
import { Location, locationDecoder } from "./location";

export type BooleanTest = {
  arg?: unknown;
  booltesttype: number;
  location: Location;
};

export const booleanTestDecoder: d.Decoder<BooleanTest> = d.exact({
  arg: d.unknown,
  booltesttype: d.number,
  location: locationDecoder,
});
