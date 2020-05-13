import { Decoder, object, string, number, either3, either } from "decoders";

export type StringValue = { str: string };
export const stringDecoder: Decoder<StringValue> = object({ str: string });
export type FloatValue = { str: string };
export const floatDecoder: Decoder<FloatValue> = object({ str: string });
export type IntegerValue = { ival: number };
export const integerDecoder: Decoder<IntegerValue> = object({ ival: number });

export type Value = StringValue | FloatValue | IntegerValue;
export const valueDecoder: Decoder<Value> = either3(
  stringDecoder,
  floatDecoder,
  integerDecoder
);

export type Constant = {
  val: StringValue | FloatValue | IntegerValue;
};
export const constantDecoder: Decoder<Constant> = object({
  val: either3(stringDecoder, floatDecoder, integerDecoder),
});

export type A_Const = {
  val:
    | { Float: FloatValue }
    | { String: StringValue }
    | { Integer: IntegerValue };
};

export const aConstDecoder = object({
  val: either3(
    object({ Float: floatDecoder }),
    object({ String: stringDecoder }),
    object({ Integer: integerDecoder })
  ),
});
