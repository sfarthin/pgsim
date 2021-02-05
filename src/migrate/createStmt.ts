import {
  ColumnDef,
  ConType,
  CreateStmt,
  DefaultConstraint,
  RawExpr,
} from "../types";
import formatCreateStmt, { toType } from "../format/createStmt";
import formatRawExpr from "../format/rawExpr";

function doesRawExprMatch(a: RawExpr, b: RawExpr): boolean {
  if ("A_Const" in a && "A_Const" in b) {
    return (
      ("Float" in a.A_Const.val &&
        "Float" in b.A_Const.val &&
        a.A_Const.val.Float.str === b.A_Const.val.Float.str) ||
      ("String" in a.A_Const.val &&
        "String" in b.A_Const.val &&
        a.A_Const.val.String.str === b.A_Const.val.String.str) ||
      ("Integer" in a.A_Const.val &&
        "Integer" in b.A_Const.val &&
        a.A_Const.val.Integer.ival === b.A_Const.val.Integer.ival) ||
      ("Null" in a.A_Const.val && "Null" in b.A_Const.val)
    );
  }

  if ("TypeCast" in a && "TypeCast" in b) {
    return (
      !!a.TypeCast.arg &&
      !!b.TypeCast.arg &&
      doesRawExprMatch(a.TypeCast.arg, b.TypeCast.arg)
    );
  }

  if ("FuncCall" in a && "FuncCall" in b) {
    return (
      a.FuncCall.funcname.map((s) => s.String.str).join(".") ===
        b.FuncCall.funcname.map((s) => s.String.str).join(".") &&
      a.FuncCall.args?.length === b.FuncCall.args?.length &&
      !!a.FuncCall.args?.every((v, i) =>
        doesRawExprMatch(v, (b.FuncCall.args as any)[i])
      )
    );
  }

  return false;
}

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
          !doesRawExprMatch(
            newDefaultConstraint?.Constraint.raw_expr,
            originalDefault?.Constraint.raw_expr
          )))
    ) {
      cmds.push(
        `ALTER ${fromColumn?.colname} SET DEFAULT ${formatRawExpr(
          newDefaultConstraint?.Constraint.raw_expr
        )}`
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
