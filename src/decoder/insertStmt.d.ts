import { Decoder } from "decoders";
import { RangeVar } from "./rangeVar";
export declare type ResTargetInsert = {
    name?: string;
    location: number;
    indirection?: unknown;
};
export declare const resTargetInsertDecoder: Decoder<ResTargetInsert>;
export declare type InsertStmt = {
    relation: {
        RangeVar: RangeVar;
    };
    cols?: {
        ResTarget: ResTargetInsert;
    }[] | void;
    selectStmt?: {
        SelectStmt?: unknown;
    };
    returningList?: unknown;
    override?: unknown;
    onConflictClause?: unknown;
};
export declare const insertStmtDecoder: Decoder<InsertStmt>;
