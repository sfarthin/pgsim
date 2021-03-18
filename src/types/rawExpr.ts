import * as d from "decoders";
import dispatch from "./dispatch";

import { A_Const, aConstDecoder } from "./constant";
import { TypeCast, typeCastDecoder } from "./typeCast";
import { FuncCall, funcCallDecoder } from "./funcCall";
import { ColumnRef, columnRefDecoder } from "./columnRef";
import { BoolExpr, boolExprDecoder } from "./boolExpr";
import { AExpr, aExprDecoder } from "./aExpr";
// import { BooleanTest, booleanTestDecoder } from "./booleanTest";
// import { NullTest, nullTestDecoder } from "./nullTest";
import { RowExpr, rowExprDecoder } from "./rowExpr";
import { SubLink, subLinkDecoder } from "./subLink";

export type RawValue =
  | { ColumnRef: ColumnRef } // myTable.myColumn
  | { FuncCall: FuncCall } // foo()
  | { A_Const: A_Const } // 'foo' ... 1 ... 0.9
  | { TypeCast: TypeCast } // 'adasd':text
  | { RowExpr: RowExpr }; // (1,2,3,4)

export const rawValueDecoder: d.Decoder<RawValue> = dispatch({
  ColumnRef: (blob) => columnRefDecoder(blob),
  FuncCall: (blob) => funcCallDecoder(blob),
  A_Const: (blob) => aConstDecoder(blob),
  TypeCast: (blob) => typeCastDecoder(blob),
  RowExpr: (blob) => rowExprDecoder(blob),
});

// | { NullTest: NullTest }; // something is NULL;
// | { BooleanTest: BooleanTest }
// | { CaseExpr?: unknown }
// | { SubLink?: unknown }
// | { SQLValueFunction?: unknown }
// | { CoalesceExpr?: unknown }
// | { MinMaxExpr?: unknown }
// | { A_Indirection?: unknown }
// | { A_ArrayExpr?: unknown };

export type RawCondition =
  | RawValue
  | { BoolExpr: BoolExpr } // something AND something
  | { A_Expr: AExpr } // foo in (1,2,3) ... or 1 = 1
  | { SubLink: SubLink };

export const rawConditionDecoder: d.Decoder<RawCondition> = dispatch({
  // RawValue
  ColumnRef: (blob) => columnRefDecoder(blob),
  FuncCall: (blob) => funcCallDecoder(blob),
  A_Const: (blob) => aConstDecoder(blob),
  TypeCast: (blob) => typeCastDecoder(blob),
  RowExpr: (blob) => rowExprDecoder(blob),

  // RawCondition
  BoolExpr: (blob) => boolExprDecoder(blob),
  A_Expr: (blob) => aExprDecoder(blob),
  SubLink: (blob) => subLinkDecoder(blob),

  // NullTest: (blob) => nullTestDecoder(blob),
  // BooleanTest: (blob) => booleanTestDecoder(blob), // someting IS true
  // CaseExpr: unknown,
  // SubLink: unknown,
  // SQLValueFunction: unknown,
  // CoalesceExpr: unknown,
  // MinMaxExpr: unknown,
  // A_Indirection: unknown,
  // A_ArrayExpr: unknown,
});
