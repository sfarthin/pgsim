import { Decoder, exact, string, number, either3, mixed } from "decoders";

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
    | { Integer: IntegerValue };
  location: number;
};

export const aConstDecoder = exact({
  val: either3(
    exact({ Float: floatValueDecoder }),
    exact({ String: stringValueDecoder }),
    exact({ Integer: integerValueDecoder })
  ),
  location: number,
});

export type PGString = { String: StringValue };

export const stringDecoder: Decoder<PGString> = exact({
  String: stringValueDecoder,
});

export type Star = { A_Star: unknown };

export const starDecoder = exact({ A_Star: mixed });
