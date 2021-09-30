import { CreateStmt, ColumnDef, Constraint } from "../types";
import comment from "./comment";
import { toTableConstraint } from "./constraint";
import { Formatter, addToLastLine } from "./util";
import columnDef from "./columnDef";

export default function <T>(createStmt: CreateStmt, f: Formatter<T>): T[][] {
  const { keyword, symbol, _, identifier, indent } = f;
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
    ...comment(createStmt.codeComment, f),
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
            ? columnDef(d, f)
            : addToLastLine(columnDef(d, f), [symbol(",")])),
        ],
        [] as T[][]
      ),

      ...constraints.reduce(
        (acc, d) => [...acc, toTableConstraint(d, f)],
        [] as T[][]
      ),
    ]),
    [symbol(")"), symbol(";")],
  ];
}
