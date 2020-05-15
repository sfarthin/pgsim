import {
  ColumnDef,
  isNullable,
  getReference,
  isPrimaryKey,
  getPrimitiveType,
  TableField,
  CreateStmt,
  AlterTableStmt,
  Schema,
  verifyColumnDef,
} from "../toParser";

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

export function toTableFields(
  schema: Schema
): { name: string; fields: TableField[] }[] {
  return schema.tables.map((def) => ({
    name: toTableName(def),
    fields: def.tableElts.map((col) => {
      const columnDef = verifyColumnDef(col.ColumnDef);
      return toTableField(columnDef);
    }),
  }));
}

export function addFieldToTable(
  def: CreateStmt,
  columnDef: ColumnDef
): CreateStmt {
  return {
    ...def,
    tableElts: def.tableElts.concat({ ColumnDef: columnDef }),
  };
}
