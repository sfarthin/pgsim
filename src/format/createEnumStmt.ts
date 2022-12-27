import { CreateEnumStmt } from "~/types";
import {
  keyword,
  _,
  identifier,
  symbol,
  indent,
  stringLiteral,
  comment,
  Block,
} from "./util";

export default function variableSetStmt(createEnumStmt: CreateEnumStmt): Block {
  return [
    ...comment(createEnumStmt.codeComment),
    [
      keyword("CREATE"),
      _,
      keyword("TYPE"),
      _,
      ...(createEnumStmt.typeName[1]
        ? [
            identifier(createEnumStmt.typeName[0].String.str),
            symbol("."),
            identifier(createEnumStmt.typeName[1].String.str),
          ]
        : [identifier(createEnumStmt.typeName[0].String.str)]),
      _,
      keyword("AS"),
      _,
      keyword("ENUM"),
      _,
      symbol("("),
    ],
    ...indent(
      createEnumStmt.vals.reduce(
        (acc, s, i) => [
          ...acc,
          ...comment(s.codeComment),
          [
            stringLiteral(s.String.str),
            // All rows have commas except the last row.
            ...(createEnumStmt.vals.length - 1 === i ? [] : [symbol(",")]),
          ],
        ],
        [] as Block
      )
    ),
    [symbol(")"), symbol(";")],
  ];
}
