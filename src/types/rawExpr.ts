import { Decoder } from "decoders";
import { A_Const, aConstDecoder } from "./constant";
import { TypeCast, typeCastDecoder } from "./typeCast";
import dispatch from "./dispatch";

export type RawExpr = { A_Const: A_Const } | { TypeCast: TypeCast };

export const rawExprDecoder: Decoder<RawExpr> = dispatch({
  A_Const: aConstDecoder,
  TypeCast: typeCastDecoder,
});
