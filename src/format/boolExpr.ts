import { BoolExpr, BoolOp } from "../types";
import { rawValue } from "./rawExpr";
import { addToLastLine, symbol, _, keyword, indent, Block } from "./util";

export default function (c: BoolExpr, includeParens?: boolean): Block {
  if (c.boolop === BoolOp.NOT_EXPR) {
    const condition = rawValue(c.args[0]);

    if (condition.length === 1) {
      return [[keyword("NOT"), _, ...condition[0]]];
    } else {
      return [[keyword("NOT"), _], ...condition];
    }
  }

  const OP = c.boolop === BoolOp.AND_EXPR ? "AND" : "OR";

  const shouldIncludeParensInNestedCondition = c.args.some(
    (arg) => "BoolExpr" in arg && arg.BoolExpr.boolop === BoolOp.OR_EXPR
  );

  const args = c.args.flatMap((a, i) => {
    const condition = rawValue(a, shouldIncludeParensInNestedCondition);
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
