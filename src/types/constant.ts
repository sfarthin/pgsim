import * as d from "decoders";
import { Location, locationDecoder } from "./location";

export type StringValue = { str: string };
export const stringValueDecoder: d.Decoder<StringValue> = d.exact({
  str: d.string,
});
export type FloatValue = { str: string };
export const floatValueDecoder: d.Decoder<FloatValue> = d.exact({
  str: d.string,
});
export type IntegerValue = { ival: number };
export const integerValueDecoder: d.Decoder<IntegerValue> = d.exact({
  ival: d.number,
});

export type Value = StringValue | FloatValue | IntegerValue;
export const valueDecoder: d.Decoder<Value> = d.either3(
  stringValueDecoder,
  floatValueDecoder,
  integerValueDecoder
);

export type Constant = {
  val: StringValue | FloatValue | IntegerValue;
};
export const constantDecoder: d.Decoder<Constant> = d.exact({
  val: d.either3(stringValueDecoder, floatValueDecoder, integerValueDecoder),
});

export type A_Const = {
  val:
    | { Float: FloatValue }
    | { String: StringValue }
    | { Integer: IntegerValue }
    | { Null: {} };
  location: Location;
};

export const aConstDecoder: d.Decoder<A_Const> = d.exact({
  val: d.either4(
    d.exact({ Float: floatValueDecoder }),
    d.exact({ String: stringValueDecoder }),
    d.exact({ Integer: integerValueDecoder }),
    d.exact({ Null: d.exact({}) })
  ),
  location: locationDecoder,
});

export type PGString = { String: StringValue };

export const stringDecoder: d.Decoder<PGString> = d.exact({
  String: stringValueDecoder,
});

export type Star = { A_Star: {} };

export const starDecoder: d.Decoder<Star> = d.exact({ A_Star: d.exact({}) });
