import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { rawValueDecoder, RawValue } from "./rawExpr";

export type ResTarget = {
  name?: string;
  val: RawValue;
  location: Location;
};

export const resTargetDecoder: d.Decoder<ResTarget> = d.exact({
  name: d.optional(d.string),
  val: (blob) => rawValueDecoder(blob),
  location: locationDecoder,
});
