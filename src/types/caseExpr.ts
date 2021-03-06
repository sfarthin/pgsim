import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { RawValue, rawValueDecoder } from "./rawExpr";

export type CaseWhen = {
  expr: RawValue;
  result: RawValue;
  location: Location;
};

export type CaseExpr = {
  args: { CaseWhen: CaseWhen }[];
  defresult?: RawValue;
  location: Location;
};

export const caseWhenDecoder: d.Decoder<CaseWhen> = d.exact({
  expr: (blob) => rawValueDecoder(blob),
  result: (blob) => rawValueDecoder(blob),
  location: locationDecoder,
});

export const caseExprDecoder: d.Decoder<CaseExpr> = d.exact({
  args: d.array(
    d.exact({
      CaseWhen: caseWhenDecoder,
    })
  ),
  defresult: d.optional((blob) => rawValueDecoder(blob)),
  location: locationDecoder,
});
