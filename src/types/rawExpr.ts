import { Decoder, unknown } from "decoders";
import dispatch from "./dispatch";

import { A_Const, aConstDecoder } from "./constant";
import { TypeCast, typeCastDecoder } from "./typeCast";
import { FuncCall, funcCallDecoder } from "./funcCall";
import { ColumnRef, columnRefDecoder } from "./columnRef";
import { BoolExpr, boolExprDecoder } from "./boolExpr";
import { AExpr, aExprDecoder } from "./aExpr";
import { BooleanTest, booleanTestDecoder } from "./booleanTest";
import { NullTest, nullTestDecoder } from "./nullTest";

export type RawExpr =
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

export const rawExprDecoder: Decoder<RawExpr> = dispatch({
  A_Const: (blob) => aConstDecoder(blob),
  TypeCast: (blob) => typeCastDecoder(blob),
  FuncCall: (blob) => funcCallDecoder(blob),
  BoolExpr: (blob) => boolExprDecoder(blob),
  A_Expr: (blob) => aExprDecoder(blob),
  BooleanTest: (blob) => booleanTestDecoder(blob), // someting IS true
  NullTest: (blob) => nullTestDecoder(blob), // something is NULL
  ColumnRef: (blob) => columnRefDecoder(blob),
  CaseExpr: unknown,
  SubLink: unknown,
  SQLValueFunction: unknown,
  CoalesceExpr: unknown,
  MinMaxExpr: unknown,
  A_Indirection: unknown,
  A_ArrayExpr: unknown,
});
