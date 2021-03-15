import { BoolExpr, BoolOp } from "../types";
import rawExpr from "./rawExpr";
import { NEWLINE } from "./whitespace";

export default function (c: BoolExpr, includeParens?: boolean): string {
  if (c.boolop === BoolOp.NOT) {
    return `NOT ${rawExpr(c.args[0])}`;
  }

  const OP = c.boolop === BoolOp.AND ? "AND" : "OR";

  const shouldIncludeParensInNestedCondition = c.args.some(
    (arg) => "BoolExpr" in arg && arg.BoolExpr.boolop === BoolOp.OR
  );

  const result = c.args
    .map((a) => rawExpr(a, shouldIncludeParensInNestedCondition))
    .join(` ${OP}${NEWLINE}`);

  if (includeParens) {
    return `(${result})`;
  }
  return `${result}`;
}
