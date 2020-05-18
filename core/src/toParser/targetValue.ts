import { guard, exact, Decoder, either9, either, mixed } from "decoders";

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
  | { CaseExpr: unknown }
  | { SubLink: unknown };

export const targetValueDecoder: Decoder<TargetValue> = either9(
  exact({ ColumnRef: columnRefDecoder }),
  exact({ FuncCall: funcCallDecoder }),
  exact({ A_Const: aConstDecoder }),
  exact({ TypeCast: typeCastDecoder }),
  exact({ BoolExpr: boolExprDecoder }),
  exact({ A_Expr: aExprDecoder }),
  exact({ BooleanTest: booleanTestDecoder }), // someting IS true
  exact({ NullTest: nullTestDecoder }), // something is NULL
  either(exact({ CaseExpr: mixed }), exact({ SubLink: mixed }))
);

export const verifyTargetValue = guard(targetValueDecoder);
