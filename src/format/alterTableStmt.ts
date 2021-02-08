import { AlterTableCmd, AlterTableStmt, AlterTableCmdSubType } from "../types";
import comment from "./comment";
import rawExpr from "./rawExpr";
import constraint from "./constraint";
import { toType } from "./createStmt";
import toConstraints from "./constraint";

function alterTableCmd(c: AlterTableCmd): string {
  switch (c.subtype) {
    case AlterTableCmdSubType.DROP:
      return `DROP ${c.name}`;
    case AlterTableCmdSubType.SET_DEFAULT:
      return `ALTER ${c.name} SET DEFAULT ${c.def ? rawExpr(c.def) : 1}`;
    case AlterTableCmdSubType.ADD_CONSTRAINT:
      return `ADD ${constraint([c.def.Constraint])}`;
    case AlterTableCmdSubType.ADD_COLUMN: {
      const colname = c.def.ColumnDef.colname.match(/^[a-zA-Z][a-zA-Z0-9]*$/)
        ? c.def.ColumnDef.colname
        : JSON.stringify(c.def.ColumnDef.colname);

      const constraints =
        c.def.ColumnDef.constraints?.map((c) => c.Constraint) ?? [];

      return `ADD ${colname} ${toType(
        c.def.ColumnDef
      ).toUpperCase()}${toConstraints(constraints)}`;
    }
  }
  throw new Error(`Cannot handle ${c.subtype}`);
}

export default function alterSeqStmt(c: AlterTableStmt): string {
  const name = c.relation.RangeVar.relname;
  return `${comment(c.comment)}ALTER TABLE${c.missing_ok ? " IF EXISTS" : ""}${
    !c.relation.RangeVar.inh ? " ONLY" : ""
  } ${name} \n${c.cmds
    ?.map(
      (e) =>
        `${comment(e.AlterTableCmd.comment, 1)}\t${alterTableCmd(
          e.AlterTableCmd
        )}`
    )
    .join(",\n")};\n`;
}
