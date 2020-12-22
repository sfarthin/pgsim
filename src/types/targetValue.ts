import { guard, Decoder, unknown } from "decoders";
import dispatch from "./dispatch";

import { A_Const, aConstDecoder } from "./constant";
import { TypeCast, typeCastDecoder } from "./typeCast";
import { FuncCall, funcCallDecoder } from "./funcCall";
import { ColumnRef, columnRefDecoder } from "./columnRef";
import { BoolExpr, boolExprDecoder } from "./boolExpr";
import { AExpr, aExprDecoder } from "./aExpr";
import { BooleanTest, booleanTestDecoder } from "./booleanTest";
import { NullTest, nullTestDecoder } from "./nullTest";

export type TargetValue =
  | { ColumnRef: ColumnRef }
  | { FuncCall: FuncCall }
  | { A_Const: A_Const }
  | { TypeCast: TypeCast }
  | { BoolExpr: BoolExpr }
  | { A_Expr: AExpr }
  | { BooleanTest: BooleanTest }
  | { NullTest: NullTest }
  | { CaseExpr?: unknown }
  | { SubLink?: unknown }
  | { SQLValueFunction?: unknown }
  | { CoalesceExpr?: unknown }
  | { MinMaxExpr?: unknown }
  | { A_Indirection?: unknown }
  | { A_ArrayExpr?: unknown };

export const targetValueDecoder: Decoder<TargetValue> = dispatch({
  ColumnRef: columnRefDecoder,
  FuncCall: funcCallDecoder,
  A_Const: aConstDecoder,
  TypeCast: typeCastDecoder,
  BoolExpr: boolExprDecoder,
  A_Expr: aExprDecoder,
  BooleanTest: booleanTestDecoder, // someting IS true
  NullTest: nullTestDecoder, // something is NULL
  CaseExpr: unknown,
  SubLink: unknown,
  SQLValueFunction: unknown,
  CoalesceExpr: unknown,
  MinMaxExpr: unknown,
  A_Indirection: unknown,
  A_ArrayExpr: unknown,
});

export const verifyTargetValue = guard(targetValueDecoder);
