import {
  ColumnDef,
  isNullable,
  getReference,
  isPrimaryKey,
  getPrimitiveType,
  TableField,
  CreateStmt,
  AlterTableStmt,
  verifyColumnDef,
} from "../toParser";
import { Schema } from "./";

export function toTableName(c: CreateStmt | AlterTableStmt): string {
  return c.relation.RangeVar.relname;
}

export function toTableField(columnDef: ColumnDef): TableField {
  return {
    name: columnDef.colname,
    type: getPrimitiveType(columnDef),
    isNullable: isNullable(columnDef.constraints || []),
    references: getReference(columnDef.constraints || []),
    isPrimaryKey: isPrimaryKey(columnDef.constraints),
  };
}

function toTableFieldsFromTable(def: CreateStmt): TableField[] {
  const fields: TableField[] = [];

  for (const t of def.tableElts || []) {
    if ("ColumnDef" in t) {
      fields.push(toTableField(verifyColumnDef(t.ColumnDef)));
    }
  }

  return fields;
}

export function toTableFields(
  schema: Schema
): { name: string; fields: TableField[] }[] {
  return schema.tables.map((def) => ({
    name: toTableName(def),
    fields: toTableFieldsFromTable(def),
  }));
}

export function addFieldToTable(
  def: CreateStmt,
  columnDef: ColumnDef
): CreateStmt {
  return {
    ...def,
    tableElts: (def.tableElts || []).concat({ ColumnDef: columnDef }),
  };
}
