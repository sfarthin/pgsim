import { Decoder } from "decoders";
import { JoinExpr } from "./joinExpr";
import { Alias } from "./alias";
import { RangeVar } from "./rangeVar";
export declare type RangeSubselect = {
    subquery?: unknown;
    alias: {
        Alias: Alias;
    };
    lateral?: boolean;
};
export declare const rangeSubselectDecoder: Decoder<RangeSubselect>;
export declare type FromClause = {
    RangeVar: RangeVar;
} | {
    JoinExpr: JoinExpr;
} | {
    RangeSubselect: RangeSubselect;
} | {
    RangeFunction?: unknown;
};
export declare const fromClauseDecoder: Decoder<FromClause>;
export declare const verifyFromClause: import("decoders").Guard<FromClause>;
