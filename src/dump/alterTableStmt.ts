import { combineComments } from "../parse/util";
import { AlterTableCmdSubType, CreateStmt, AlterTableStmt } from "../types";

export default function alterTableStmt(
  d: CreateStmt[],
  c: AlterTableStmt
): void {
  const cmds = c.cmds;
  const tablename = c.relation.RangeVar.relname;
  const table = d.find((ct) => ct.relation.RangeVar.relname === tablename);

  if (!table) {
    throw new Error(`${tablename} does not exist`);
  }

  for (const cmd of cmds) {
    if (cmd.AlterTableCmd.subtype === AlterTableCmdSubType.DROP) {
      const colname = cmd.AlterTableCmd.name;

      table.tableElts = table.tableElts?.filter(
        (tc) => !("ColumnDef" in tc) || tc.ColumnDef?.colname !== colname
      );
    } else if (cmd.AlterTableCmd.subtype == AlterTableCmdSubType.ADD_COLUMN) {
      cmd.AlterTableCmd.def.ColumnDef.comment = combineComments(
        cmd.AlterTableCmd.def.ColumnDef.comment,
        cmd.AlterTableCmd.comment
      );
      table.tableElts?.push(cmd.AlterTableCmd.def);
    }
  }
}
