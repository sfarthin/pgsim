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

export type A_Const_String = {
  val: { String: String };
  location: Location;
};

export const aConstStringDecoder = d.exact({
  val: d.exact({ String: stringValueDecoder }),
  location: locationDecoder,
});

export type A_Const_Float = {
  val: { Float: Float };
  location: Location;
};

export type A_Const_Integer = {
  val: { Integer: Integer };
  location: Location;
};

export type A_Const_Null = {
  val: { Null: Null };
  location: Location;
};

export type A_Const =
  | A_Const_String
  | A_Const_Float
  | A_Const_Integer
  | A_Const_Null;

export const aConstDecoder: d.Decoder<A_Const> = d.either4(
  d.exact({
    val: d.exact({ Float: floatValueDecoder }),
    location: locationDecoder,
  }),
  aConstStringDecoder,
  d.exact({
    val: d.exact({ Integer: integerValueDecoder }),
    location: locationDecoder,
  }),
  d.exact({ val: d.exact({ Null: d.exact({}) }), location: locationDecoder })
);

export const stringDecoder: d.Decoder<{ String: String }> = d.exact({
  String: stringValueDecoder,
});

export type A_Star = {};

export const starDecoder: d.Decoder<{ A_Star: A_Star }> = d.exact({
  A_Star: d.exact({}),
});
