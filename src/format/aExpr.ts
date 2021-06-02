import { AExpr, AExprKind } from "../types";
import { rawValue } from "./rawExpr";
import { Formatter, join } from "./util";

export default function aExpr<T>(c: AExpr, f: Formatter<T>): T[][] {
  const { _, keyword, symbol, indent } = f;
  if (c.kind === AExprKind.AEXPR_OP) {
    const firstCondition = c.lexpr ? rawValue(c.lexpr, f) : null;
    const secondCondition = c.rexpr ? rawValue(c.rexpr, f) : null;
    const hasTwoParams = firstCondition && secondCondition;

    if (
      (!firstCondition || firstCondition.length === 1) &&
      (!secondCondition || secondCondition.length === 1)
    ) {
      // If both are jsut one line, then lets put it on the same line.
      return [
        [
          ...(firstCondition ? firstCondition[0] : []),
          ...(hasTwoParams ? [_] : []),
          symbol(c.name[0].String.str),
          ...(secondCondition ? [_] : []),
          ...(secondCondition ? secondCondition[0] : []),
        ],
      ];
    } else {
      return [
        ...(firstCondition ? firstCondition : []),
        [_, symbol(c.name[0].String.str), _],
        ...(secondCondition ? secondCondition : []),
      ];
    }
  } else {
    const condition = rawValue(c.lexpr, f);
    const rexpr = [...c.rexpr.map((r) => rawValue(r, f)).flat()];
    const rexprWithCommas = rexpr.map((l, i) =>
      i === rexpr.length - 1 ? l : l.concat(symbol(","))
    );

    if (condition.length === 1) {
      return [
        [...condition[0], _, keyword("IN"), _, symbol("(")],
        ...indent(rexprWithCommas),
        [symbol(")")],
      ];
    } else {
      return [
        ...condition,
        [keyword("IN"), _, symbol("(")],
        ...indent(rexprWithCommas),
        [symbol(")")],
      ];
    }
  }
}
