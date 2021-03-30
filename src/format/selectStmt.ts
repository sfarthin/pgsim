import { SelectStmt } from "../types/selectStmt";
import comment from "./comment";
import { rawCondition } from "./rawExpr";
import { Formatter } from "./util";

export function innerSelect<T>(c: SelectStmt, f: Formatter<T>): T[][] {
  const { keyword, indent, identifier } = f;
  const select = [
    ...comment(c.codeComment, f),
    [keyword("SELECT")],
    ...indent(
      c.targetList.reduce(
        (acc, v) =>
          v.ResTarget?.val
            ? [
                ...acc,
                ...comment(v.codeComment, f),
                ...rawCondition(v.ResTarget?.val, f),
              ]
            : acc,
        [] as T[][]
      )
    ),
  ];

  const from = c.fromClause
    ? [
        [keyword("FROM")],
        ...indent(
          c.fromClause.reduce(
            (acc, v) => [
              ...acc,
              ...comment(v.codeComment, f),
              [identifier(v.RangeVar.relname)],
            ],
            [] as T[][]
          )
        ),
      ]
    : [];

  const where = c.whereClause
    ? [
        [identifier("WHERE")],
        ...indent([
          ...comment(c.whereClauseCodeComment, f),
          ...rawCondition(c.whereClause, f),
        ]),
      ]
    : [];

  // Lets add the appropiate amount of tabs.
  return [...select, ...from, ...where];
}

export default function <T>(c: SelectStmt, f: Formatter<T>): T[][] {
  const { symbol } = f;
  return innerSelect(c, f).concat([symbol(";")]);
}
