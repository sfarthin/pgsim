import sortBy from "./sortBy";
import { SelectStmt } from "../types/selectStmt";
import comment from "./comment";
import { rawCondition } from "./rawExpr";
import { Formatter, addToLastLine } from "./util";
import rangeVar from "./rangeVar";
import joinExpr from "./joinExpr";

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
          ...comment(c.codeComments?.targetList?.[i], f),
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
          c.fromClause.flatMap((v, i) => {
            if ("RangeVar" in v) {
              return [
                ...comment(c.codeComments?.fromClause?.[i], f),
                rangeVar(v.RangeVar, f),
              ];
            }
            if ("JoinExpr" in v) {
              return [
                ...comment(c.codeComments?.fromClause?.[i], f),
                ...joinExpr(v.JoinExpr, f),
              ];
            }
            return [];
          })
        ),
      ]
    : [];

  const where = c.whereClause
    ? [
        [identifier("WHERE")],
        ...indent([
          ...comment(c.codeComments?.whereClause?.[0], f),
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
