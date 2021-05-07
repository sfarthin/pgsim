import * as d from "decoders";
import { Location, locationDecoder } from "./location";

export type String = { str: string };
export const stringValueDecoder: d.Decoder<String> = d.exact({
  str: d.string,
});
export type Float = { str: string };
export const floatValueDecoder: d.Decoder<Float> = d.exact({
  str: d.string,
});
export type Integer = { ival: number };
export const integerValueDecoder: d.Decoder<Integer> = d.exact({
  ival: d.number,
});

export type Value = String | Float | Integer;
export const valueDecoder: d.Decoder<Value> = d.either3(
  stringValueDecoder,
  floatValueDecoder,
  integerValueDecoder
);

export type Constant = {
  val: String | Float | Integer;
};
export const constantDecoder: d.Decoder<Constant> = d.exact({
  val: d.either3(stringValueDecoder, floatValueDecoder, integerValueDecoder),
});

export type Null = {};
export type A_Const = {
  val:
    | { Float: Float }
    | { String: String }
    | { Integer: Integer }
    | { Null: Null };
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

export const stringDecoder: d.Decoder<{ String: String }> = d.exact({
  String: stringValueDecoder,
});

export type A_Star = {};

export const starDecoder: d.Decoder<{ A_Star: A_Star }> = d.exact({
  A_Star: d.exact({}),
});
