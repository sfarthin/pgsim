import { ColumnDef, CreateStmt } from "../types";
import formatCreateStmt, { toType } from "../format/createStmt";

function alterCmds(fromTable: CreateStmt, toTable: CreateStmt): string[] {
  const cmds: string[] = [];

  const fromColumns =
    (fromTable.tableElts
      ?.map((c) => ("ColumnDef" in c ? c.ColumnDef : null))
      .filter(Boolean) as ColumnDef[]) ?? [];
  const toColumns =
    (toTable.tableElts
      ?.map((c) => ("ColumnDef" in c ? c.ColumnDef : null))
      .filter(Boolean) as ColumnDef[]) ?? [];

  const droppedColumns = fromColumns.filter(
    (fc) => !toColumns.some((tc) => fc.colname === tc.colname)
  );
  for (const c of droppedColumns) {
    cmds.push(`DROP ${c.colname}`);
  }

  const addedColumns = toColumns.filter(
    (fc) => !fromColumns.some((tc) => fc.colname === tc.colname)
  );
  for (const c of addedColumns) {
    cmds.push(`ADD ${c.colname} ${toType(c)}`);
  }

  return cmds;
}

export default function createStmt(
  fromTables: CreateStmt[],
  toTables: CreateStmt[]
): string {
  const migration: string[] = [];

  // Create the table that do not exist yet.
  const tablesNotCreatedYet = toTables.filter(
    (toTable) =>
      !fromTables.some(
        (fromTable) =>
          toTable.relation.RangeVar.relname ===
          fromTable.relation.RangeVar.relname
      )
  );

  // 1 Create the tables not created yet.
  for (const t of tablesNotCreatedYet) {
    migration.push(formatCreateStmt(t));
  }

  // 2. Alter tables that have changes
  for (const t of fromTables) {
    const name = t.relation.RangeVar.relname;
    const toTable = toTables.find(
      (toTable) => toTable.relation.RangeVar.relname === name
    );

    if (toTable) {
      const cmds = alterCmds(t, toTable);
      if (cmds.length > 0) {
        migration.push(`ALTER TABLE ${name} ${cmds.join(", ")};`);
      }
    }
  }

  return migration.filter(Boolean).join("\n");
}
