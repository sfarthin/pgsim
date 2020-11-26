import { Decoder } from "decoders";
import { Constraint } from "./constraint";
import { TypeName } from "./typeCast";
import { RangeVar } from "./rangeVar";
export declare type ColumnDef = {
    colname: string;
    typeName: {
        TypeName: TypeName;
    };
    constraints?: Array<{
        Constraint: Constraint;
    }>;
    is_local: boolean;
    collClause?: unknown;
    location: number;
};
export declare const columnDefDecoder: Decoder<ColumnDef>;
export declare const verifyColumnDef: import("decoders").Guard<ColumnDef>;
export declare type Relation = {
    RangeVar: RangeVar;
};
export declare const relationDecoder: Decoder<{
    RangeVar?: RangeVar;
}, unknown>;
export declare type CreateStmt = {
    relation: Relation;
    tableElts?: Array<{
        ColumnDef?: unknown;
    } | {
        Constraint?: unknown;
    }>;
    oncommit: number;
    inhRelations?: unknown;
    options?: unknown;
    if_not_exists?: boolean;
    partspec?: unknown;
    partbound?: unknown;
};
export declare const createStmtDecoder: Decoder<CreateStmt>;
