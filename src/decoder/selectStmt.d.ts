import { Decoder } from "decoders";
import { TargetValue } from "./targetValue";
export declare type ResTarget = {
    name?: string;
    val: TargetValue;
    location: number;
};
export declare const resTargetDecoder: Decoder<ResTarget>;
export declare const verifyResTarget: import("decoders").Guard<ResTarget>;
export declare type SelectStmt = {
    op: number;
    targetList: {
        ResTarget?: unknown;
    }[];
    fromClause?: unknown;
    whereClause?: unknown;
    groupClause?: unknown;
    withClause?: unknown;
    intoClause?: unknown;
    limitOffset?: unknown;
    limitCount?: unknown;
    distinctClause?: unknown;
    havingClause?: unknown;
    lockingClause?: unknown;
    sortClause?: unknown;
} | {
    op: number;
    valuesLists?: unknown;
    fromClause?: unknown;
    whereClause?: unknown;
    sortClause?: unknown;
} | {
    op: number;
    larg?: unknown;
    rarg?: unknown;
    all?: unknown;
    sortClause?: unknown;
    lockingClause?: unknown;
    limitCount?: unknown;
};
export declare const selectStmtDecoder: Decoder<SelectStmt>;
export declare const verifySelectStatement: import("decoders").Guard<{
    SelectStmt?: SelectStmt;
}>;
