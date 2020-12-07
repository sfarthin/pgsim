import {
  Decoder,
  exact,
  string,
  number,
  either4,
  either3,
  unknown,
  optional,
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
    | { Float: FloatValue; comment?: string }
    | { String: StringValue; comment?: string }
    | { Integer: IntegerValue; comment?: string }
    | { Null: {}; comment?: string };
  location: Location;
};

export const aConstDecoder: Decoder<A_Const> = exact({
  val: either4(
    exact({ Float: floatValueDecoder, comment: optional(string) }),
    exact({ String: stringValueDecoder, comment: optional(string) }),
    exact({ Integer: integerValueDecoder, comment: optional(string) }),
    exact({ Null: exact({}) })
  ),
  location: locationDecoder,
});

export type PGString = { String: StringValue; comment?: string };

export const stringDecoder: Decoder<PGString> = exact({
  String: stringValueDecoder,
  comment: optional(string),
});

export type Star = { A_Star?: unknown };

export const starDecoder: Decoder<Star> = exact({ A_Star: unknown });
