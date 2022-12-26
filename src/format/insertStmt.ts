import { InsertStmt } from "~/types";
import { Block, keyword, identifier, _, symbol, indent, comment } from "./util";
import { list } from "./list";
import columnRef from "./columnRef";
import { rawValue } from "./rawExpr";
import { innerSelect } from "./selectStmt";

export default function (c: InsertStmt): Block {
  const returning = c.returningList
    ? [
        [
          symbol(")"),
          _,
          keyword("RETURNING"),
          _,
          ...c.returningList.flatMap((r, i) => [
            ...columnRef(r.ResTarget.val.ColumnRef),
            ...(i !== (c.returningList?.length ?? 0) - 1
              ? [symbol(","), _]
              : []),
          ]),
          symbol(";"),
        ],
      ]
    : [[symbol(")"), symbol(";")]];

  if ("valuesLists" in c.selectStmt?.SelectStmt) {
    const valueList = list(
      c.selectStmt?.SelectStmt.valuesLists[0].List,
      (s) => {
        return rawValue(s);
      }
    ).flatMap((r) => [...r]);
    return [
      ...comment(c.codeComment),
      [
        keyword("INSERT"),
        _,
        keyword("INTO"),
        _,
        identifier(c.relation.relname),
        _,
        symbol("("),
      ],
      ...indent(
        c.cols.map((column, i) =>
          column.ResTarget.name
            ? [
                identifier(column.ResTarget.name),
                ...(i === c.cols.length - 1 ? [] : [symbol(",")]),
              ]
            : []
        )
      ),
      [symbol(")"), _, keyword("VALUES"), _, symbol("(")],
      ...indent(
        valueList.map((l, i) =>
          i !== valueList.length - 1 ? [...l, symbol(",")] : l
        )
      ),

      ...returning,
    ];
  }

  return [
    ...comment(c.codeComment),
    [
      keyword("INSERT"),
      _,
      keyword("INTO"),
      _,
      identifier(c.relation.relname),
      _,
      symbol("("),
    ],
    ...indent(
      c.cols.map((column, i) =>
        column.ResTarget.name
          ? [
              identifier(column.ResTarget.name),
              ...(i === c.cols.length - 1 ? [] : [symbol(",")]),
            ]
          : []
      )
    ),
    [symbol(")"), _, symbol("(")],

    ...indent(innerSelect(c.selectStmt?.SelectStmt)),

    ...returning,
  ];
}
