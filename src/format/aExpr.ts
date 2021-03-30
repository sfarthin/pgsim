import { AExpr, AExprKind } from "../types";
import { rawCondition, rawValue } from "./rawExpr";
import { Formatter } from "./util";

export default function aExpr<T>(c: AExpr, f: Formatter<T>): T[][] {
  const { _, identifier, keyword, symbol } = f;
  if (c.kind === AExprKind.AEXPR_OP) {
    return [
      ...rawCondition(c.lexpr, f),
      [_, identifier(c.name[0].String.str), _],
      ...rawCondition(c.rexpr, f),
    ];
  } else {
    return [
      ...rawCondition(c.lexpr, f),
      [
        _,
        keyword("IN"),
        _,
        symbol("("),
        ...c.rexpr.reduce(
          (acc, e, i) => [
            ...acc,
            ...rawValue(e, f),
            ...(c.rexpr.length - 1 === i ? [symbol(","), _] : []),
          ],
          [] as T[]
        ),
        symbol(")"),
      ],
    ];
  }
}
