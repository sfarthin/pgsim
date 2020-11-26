import { Decoder } from "decoders";
import { PGString } from "./constant";
export declare type AExpr = {
    kind: number;
    name: PGString[];
    lexpr?: unknown;
    rexpr?: unknown;
    location: number;
};
export declare const aExprDecoder: Decoder<AExpr>;
