import { Decoder } from "decoders";
export declare function tuple1<T>(decoder1: Decoder<T>): Decoder<[T]>;
export declare function tuple2<T>(decoder1: Decoder<T>): Decoder<[T, T]>;
