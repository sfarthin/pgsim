import sortBy from "./sortBy";
import { CommonTableExpr, SelectStmt } from "~/types";
import { rawValue } from "./rawExpr";
import rangeVar from "./rangeVar";
import joinExpr from "./joinExpr";
import columnRef from "./columnRef";
import {
  toSingleLineIfPossible,
  identifier,
  keyword,
  indent,
  symbol,
  _,
  comment,
  addToLastLine,
  Block,
  addToFirstLine,
} from "./util";
import aConst from "./aConst";
import rangeSubselect from "./rangeSubselect";

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
    [keyword("SELECT"), ...(c.distinctClause ? [_, keyword("DISTINCT")] : [])],
    ...indent(toSingleLineIfPossible(targetList)),
  ];
}

function commonTableExpr(c: CommonTableExpr): Block {
  return [
    [identifier(c.ctename), _, keyword("AS"), _, symbol("(")],
    ...indent(toSingleLineIfPossible(innerSelect(c.ctequery.SelectStmt))),
    [symbol(")")],
  ];
}

export function innerSelect(c: SelectStmt): Block {
  const withClause: Block = c.withClause
    ? addToFirstLine(
        [keyword("WITH"), _],
        c.withClause.ctes.flatMap((r, i) =>
          c.withClause && i !== c.withClause.ctes.length - 1
            ? addToLastLine(commonTableExpr(r.CommonTableExpr), [
                symbol(","),
                _,
              ])
            : commonTableExpr(r.CommonTableExpr)
        )
      )
    : [];

  const select = toTargetList(c);

  const from = c.fromClause
    ? [
        [keyword("FROM")],
        ...indent(
          toSingleLineIfPossible(
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
              if ("RangeSubselect" in v) {
                return [
                  ...comment(c.codeComments?.fromClause?.[i]),
                  ...rangeSubselect(v.RangeSubselect).concat([commaSepatation]),
                ];
              }

              return [];
            })
          )
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
              ...("ColumnRef" in r
                ? columnRef(r.ColumnRef)
                : aConst(r.A_Const)),
              ...(i === (c.groupClause?.length ?? 0) - 1 ? [] : [symbol(",")]),
            ],
          ])
        ),
      ]
    : [];

  const havingClause = c.havingClause
    ? [
        [keyword("HAVING")],
        ...indent([
          ...comment(c.codeComments?.havingClause),
          ...rawValue(c.havingClause),
        ]),
      ]
    : [];

  // Lets add the appropiate amount of tabs.
  return [
    ...withClause,
    ...select,
    ...from,
    ...toSingleLineIfPossible(where),
    ...toSingleLineIfPossible(groupBy),
    ...toSingleLineIfPossible(havingClause),
    ...toSingleLineIfPossible(c.sortClause ? sortBy(c.sortClause) : []),
  ];
}

export default function (c: SelectStmt): Block {
  return addToLastLine(innerSelect(c), [symbol(";")]);
}
