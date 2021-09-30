import { AlterTableCmd, AlterTableStmt, AlterTableCmdSubType } from "../types";
import comment from "./comment";
import { rawValue } from "./rawExpr";
import { toType } from "./createStmt";
import toConstraints from "./constraint";
import { Formatter } from "./util";
import rangeVar from "./rangeVar";

function alterTableCmd<T>(c: AlterTableCmd, f: Formatter<T>): T[] {
  const { keyword, _, identifier, number } = f;
  switch (c.subtype) {
    case AlterTableCmdSubType.AT_DropColumn:
      return [keyword("DROP"), _, identifier(c.name ?? "")];
    case AlterTableCmdSubType.AT_DropNotNull:
      return [
        keyword("ALTER"),
        _,
        keyword("COLUMN"),
        _,
        identifier(c.name),
        _,
        keyword("DROP"),
        _,
        keyword("NOT"),
        _,
        keyword("NULL"),
      ];
    case AlterTableCmdSubType.AT_ColumnDefault:
      if (c.def) {
        return [
          keyword("ALTER"),
          _,
          identifier(c.name),
          _,
          keyword("SET"),
          _,
          keyword("DEFAULT"),
          _,
          ...rawValue(c.def, f).flat(),
        ];
      } else {
        return [
          keyword("ALTER"),
          _,
          identifier(c.name),
          _,
          keyword("DROP"),
          _,
          keyword("DEFAULT"),
        ];
      }

    case AlterTableCmdSubType.AT_AddConstraint:
      return [keyword("ADD"), ...toConstraints([c.def.Constraint], f, true)];
    case AlterTableCmdSubType.AT_AddColumn: {
      const colname = c.def.ColumnDef.colname.match(/^[a-zA-Z][a-zA-Z0-9]*$/)
        ? c.def.ColumnDef.colname
        : JSON.stringify(c.def.ColumnDef.colname);

      const constraints =
        c.def.ColumnDef.constraints?.map((c) => c.Constraint) ?? [];

      return [
        keyword("ADD"),
        _,
        identifier(colname),
        _,
        keyword(toType(c.def.ColumnDef).toUpperCase()),
        ...toConstraints(constraints, f, true),
      ];
    }
  }
  throw new Error(`Cannot handle ${c.subtype}`);
}

export default function alterSeqStmt<T>(
  c: AlterTableStmt,
  f: Formatter<T>
): T[][] {
  const { indent, keyword, _, symbol } = f;

  return [
    ...comment(c.codeComment, f),
    [
      keyword("ALTER"),
      _,
      keyword("TABLE"),
      ...(c.missing_ok ? [_, keyword("IF"), _, keyword("EXISTS")] : []),
      ...(!c.relation.inh ? [_, keyword("ONLY")] : []),
      _,
      ...rangeVar(c.relation, f),
    ],
    ...indent(
      c.cmds
        ? c.cmds.reduce(
            (acc, e, i) => [
              ...acc,
              ...comment(e.AlterTableCmd.codeComment, f),
              // addToLastLine(alterTableCmd(e.AlterTableCmd, f), symbol(";")),
              c.cmds.length - 1 === i
                ? alterTableCmd(e.AlterTableCmd, f).concat(symbol(";"))
                : alterTableCmd(e.AlterTableCmd, f).concat(symbol(",")),
            ],
            [] as T[][]
          )
        : []
    ),
  ];
}
