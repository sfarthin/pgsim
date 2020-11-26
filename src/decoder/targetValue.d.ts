import { Decoder } from "decoders";
import { A_Const } from "./constant";
import { TypeCast } from "./typeCast";
import { FuncCall } from "./funcCall";
import { ColumnRef } from "./columnRef";
import { BoolExpr } from "./boolExpr";
import { AExpr } from "./aExpr";
import { BooleanTest } from "./booleanTest";
import { NullTest } from "./nullTest";
export declare type TargetValue = {
    ColumnRef: ColumnRef;
} | {
    FuncCall: FuncCall;
} | {
    A_Const: A_Const;
} | {
    TypeCast: TypeCast;
} | {
    BoolExpr: BoolExpr;
} | {
    A_Expr: AExpr;
} | {
    BooleanTest: BooleanTest;
} | {
    NullTest: NullTest;
} | {
    CaseExpr?: unknown;
} | {
    SubLink?: unknown;
} | {
    SQLValueFunction?: unknown;
} | {
    CoalesceExpr?: unknown;
} | {
    MinMaxExpr?: unknown;
} | {
    A_Indirection?: unknown;
} | {
    A_ArrayExpr?: unknown;
};
export declare const targetValueDecoder: Decoder<TargetValue>;
export declare const verifyTargetValue: import("decoders").Guard<TargetValue>;
