import { BoolExpr, BoolOp } from "../types";
import rawExpr from "./rawExpr";

export default function (c: BoolExpr, includeParens?: boolean): string {
  if (c.boolop === BoolOp.NOT) {
    return `NOT ${rawExpr(c.args[0])}`;
  }

  const OP = c.boolop === BoolOp.AND ? "AND" : "OR";

  const lastArg = c.args[c.args.length - 1];
  const shouldIncludeParensInNestedCondition =
    "BoolExpr" in lastArg && lastArg.BoolExpr.boolop === BoolOp.OR;

  const result = c.args
    .map((a) => rawExpr(a, shouldIncludeParensInNestedCondition))
    .join(` ${OP}\n`);

  if (includeParens) {
    return `(${result})`;
  }
  return `${result}`;
}
