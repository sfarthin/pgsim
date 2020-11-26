import { Decoder } from "decoders";
import { PGString } from "./constant";
export declare type FuncCall = {
    funcname: PGString[];
    args: unknown[];
    func_variadic?: boolean;
    agg_distinct?: boolean;
    over?: unknown;
    location: number;
} | {
    funcname: PGString[];
    agg_star: boolean;
    func_variadic?: boolean;
    agg_distinct?: boolean;
    location: number;
} | {
    funcname: PGString[];
    location: number;
};
export declare const funcCallDecoder: Decoder<FuncCall>;
