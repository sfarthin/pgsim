import { ColumnDef, ConType, CreateStmt, DefaultConstraint } from "../types";
import formatCreateStmt, { toType } from "../format/createStmt";
import { rawValue as formatRawValue } from "../format/rawExpr";
import { NEWLINE, textFormatter } from "../format/util";

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

  /**
   * DROP COLUMN
   */
  const droppedColumns = fromColumns.filter(
    (fc) => !toColumns.some((tc) => fc.colname === tc.colname)
  );
  for (const c of droppedColumns) {
    cmds.push(`DROP ${c.colname}`);
  }

  /**
   * ADD COLUMN
   */
  const addedColumns = toColumns.filter(
    (fc) => !fromColumns.some((tc) => fc.colname === tc.colname)
  );
  for (const c of addedColumns) {
    cmds.push(`ADD ${c.colname} ${toType(c)}`);
  }

  /**
   * SET DEFAULT
   */
  for (const tc of toColumns) {
    const newDefaultConstraint = tc.constraints?.find(
      (c) => c.Constraint.contype === ConType.DEFAULT
    ) as { Constraint: DefaultConstraint } | undefined;

    const fromColumn = fromColumns.find((fc) => tc.colname === fc.colname);
    const originalDefault = fromColumn?.constraints?.find(
      (c) => c.Constraint.contype === ConType.DEFAULT
    ) as { Constraint: DefaultConstraint } | undefined;

    if (
      newDefaultConstraint?.Constraint.raw_expr &&
      (!originalDefault?.Constraint.raw_expr ||
        (originalDefault?.Constraint.raw_expr &&
          textFormatter.concat([
            formatRawValue(
              newDefaultConstraint?.Constraint.raw_expr,
              textFormatter
            )[0],
          ]) !==
            textFormatter.concat([
              formatRawValue(
                originalDefault?.Constraint.raw_expr,
                textFormatter
              )[0],
            ])))
    ) {
      cmds.push(
        `ALTER ${fromColumn?.colname} SET DEFAULT ${textFormatter.concat([
          formatRawValue(
            newDefaultConstraint?.Constraint.raw_expr,
            textFormatter
          )[0],
        ])}`
      );
    }
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
    migration.push(textFormatter.concat(formatCreateStmt(t, textFormatter)));
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

  return migration.filter(Boolean).join(NEWLINE);
}
