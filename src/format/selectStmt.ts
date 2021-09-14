import sortBy from "./sortBy";
import { SelectStmt } from "../types/selectStmt";
import comment from "./comment";
import { rawValue } from "./rawExpr";
import { Formatter, addToLastLine } from "./util";
import rangeVar from "./rangeVar";
import joinExpr from "./joinExpr";
import columnRef from "./columnRef";
import identifier from "./identifier";

function toTargetList<T>(c: SelectStmt, f: Formatter<T>): T[][] {
  const { keyword, indent, symbol, _ } = f;

  const targetList = c.targetList.flatMap((v, i) => {
    if (!v.ResTarget?.val) {
      return [];
    }

    // Lets add AS part if needed
    const target = addToLastLine(rawValue(v.ResTarget?.val, f), [
      ...(v.ResTarget?.name
        ? [_, keyword("AS"), _, identifier(v.ResTarget.name, f)]
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
  const { keyword, indent, symbol, _ } = f;

  const select = toTargetList(c, f);

  const from = c.fromClause
    ? [
        [keyword("FROM")],
        ...indent(
          c.fromClause.flatMap((v, i) => {
            const commaSepatation =
              i === (c.fromClause?.length ?? 0) - 1 ? [] : [symbol(",")];

            if ("RangeVar" in v) {
              return [
                ...comment(c.codeComments?.fromClause?.[i], f),
                rangeVar(v.RangeVar, f).concat(commaSepatation),
              ];
            }
            if ("JoinExpr" in v) {
              return [
                ...comment(c.codeComments?.fromClause?.[i], f),
                ...joinExpr(v.JoinExpr, f).concat(commaSepatation),
              ];
            }
            return [];
          })
        ),
      ]
    : [];

  const where = c.whereClause
    ? [
        [keyword("WHERE")],
        ...indent([
          ...comment(c.codeComments?.whereClause?.[0], f),
          ...rawValue(c.whereClause, f),
        ]),
      ]
    : [];

  const groupBy = c.groupClause
    ? [
        [keyword("GROUP"), _, keyword("BY")],
        ...indent(
          c.groupClause.flatMap((r, i) => [
            ...comment(c.codeComments?.groupClause?.[i], f),
            [
              ...columnRef(r.ColumnRef, f),
              ...(i === (c.groupClause?.length ?? 0) - 1 ? [] : [symbol(",")]),
            ],
          ])
        ),
      ]
    : [];

  // Lets add the appropiate amount of tabs.
  return [
    ...select,
    ...from,
    ...where,
    ...groupBy,
    ...(c.sortClause ? sortBy(c.sortClause, f) : []),
  ];
}

export default function <T>(c: SelectStmt, f: Formatter<T>): T[][] {
  const { symbol } = f;
  return addToLastLine(innerSelect(c, f), [symbol(";")]);
}
