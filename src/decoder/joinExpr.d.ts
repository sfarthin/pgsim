import { Decoder } from "decoders";
export declare type JoinExpr = {
    jointype: number;
    larg?: unknown;
    rarg?: unknown;
    quals?: unknown;
    isNatural?: unknown;
    usingClause?: unknown;
    alias?: unknown;
};
export declare const joinExprDecoder: Decoder<JoinExpr>;
