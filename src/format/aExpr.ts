import { AExpr, AExprKind } from "~/types";
import { rawValue } from "./rawExpr";
import { _, keyword, symbol, indent, Block } from "./util";
import { getPrecedence } from "../parse/aExpr";
import { list } from "./list";
import aConst from "./aConst";

function doesSecondConditionNeedParens(c: AExpr) {
  if (!c.lexpr || !c.rexpr) {
    return false;
  }
  if ("A_Expr" in c.rexpr) {
    return getPrecedence(c) < getPrecedence(c.rexpr.A_Expr);
  }

  return false;
}

function wrapParens(a: Block, includeParens?: boolean): Block {
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

export default function aExpr(c: AExpr, includeParens?: boolean): Block {
  if (c.kind === AExprKind.AEXPR_OP) {
    const firstCondition = c.lexpr ? rawValue(c.lexpr) : null;
    const secondCondition = c.rexpr
      ? doesSecondConditionNeedParens(c)
        ? rawValue(c.rexpr, true)
        : rawValue(c.rexpr)
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
        includeParens
      );
    } else {
      return wrapParens(
        [
          ...(firstCondition ? firstCondition : []),
          [_, symbol(c.name[0].String.str), _],
          ...(secondCondition ? secondCondition : []),
        ],
        includeParens
      );
    }
  } else if (c.kind === AExprKind.AEXPR_IN) {
    const condition = rawValue(c.lexpr);
    const rexpr = list(c.rexpr.List, (r) => rawValue(r)).flat();

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
  } else if (c.kind === AExprKind.AEXPR_LIKE) {
    const condition = rawValue(c.lexpr);
    const rexpr = aConst(c.rexpr.A_Const);

    if (condition.length === 1) {
      return [[...condition[0], _, keyword("LIKE"), _, ...rexpr]];
    } else {
      return [...condition, [keyword("LIKE"), _, ...rexpr]];
    }
  }

  throw new Error(`Unexpected case`);
}
