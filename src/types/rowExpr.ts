import { Location, locationDecoder } from "./location";
import { RawValue, rawValueDecoder } from "./rawExpr";
import * as d from "decoders";

export type RowExpr = {
  args: RawValue[];
  row_format: "COERCE_IMPLICIT_CAST";
  location: Location;
};

export const rowExprDecoder: d.Decoder<RowExpr> = d.exact({
  args: d.array((blob) => rawValueDecoder(blob)),
  row_format: d.constant("COERCE_IMPLICIT_CAST"),
  location: locationDecoder,
});
