import { CreateStmt, ColumnDef, Constraint } from "../types";
import { toTableConstraint } from "./constraint";
import {
  Block,
  addToLastLine,
  comment,
  keyword,
  symbol,
  _,
  identifier,
  indent,
} from "./util";
import columnDef from "./columnDef";

export default function (createStmt: CreateStmt): Block {
  const tableName = createStmt.relation.relname;
  const schemaname = createStmt.relation.schemaname;

  const columnDefs = (
    createStmt.tableElts?.map((t) => ("ColumnDef" in t ? t.ColumnDef : null)) ??
    []
  ).filter((c) => !!c) as ColumnDef[];

  const constraints = (
    createStmt.tableElts?.map((t) =>
      "Constraint" in t ? t.Constraint : null
    ) ?? []
  ).filter((c) => !!c) as Constraint[];

  return [
    ...comment(createStmt.codeComment),
    [
      keyword("CREATE"),
      _,
      keyword("TABLE"),
      ...(createStmt.if_not_exists
        ? [_, keyword("IF"), _, keyword("NOT"), _, keyword("EXISTS")]
        : []),
      _,
      ...(schemaname ? [identifier(schemaname), symbol(".")] : []),
      identifier(tableName),
      _,
      symbol("("),
    ],
    ...indent([
      ...columnDefs.reduce(
        (acc, d, i) => [
          ...acc,
          ...(i === columnDefs.length - 1 && !constraints.length
            ? columnDef(d)
            : addToLastLine(columnDef(d), [symbol(",")])),
        ],
        [] as Block
      ),

      ...constraints.reduce(
        (acc, d) => [...acc, toTableConstraint(d)],
        [] as Block
      ),
    ]),
    [symbol(")"), symbol(";")],
  ];
}
