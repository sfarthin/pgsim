import { Schema, AlterTableStmt, AlterTableCmdSubType } from "../toParser";
import { PGErrorCode, PGError } from "../errors";
import { toTableName, addFieldToTable } from "./toTableField";

export default function alterTableStmt(
  alterTableStmt: AlterTableStmt,
  schema: Schema
): Schema {
  const tables = schema.tables;
  /**
   * Make sure we have the table to update
   */
  const tableToUpdate = toTableName(alterTableStmt);
  const indexOfTable = tables
    .map((def) => toTableName(def))
    .indexOf(tableToUpdate);

  if (indexOfTable === -1 || !tables[indexOfTable]) {
    throw new PGError(
      PGErrorCode.INVALID,
      `Cannot alter "${tableToUpdate}" table because it does not exist`
    );
  }
  /**
   * Apply each cmd to table.
   */
  for (const cmd of alterTableStmt.cmds) {
    if (cmd.AlterTableCmd.subtype === AlterTableCmdSubType.ADD) {
      const columnDef = cmd.AlterTableCmd.def.ColumnDef;
      tables[indexOfTable] = addFieldToTable(tables[indexOfTable], columnDef);
    } else {
      throw new PGError(
        PGErrorCode.NOT_UNDERSTOOD,
        `Does not understand alter command ${cmd.AlterTableCmd.subtype}`
      );
    }
  }

  return {
    ...schema,
    tables,
  };
}
