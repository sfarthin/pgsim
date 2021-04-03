import { AExpr, AExprKind } from "../types";
import { rawCondition, rawValue } from "./rawExpr";
import { Formatter, join } from "./util";

export default function aExpr<T>(c: AExpr, f: Formatter<T>): T[][] {
  const { _, identifier, keyword, symbol } = f;
  if (c.kind === AExprKind.AEXPR_OP) {
    const firstCondition = rawCondition(c.lexpr, f);
    const secondCondition = rawCondition(c.rexpr, f);

    if (firstCondition.length === 1 && secondCondition.length === 1) {
      // If both are jsut one line, then lets put it on the same line.
      return [[...firstCondition[0], _, symbol("="), _, ...secondCondition[0]]];
    } else {
      return [
        ...rawCondition(c.lexpr, f),
        [_, identifier(c.name[0].String.str), _],
        ...rawCondition(c.rexpr, f),
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
