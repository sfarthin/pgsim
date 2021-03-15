import { Location, locationDecoder } from "./location";
import { RawValue, rawValueDecoder } from "./rawExpr";
import * as d from "decoders";

export type RowExpr = {
  args: RawValue[];
  row_format: 2;
  location: Location;
};

export const rowExprDecoder: d.Decoder<RowExpr> = d.exact({
  args: d.array((blob) => rawValueDecoder(blob)),
  row_format: d.constant(2) as d.Decoder<2>,
  location: locationDecoder,
});
