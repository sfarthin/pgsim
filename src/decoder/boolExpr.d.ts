import { Decoder } from "decoders";
export declare enum BoolOp {
    "AND" = 0,
    "OR" = 1,
    "NOT" = 2
}
export declare type BoolExpr = {
    boolop: number;
    args?: unknown;
    location: number;
};
export declare const boolExprDecoder: Decoder<BoolExpr>;
