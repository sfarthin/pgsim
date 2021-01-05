import {
  Decoder,
  exact,
  string,
  number,
  either4,
  either3,
  unknown,
} from "decoders";
import { Location, locationDecoder } from "./location";

export type StringValue = { str: string };
export const stringValueDecoder: Decoder<StringValue> = exact({ str: string });
export type FloatValue = { str: string };
export const floatValueDecoder: Decoder<FloatValue> = exact({ str: string });
export type IntegerValue = { ival: number };
export const integerValueDecoder: Decoder<IntegerValue> = exact({
  ival: number,
});

export type Value = StringValue | FloatValue | IntegerValue;
export const valueDecoder: Decoder<Value> = either3(
  stringValueDecoder,
  floatValueDecoder,
  integerValueDecoder
);

export type Constant = {
  val: StringValue | FloatValue | IntegerValue;
};
export const constantDecoder: Decoder<Constant> = exact({
  val: either3(stringValueDecoder, floatValueDecoder, integerValueDecoder),
});

export type A_Const = {
  val:
    | { Float: FloatValue }
    | { String: StringValue }
    | { Integer: IntegerValue }
    | { Null: {} };
  location: Location;
};

export const aConstDecoder: Decoder<A_Const> = exact({
  val: either4(
    exact({ Float: floatValueDecoder }),
    exact({ String: stringValueDecoder }),
    exact({ Integer: integerValueDecoder }),
    exact({ Null: exact({}) })
  ),
  location: locationDecoder,
});

export type PGString = { String: StringValue };

export const stringDecoder: Decoder<PGString> = exact({
  String: stringValueDecoder,
});

export type Star = { A_Star?: unknown };

export const starDecoder: Decoder<Star> = exact({ A_Star: unknown });
