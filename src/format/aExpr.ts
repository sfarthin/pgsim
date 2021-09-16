import { AExpr, AExprKind, RawValue } from "../types";
import { rawValue } from "./rawExpr";
import { Formatter, join } from "./util";
import { getPrecedence } from "../parse/aExpr";
import { list } from "./list";

function doesSecondConditionNeedParens(c: AExpr) {
  if (!c.lexpr || !c.rexpr) {
    return false;
  }
  if ("A_Expr" in c.rexpr) {
    return getPrecedence(c) < getPrecedence(c.rexpr.A_Expr);
  }

  return false;
}

function wrapParens<T>(
  a: T[][],
  f: Formatter<T>,
  includeParens?: boolean
): T[][] {
  const { symbol } = f;

  if (!includeParens) {
    return a;
  }

  if (a.length === 1) {
    return [[symbol("("), ...a[0], symbol(")")]];
  }

  return [
    [symbol("("), ...a[0]],
    ...a.slice(1, a.length - 2),
    [...a[a.length - 1], symbol(")")],
  ];
}

export default function aExpr<T>(
  c: AExpr,
  f: Formatter<T>,
  includeParens?: boolean
): T[][] {
  const { _, keyword, symbol, indent } = f;
  if (c.kind === AExprKind.AEXPR_OP) {
    const firstCondition = c.lexpr ? rawValue(c.lexpr, f) : null;
    const secondCondition = c.rexpr
      ? doesSecondConditionNeedParens(c)
        ? rawValue(c.rexpr, f, true)
        : rawValue(c.rexpr, f)
      : null;
    const hasTwoParams = firstCondition && secondCondition;

    if (
      (!firstCondition || firstCondition.length === 1) &&
      (!secondCondition || secondCondition.length === 1)
    ) {
      // If both are jsut one line, then lets put it on the same line.
      return wrapParens(
        [
          [
            ...(firstCondition ? firstCondition[0] : []),
            ...(hasTwoParams ? [_] : []),
            symbol(c.name[0].String.str),
            ...(secondCondition ? [_] : []),
            ...(secondCondition ? secondCondition[0] : []),
          ],
        ],
        f,
        includeParens
      );
    } else {
      return wrapParens(
        [
          ...(firstCondition ? firstCondition : []),
          [_, symbol(c.name[0].String.str), _],
          ...(secondCondition ? secondCondition : []),
        ],
        f,
        includeParens
      );
    }
  } else {
    const condition = rawValue(c.lexpr, f);
    const rexpr = list(c.rexpr.List, (r) => rawValue(r, f)).flat();

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
