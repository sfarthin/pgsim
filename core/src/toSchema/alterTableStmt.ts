import { Schema, AlterTableStmt, AlterTableCmdSubType } from "../parse";
import { PGErrorCode, PGError } from "../errors";
import { toTableField, toTableName } from "./toTableField";

export default function alterTableStmt(
  alterTableStmt: AlterTableStmt,
  text: string,
  schema: Schema
): Schema {
  const tables = schema.tables;
  /**
   * Make sure we have the table to update
   */
  const tableToUpdate = toTableName(alterTableStmt);
  const indexOfTable = tables
    .map(({ def }) => toTableName(def))
    .indexOf(tableToUpdate);
  if (indexOfTable === -1 || !tables[indexOfTable]) {
    throw new Error(
      `Cannot alter "${tableToUpdate}" table because it does not exist`
    );
  }
  /**
   * Apply each cmd to table.
   */
  for (let cmd of alterTableStmt.cmds) {
    if (cmd.AlterTableCmd.subtype === AlterTableCmdSubType.ADD) {
      tables[indexOfTable].def.tableElts.push({
        ColumnDef: cmd.AlterTableCmd.def.ColumnDef,
      });
      tables[indexOfTable].text.push(text);
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
