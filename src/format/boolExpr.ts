import { BoolExpr, BoolOp } from "../types";
import { rawCondition } from "./rawExpr";
import { Formatter } from "./util";

export default function <T>(
  c: BoolExpr,
  f: Formatter<T>,
  includeParens?: boolean
): T[][] {
  const { symbol, _, keyword } = f;
  if (c.boolop === BoolOp.NOT) {
    return [[keyword("NOT"), _], ...rawCondition(c.args[0], f)];
  }

  const OP = c.boolop === BoolOp.AND ? "AND" : "OR";

  const shouldIncludeParensInNestedCondition = c.args.some(
    (arg) => "BoolExpr" in arg && arg.BoolExpr.boolop === BoolOp.OR
  );

  return [
    ...c.args.reduce(
      (acc, a, i) => [
        ...acc,
        [...(includeParens && i === 0 ? [symbol("(")] : [])],
        ...rawCondition(a, f, shouldIncludeParensInNestedCondition),
        [...(c.args.length - 1 === i ? [symbol(")")] : [keyword(OP)])],
      ],
      [] as T[][]
    ),
  ];
}
