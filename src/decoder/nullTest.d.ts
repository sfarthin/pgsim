import { Decoder } from "decoders";
export declare type NullTest = {
    arg?: unknown;
    nulltesttype: number;
    location: number;
};
export declare const nullTestDecoder: Decoder<NullTest>;
