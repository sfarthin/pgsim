import { CreateEnumStmt } from "../types";
import comment from "./comment";
import { Formatter } from "./util";

export default function variableSetStmt<T>(
  createEnumStmt: CreateEnumStmt,
  f: Formatter<T>
): T[][] {
  const { keyword, _, identifier, symbol, indent, literal } = f;
  return [
    ...comment(createEnumStmt.codeComment, f),
    [
      keyword("CREATE"),
      _,
      keyword("TYPE"),
      _,
      identifier(createEnumStmt.typeName[0].String.str),
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
          ...comment(s.codeComment, f),
          [
            literal(`'${s.String.str}'`),
            // All rows have commas except the last row.
            ...(createEnumStmt.vals.length - 1 === i ? [] : [symbol(",")]),
          ],
        ],
        [] as T[][]
      )
    ),
    [symbol(")"), symbol(";")],
  ];
}
