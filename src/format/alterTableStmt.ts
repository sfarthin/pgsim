import { AlterTableCmd, AlterTableStmt, AlterTableCmdSubType } from "~/types";
import { rawValue } from "./rawExpr";
import typeName from "./typeName";
import toConstraints from "./constraint";
import {
  keyword,
  _,
  comment,
  identifier,
  Line,
  indent,
  symbol,
  Block,
} from "./util";
import rangeVar from "./rangeVar";

function alterTableCmd(c: AlterTableCmd): Line {
  switch (c.subtype) {
    case AlterTableCmdSubType.AT_DropConstraint:
      return [keyword("DROP"), _, keyword("CONSTRAINT"), _, identifier(c.name)];
    case AlterTableCmdSubType.AT_AlterColumnType:
      return [
        keyword("ALTER"),
        _,
        keyword("COLUMN"),
        _,
        identifier(c.name),
        _,
        keyword("TYPE"),
        _,
        ...typeName(c.def.ColumnDef.typeName),
      ];
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
          ...rawValue(c.def).flat(),
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
      return [keyword("ADD"), ...toConstraints([c.def.Constraint], true)];
    case AlterTableCmdSubType.AT_AddColumn: {
      if (!c.def.ColumnDef.colname) {
        throw new Error("Expected column name");
      }

      const constraints =
        c.def.ColumnDef.constraints?.map((c) => c.Constraint) ?? [];

      return [
        keyword("ADD"),
        _,
        identifier(c.def.ColumnDef.colname),
        _,
        ...typeName(c.def.ColumnDef.typeName),
        ...toConstraints(constraints, true),
      ];
    }
  }
  throw new Error(`Cannot handle ${c.subtype}`);
}

export default function alterSeqStmt(c: AlterTableStmt): Block {
  return [
    ...comment(c.codeComment),
    [
      keyword("ALTER"),
      _,
      keyword("TABLE"),
      ...(c.missing_ok ? [_, keyword("IF"), _, keyword("EXISTS")] : []),
      ...(!c.relation.inh ? [_, keyword("ONLY")] : []),
      _,
      ...rangeVar(c.relation),
    ],
    ...indent(
      c.cmds
        ? c.cmds.reduce(
            (acc, e, i) => [
              ...acc,
              ...comment(e.AlterTableCmd.codeComment),
              // addToLastLine(alterTableCmd(e.AlterTableCmd, f), symbol(";")),
              c.cmds.length - 1 === i
                ? alterTableCmd(e.AlterTableCmd).concat(symbol(";"))
                : alterTableCmd(e.AlterTableCmd).concat(symbol(",")),
            ],
            [] as Block
          )
        : []
    ),
  ];
}
