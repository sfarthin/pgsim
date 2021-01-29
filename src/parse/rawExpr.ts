import { Rule, or, transform } from "./util";
import { aConst } from "./aConst";
import { typeCast } from "./typeCast";
import { funcCall } from "./funcCall";
import { RawExpr } from "../types";

// THis should include equestions and type casts.
export const rawExpr: Rule<RawExpr> = or([
  transform(aConst, (A_Const) => ({ A_Const })),
  transform(typeCast, (TypeCast) => ({ TypeCast })),
  transform(funcCall, (FuncCall) => ({ FuncCall })),
]);
