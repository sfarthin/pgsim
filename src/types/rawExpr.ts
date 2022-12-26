import * as d from "decoders";
import dispatch from "./dispatch";

import { A_Const, aConstDecoder } from "./constant";
import { TypeCast, typeCastDecoder } from "./typeCast";
import { FuncCall, funcCallDecoder } from "./funcCall";
import { ColumnRef, columnRefDecoder } from "./columnRef";
import { ColumnDef, columnDefDecoder } from ".";
import { BoolExpr, boolExprDecoder } from "./boolExpr";
import { AExpr, aExprDecoder } from "./aExpr";
// import { BooleanTest, booleanTestDecoder } from "./booleanTest";
import { NullTest, nullTestDecoder } from "./nullTest";
import { RowExpr, rowExprDecoder } from "./rowExpr";
import { SubLink, subLinkDecoder } from "./subLink";
import { CaseExpr, caseExprDecoder } from "./caseExpr";
import { AIndirection, aIndirectionDecoder } from "./aIndirection";
import { paramRefDecoder, ParamRef } from "./paramRef";

export type RawValue =
  | { ColumnRef: ColumnRef } // myTable.myColumn
  | { ColumnDef: ColumnDef }
  | { A_Expr: AExpr }
  | { SubLink: SubLink }
  | { BoolExpr: BoolExpr }
  | { NullTest: NullTest } // is NULL
  | { FuncCall: FuncCall } // foo()
  | { A_Const: A_Const } // 'foo' ... 1 ... 0.9
  | { TypeCast: TypeCast } // 'adasd':text
  | { RowExpr: RowExpr } // (1,2,3,4)
  | { BoolExpr: BoolExpr } // something AND something
  | { A_Expr: AExpr } // foo in (1,2,3) ... or 1 = 1
  | { SubLink: SubLink }
  | { CaseExpr: CaseExpr }
  | { A_Indirection: AIndirection } // foo[0]
  | { ParamRef: ParamRef };

export const rawValueDecoder: d.Decoder<RawValue> = dispatch({
  ColumnRef: (blob) => columnRefDecoder(blob),
  ColumnDef: (blob) => columnDefDecoder(blob),
  FuncCall: (blob) => funcCallDecoder(blob),
  A_Const: (blob) => aConstDecoder(blob),
  TypeCast: (blob) => typeCastDecoder(blob),
  RowExpr: (blob) => rowExprDecoder(blob),
  A_Expr: (blob) => aExprDecoder(blob),
  NullTest: (blob) => nullTestDecoder(blob),
  BoolExpr: (blob) => boolExprDecoder(blob),
  SubLink: (blob) => subLinkDecoder(blob),
  CaseExpr: (blob) => caseExprDecoder(blob),
  A_Indirection: (blob) => aIndirectionDecoder(blob),
  ParamRef: (blob) => paramRefDecoder(blob),
});

// | { BooleanTest: BooleanTest }
// | { SQLValueFunction?: unknown }
// | { CoalesceExpr?: unknown }
// | { MinMaxExpr?: unknown }
// | { A_ArrayExpr?: unknown };
