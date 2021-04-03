import { BoolExpr, BoolOp } from "../types";
import { rawCondition } from "./rawExpr";
import { addToLastLine, Formatter } from "./util";

export default function <T>(
  c: BoolExpr,
  f: Formatter<T>,
  includeParens?: boolean
): T[][] {
  const { symbol, _, keyword, indent } = f;
  if (c.boolop === BoolOp.NOT) {
    const condition = rawCondition(c.args[0], f);

    if (condition.length === 1) {
      return [[keyword("NOT"), _, ...condition[0]]];
    } else {
      return [[keyword("NOT"), _], ...condition];
    }
  }

  const OP = c.boolop === BoolOp.AND ? "AND" : "OR";

  const shouldIncludeParensInNestedCondition = c.args.some(
    (arg) => "BoolExpr" in arg && arg.BoolExpr.boolop === BoolOp.OR
  );

  const args = c.args.flatMap((a, i) => {
    const condition = rawCondition(a, f, shouldIncludeParensInNestedCondition);
    const middle =
      i !== c.args.length - 1
        ? addToLastLine(condition, [_, keyword(OP)])
        : condition;
    return [
      ...(includeParens && i === 0 ? [[symbol("(")]] : []),
      ...(includeParens ? indent(middle) : middle),
      ...(includeParens && i === c.args.length - 1 ? [[symbol(")")]] : []),
    ];
  });

  return args;
}
