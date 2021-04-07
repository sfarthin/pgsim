import { AExpr, AExprKind } from "../types";
import { rawCondition, rawValue } from "./rawExpr";
import { Formatter, join } from "./util";

export default function aExpr<T>(c: AExpr, f: Formatter<T>): T[][] {
  const { _, keyword, symbol } = f;
  if (c.kind === AExprKind.AEXPR_OP) {
    const firstCondition = c.lexpr ? rawCondition(c.lexpr, f) : null;
    const secondCondition = c.rexpr ? rawCondition(c.rexpr, f) : null;
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
    const condition = rawCondition(c.lexpr, f);

    if (condition.length === 1) {
      return [
        [
          ...condition[0],
          _,
          keyword("IN"),
          _,
          symbol("("),

          ...join(
            c.rexpr.map((r) => rawValue(r, f)),
            [symbol(","), _]
          ),
          symbol(")"),
        ],
      ];
    } else {
      return [
        ...condition,
        [
          keyword("IN"),
          _,
          symbol("("),

          ...join(
            c.rexpr.map((r) => rawValue(r, f)),
            [symbol(","), _]
          ),
          symbol(")"),
        ],
      ];
    }
  }
}
