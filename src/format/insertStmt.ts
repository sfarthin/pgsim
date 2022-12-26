import { InsertStmt } from "~/types";
import {
  Block,
  keyword,
  identifier,
  _,
  symbol,
  indent,
  comment,
  addToFirstLine,
  addToLastLine,
  toSingleLineIfPossible,
} from "./util";
import { list } from "./list";
import columnRef from "./columnRef";
import { rawValue } from "./rawExpr";
import { innerSelect } from "./selectStmt";

export default function (c: InsertStmt): Block {
  const returning = c.returningList
    ? [
        [
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
    : [[symbol(";")]];

  if ("valuesLists" in c.selectStmt?.SelectStmt) {
    const valueLists = c.selectStmt?.SelectStmt.valuesLists;

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
      [symbol(")"), _, keyword("VALUES")],
      ...indent(
        toSingleLineIfPossible(
          c.selectStmt?.SelectStmt.valuesLists.flatMap((valueList, j) => {
            return [
              [symbol("(")],
              ...toSingleLineIfPossible(
                list(valueList.List, (s, i) => {
                  return addToLastLine(
                    rawValue(s),
                    !("length" in valueList.List.items) ||
                      valueList.List.items.length - 1 === i
                      ? []
                      : [symbol(",")]
                  );
                }).flat()
              ),
              [
                symbol(")"),
                ...(j === valueLists.length - 1 ? [] : [symbol(",")]),
              ],
            ];
          })
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

    ...addToFirstLine([symbol(")"), _], returning),
  ];
}
