import { Decoder } from "decoders";
import { A_Const, aConstDecoder } from "./constant";
import { TypeCast, typeCastDecoder } from "./typeCast";
import dispatch from "./dispatch";
import { FuncCall, funcCallDecoder } from "./funcCall";

export type RawExpr =
  | { A_Const: A_Const }
  | { TypeCast: TypeCast }
  | { FuncCall: FuncCall };

export const rawExprDecoder: Decoder<RawExpr> = dispatch({
  A_Const: aConstDecoder,
  TypeCast: typeCastDecoder,
  FuncCall: funcCallDecoder,
});
