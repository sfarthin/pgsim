import sortBy from "./sortBy";
import { SelectStmt } from "../types/selectStmt";
import { rawValue } from "./rawExpr";
import rangeVar from "./rangeVar";
import joinExpr from "./joinExpr";
import columnRef from "./columnRef";
import {
  identifier,
  keyword,
  indent,
  symbol,
  _,
  comment,
  addToLastLine,
  Block,
} from "./util";

function toTargetList(c: SelectStmt): Block {
  const targetList = c.targetList.flatMap((v, i) => {
    if (!v.ResTarget?.val) {
      return [];
    }

    // Lets add AS part if needed
    const target = addToLastLine(rawValue(v.ResTarget?.val), [
      ...(v.ResTarget?.name
        ? [_, keyword("AS"), _, identifier(v.ResTarget.name)]
        : []),
    ]);

    return v.ResTarget?.val
      ? [
          ...comment(c.codeComments?.targetList?.[i]),
          ...(i !== c.targetList.length - 1
            ? addToLastLine(target, [symbol(",")])
            : target),
        ]
      : [[]];
  });

  return [
    ...comment(c.codeComment),
    [keyword("SELECT")],
    ...indent(targetList),
  ];
}

export function innerSelect(c: SelectStmt): Block {
  const select = toTargetList(c);

  const from = c.fromClause
    ? [
        [keyword("FROM")],
        ...indent(
          c.fromClause.flatMap((v, i) => {
            const commaSepatation =
              i === (c.fromClause?.length ?? 0) - 1 ? [] : [symbol(",")];

            if ("RangeVar" in v) {
              return [
                ...comment(c.codeComments?.fromClause?.[i]),
                rangeVar(v.RangeVar).concat(commaSepatation),
              ];
            }
            if ("JoinExpr" in v) {
              return [
                ...comment(c.codeComments?.fromClause?.[i]),
                ...joinExpr(v.JoinExpr).concat(commaSepatation),
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
          ...comment(c.codeComments?.whereClause?.[0]),
          ...rawValue(c.whereClause),
        ]),
      ]
    : [];

  const groupBy = c.groupClause
    ? [
        [keyword("GROUP"), _, keyword("BY")],
        ...indent(
          c.groupClause.flatMap((r, i) => [
            ...comment(c.codeComments?.groupClause?.[i]),
            [
              ...columnRef(r.ColumnRef),
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
    ...(c.sortClause ? sortBy(c.sortClause) : []),
  ];
}

export default function (c: SelectStmt): Block {
  return addToLastLine(innerSelect(c), [symbol(";")]);
}
