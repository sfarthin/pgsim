import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import {
  RawCondition,
  rawConditionDecoder,
  RawValue,
  rawValueDecoder,
} from "./rawExpr";

export type CaseWhen = {
  expr: RawCondition;
  result: RawValue;
  location: Location;
};

export type CaseExpr = {
  args: { CaseWhen: CaseWhen }[];
  location: Location;
};

export const caseWhenDecoder: d.Decoder<CaseWhen> = d.exact({
  expr: (blob) => rawConditionDecoder(blob),
  result: (blob) => rawValueDecoder(blob),
  location: locationDecoder,
});

export const caseExprDecoder: d.Decoder<CaseExpr> = d.exact({
  args: d.array(
    d.exact({
      CaseWhen: caseWhenDecoder,
    })
  ),
  location: locationDecoder,
});
