import sortBy from "./sortBy";
import { SelectStmt } from "../types/selectStmt";
import comment from "./comment";
import { rawCondition } from "./rawExpr";
import { Formatter, addToLastLine } from "./util";

function toTargetList<T>(c: SelectStmt, f: Formatter<T>): T[][] {
  const { keyword, indent, symbol, _, identifier } = f;

  const targetList = c.targetList.flatMap((v, i) => {
    if (!v.ResTarget?.val) {
      return [];
    }

    // Lets add AS part if needed
    const target = addToLastLine(rawCondition(v.ResTarget?.val, f), [
      ...(v.ResTarget?.name
        ? [_, keyword("AS"), _, identifier(v.ResTarget.name)]
        : []),
    ]);

    return v.ResTarget?.val
      ? [
          ...comment(v.codeComment, f),
          ...(i !== c.targetList.length - 1
            ? addToLastLine(target, [symbol(",")])
            : target),
        ]
      : [[]];
  });

  return [
    ...comment(c.codeComment, f),
    [keyword("SELECT")],
    ...indent(targetList),
  ];
}

export function innerSelect<T>(c: SelectStmt, f: Formatter<T>): T[][] {
  const { keyword, indent, identifier } = f;

  const select = toTargetList(c, f);

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
  return [
    ...select,
    ...from,
    ...where,
    ...(c.sortClause ? sortBy(c.sortClause, f) : []),
  ];
}

export default function <T>(c: SelectStmt, f: Formatter<T>): T[][] {
  const { symbol } = f;
  return addToLastLine(innerSelect(c, f), [symbol(";")]);
}
