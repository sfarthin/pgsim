import { Decoder } from "decoders";
export declare type StringValue = {
    str: string;
};
export declare const stringValueDecoder: Decoder<StringValue>;
export declare type FloatValue = {
    str: string;
};
export declare const floatValueDecoder: Decoder<FloatValue>;
export declare type IntegerValue = {
    ival: number;
};
export declare const integerValueDecoder: Decoder<IntegerValue>;
export declare type Value = StringValue | FloatValue | IntegerValue;
export declare const valueDecoder: Decoder<Value>;
export declare type Constant = {
    val: StringValue | FloatValue | IntegerValue;
};
export declare const constantDecoder: Decoder<Constant>;
export declare type A_Const = {
    val: {
        Float: FloatValue;
    } | {
        String: StringValue;
    } | {
        Integer: IntegerValue;
    } | {
        Null: {};
    };
    location: number;
};
export declare const aConstDecoder: Decoder<A_Const>;
export declare type PGString = {
    String: StringValue;
};
export declare const stringDecoder: Decoder<PGString>;
export declare type Star = {
    A_Star?: unknown;
};
export declare const starDecoder: Decoder<Star>;
